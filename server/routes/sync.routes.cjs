const express = require("express");
const store = require("../data/store.cjs");

const router = express.Router();

router.post("/snapshot", (req, res) => {
  const payload = req.body;
  if (!payload || !payload.profileId) {
    return res.status(400).json({ error: "Missing profileId" });
  }
  const saved = store.appendSnapshot(payload.profileId, payload);
  res.json({ ok: true, saved });
});

router.get("/snapshot/:profileId", (req, res) => {
  const { profileId } = req.params;
  if (!profileId) {
    return res.status(400).json({ error: "Missing profileId" });
  }
  const snapshot = store.getSnapshot(profileId);
  res.json({ snapshot });
});

router.post("/telemetry", (req, res) => {
  const payload = req.body;
  if (!payload || !payload.profileId || !payload.view) {
    return res.status(400).json({ error: "Missing telemetry data" });
  }
  store.appendTelemetry(payload);
  res.json({ ok: true });
});

module.exports = router;
