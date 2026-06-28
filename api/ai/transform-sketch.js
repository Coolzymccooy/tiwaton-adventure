const MODEL = "@cf/runwayml/stable-diffusion-v1-5-img2img";
const REQUEST_TIMEOUT_MS = 45_000;
const MAX_IMAGE_DATA_URL_LENGTH = 6_000_000;

function getCloudflareConfig() {
  const accountId = String(process.env.CLOUDFLARE_ACCOUNT_ID || "").trim();
  const token = String(
    process.env.CLOUDFLARE_WORKERS_AI_TOKEN ||
    process.env.CLOUDFLARE_AI_API_TOKEN ||
    process.env.CLOUDFLARE_API_TOKEN ||
    ""
  ).trim();

  return accountId && token ? { accountId, token } : null;
}

function parseImageDataUrl(value) {
  if (typeof value !== "string" || value.length > MAX_IMAGE_DATA_URL_LENGTH) return null;
  const match = value.match(/^data:image\/(?:png|jpeg|webp);base64,([A-Za-z0-9+/=\s]+)$/);
  return match ? match[1].replace(/\s/g, "") : null;
}

module.exports = async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const config = getCloudflareConfig();
  if (!config) {
    return res.status(503).json({ error: "AI image service is not configured" });
  }

  const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
  const imageBase64 = parseImageDataUrl(body?.imageDataUrl);
  if (!imageBase64) {
    return res.status(400).json({ error: "A valid PNG, JPEG, or WebP image is required" });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const url =
      `https://api.cloudflare.com/client/v4/accounts/${encodeURIComponent(config.accountId)}` +
      `/ai/run/${MODEL}`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.token}`,
        "Content-Type": "application/json",
        Accept: "image/png, application/json",
      },
      body: JSON.stringify({
        prompt:
          "Transform this child-friendly sketch into a polished, bright 3D rendered illustration. " +
          "Preserve the original subject, composition, colors, and friendly appearance.",
        negative_prompt:
          "scary, violent, dark, distorted, extra limbs, text, watermark, adult content",
        image_b64: imageBase64,
        num_steps: 20,
        strength: 0.72,
        guidance: 7.5,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const details = (await response.text().catch(() => "")).slice(0, 300);
      console.error("[ai] Cloudflare image transform failed", {
        status: response.status,
        details,
      });
      return res.status(response.status === 429 ? 429 : 502).json({
        error:
          response.status === 429
            ? "AI image quota is temporarily exhausted"
            : "AI image transformation failed",
      });
    }

    const contentType = String(response.headers.get("content-type") || "").toLowerCase();
    if (contentType.includes("application/json")) {
      const payload = await response.json();
      const resultImage = payload?.result?.image;
      if (!resultImage) return res.status(502).json({ error: "AI returned no image" });
      return res.status(200).json({
        imageDataUrl: `data:image/png;base64,${resultImage}`,
        provider: "cloudflare",
      });
    }

    const bytes = Buffer.from(await response.arrayBuffer());
    if (!bytes.length) return res.status(502).json({ error: "AI returned an empty image" });

    return res.status(200).json({
      imageDataUrl: `data:${contentType || "image/png"};base64,${bytes.toString("base64")}`,
      provider: "cloudflare",
    });
  } catch (error) {
    const timedOut = error?.name === "AbortError";
    console.error("[ai] Vercel image transform failed", {
      timedOut,
      message: error?.message || String(error),
    });
    return res.status(timedOut ? 504 : 500).json({
      error: timedOut ? "AI image transformation timed out" : "AI image service failed",
    });
  } finally {
    clearTimeout(timer);
  }
};

module.exports.config = {
  maxDuration: 60,
};
