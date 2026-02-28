const fs = require('fs');
const path = require('path');

const BASE_DIR = path.join(__dirname);
const SNAPSHOT_FILE = path.join(BASE_DIR, 'snapshots.json');
const TELEMETRY_FILE = path.join(BASE_DIR, 'telemetry.json');

const ensureDir = () => {
  if (!fs.existsSync(BASE_DIR)) {
    fs.mkdirSync(BASE_DIR, { recursive: true });
  }
};

const readJson = (file, defaultValue) => {
  ensureDir();
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(defaultValue, null, 2));
    return defaultValue;
  }
  try {
    const raw = fs.readFileSync(file, 'utf8');
    return JSON.parse(raw || 'null') || defaultValue;
  } catch (error) {
    console.warn('[store] failed to parse', file, error.message);
    return defaultValue;
  }
};

const writeJson = (file, value) => {
  ensureDir();
  fs.writeFileSync(file, JSON.stringify(value, null, 2));
};

const loadSnapshots = () => readJson(SNAPSHOT_FILE, {});
const saveSnapshots = (data) => writeJson(SNAPSHOT_FILE, data);
const loadTelemetry = () => readJson(TELEMETRY_FILE, []);
const saveTelemetry = (list) => writeJson(TELEMETRY_FILE, list);

module.exports = {
  loadSnapshots,
  saveSnapshots,
  appendSnapshot(profileId, snapshot) {
    const data = loadSnapshots();
    data[profileId] = { ...snapshot, savedAt: Date.now() };
    saveSnapshots(data);
    return data[profileId];
  },
  getSnapshot(profileId) {
    const data = loadSnapshots();
    return data[profileId] || null;
  },
  appendTelemetry(entry) {
    const list = loadTelemetry();
    list.push({ ...(entry || {}), timestamp: Date.now() });
    saveTelemetry(list.slice(-5000));
  },
  loadTelemetry,
  findSnapshotByCredentials(identity, secret) {
    const data = loadSnapshots();
    const normalizedIdentity = identity.trim().toLowerCase();

    for (const snapshot of Object.values(data)) {
      if (!snapshot.profiles) continue;

      const match = snapshot.profiles.find(p => {
        if (p.mode === 'PARENT') {
          return p.email && p.email.toLowerCase() === normalizedIdentity && p.pin === secret;
        } else {
          return p.childName.toLowerCase() === normalizedIdentity && (p.password || '').toLowerCase() === secret.trim().toLowerCase();
        }
      });

      if (match) return snapshot;
    }
    return null;
  }
};
