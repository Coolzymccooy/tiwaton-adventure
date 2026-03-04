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

router.post("/login", (req, res) => {
  const { identity, secret, classCode } = req.body;

  if (!identity || !secret) {
    return res.status(400).json({ error: "Missing identity or secret" });
  }

  const snapshot = store.findSnapshotByCredentials(identity, secret, classCode);

  if (snapshot) {
    res.json({ ok: true, snapshot });
  } else {
    res.status(401).json({ error: "Account not found or invalid credentials" });
  }
});

module.exports = router;
