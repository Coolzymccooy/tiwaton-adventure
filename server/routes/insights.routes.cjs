const express = require('express');
const store = require('../data/store.cjs');

const router = express.Router();

const buildSummary = (entries = []) => {
  const summary = {
    totalEvents: entries.length,
    failureCount: 0,
    averageDuration: 0,
    viewMetrics: {},
    recentErrors: [],
  };

  let totalDuration = 0;

  entries.forEach((entry) => {
    if (!entry) return;
    const view = String(entry.view || 'unknown');
    const duration = Number(entry.durationSeconds) || 0;
    const hasError = Boolean(entry.error);

    if (hasError) summary.failureCount += 1;
    totalDuration += duration;

    if (!summary.viewMetrics[view]) {
      summary.viewMetrics[view] = {
        count: 0,
        totalDuration: 0,
        avgDuration: 0,
        failures: 0,
      };
    }

    const viewMeta = summary.viewMetrics[view];
    viewMeta.count += 1;
    viewMeta.totalDuration += duration;
    if (hasError) viewMeta.failures += 1;
  });

  summary.averageDuration = entries.length > 0 ? Number((totalDuration / entries.length).toFixed(1)) : 0;

  Object.keys(summary.viewMetrics).forEach((view) => {
    const meta = summary.viewMetrics[view];
    if (meta.count > 0) {
      meta.avgDuration = Number((meta.totalDuration / meta.count).toFixed(1));
    }
    delete meta.totalDuration;
  });

  summary.recentErrors = entries
    .filter((entry) => entry && entry.error)
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    .slice(0, 6)
    .map(({ view, event, error, timestamp }) => ({
      view: view || 'unknown',
      event: event || 'unknown',
      error: String(error).slice(0, 250),
      timestamp: Number(timestamp || Date.now()),
    }));

  return summary;
};

router.get('/summary', (req, res) => {
  try {
    const entries = store.loadTelemetry();
    const summary = buildSummary(entries);
    res.json({ summary });
  } catch (error) {
    console.error('[insights] failed to summarize telemetry', error);
    res.status(500).json({ error: 'Failed to build insights' });
  }
});

module.exports = router;
