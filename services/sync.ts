import { apiUrl, postJson } from './api';
import type { Drawing, Story, GameStat, CountdownEvent, FamilyProfile } from '../types';

export type SnapshotPayload = {
  profileId: string;
  profiles: FamilyProfile[];
  stories: Story[];
  drawings: Drawing[];
  gameStats: GameStat;
  events: CountdownEvent[];
  usage: Record<string, Record<string, number>>;
  lastView?: string;
};

export type TelemetryPayload = {
  profileId: string;
  view: string;
  event: string;
  durationSeconds?: number;
  error?: string;
};

const postSnapshot = async (path: string, body: any) => {
  return postJson<{ ok: boolean }>(path, body);
};

export const SyncService = {
  async sendSnapshot(snapshot: SnapshotPayload) {
    try {
      await postSnapshot('/api/sync/snapshot', snapshot);
    } catch (error) {
      console.warn('Snapshot sync failed', error);
    }
  },

  async fetchSnapshot(profileId: string) {
    try {
      const res = await fetch(apiUrl(`/api/sync/snapshot/${profileId}`), {
        credentials: 'include',
      });
      if (!res.ok) return null;
      const json = await res.json();
      return json?.snapshot ?? null;
    } catch (error) {
      console.warn('Fetching snapshot failed', error);
      return null;
    }
  },

  async logTelemetry(payload: TelemetryPayload) {
    try {
      await postSnapshot('/api/sync/telemetry', payload);
    } catch (error) {
      console.warn('Telemetry log failed', error);
    }
  },
};
