import React, { createContext, useContext, useMemo, useRef, useState } from 'react';
import { initialState } from './initialState';

type Credentials = { athleteId: string; apiKey: string } | null;

type AppState = typeof initialState & {
  intervalsCredentials: Credentials;
};

type AppContextType = {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  intervalsSyncing: boolean;
  intervalsSyncError: string | null;
  syncIntervals: () => Promise<void>;
};

const AppContext = createContext<AppContextType | null>(null);

const DEFAULT_STATE: AppState = {
  ...initialState,
  intervalsCredentials: null,
  analytics: {
    ...initialState.analytics,
    dailyStats: [
      { date: new Date(Date.now() - 2 * 86400000).toISOString(), recovery: 66, strain: 74, sleep: 75 },
      { date: new Date(Date.now() - 86400000).toISOString(), recovery: 71, strain: 63, sleep: 79 },
      { date: new Date().toISOString(), recovery: 78, strain: 52, sleep: 84 },
    ],
    hrv: {
      current: { value: 61, status: 'stabil' },
      history: [
        { date: new Date(Date.now() - 2 * 86400000).toISOString(), value: 64 },
        { date: new Date(Date.now() - 86400000).toISOString(), value: 58 },
        { date: new Date().toISOString(), value: 61 },
      ],
    },
    vo2Max: { value: 54, status: 'gut' },
    restingHR: { value: 48, status: 'niedrig' },
    trainingReadiness: { value: 82, status: 'bereit' },
    bodyBattery: { value: 76, status: 'hoch' },
    stressLevel: { value: 23, status: 'niedrig' },
    trainingStatus: { value: 'Produktiv' },
    weeklyRecovery: { value: 81 },
    acuteLoad: { value: 742 },
    chronicLoad: { value: 688 },
    loadRatio: { value: 1.08, status: 'optimal' },
    weeklyStrain: { value: 14.6 },
    sleepScore: { value: 84, status: 'gut' },
    sleepStages: {
      deep: { value: 92 },
      rem: { value: 104 },
      light: { value: 265 },
      awake: { value: 23 },
    },
    physiologicalMarkers: {
      respiratoryRate: { value: 14 },
      bloodOxygen: { value: 98 },
      skinTemp: { value: 36.6 },
      bloodPressure: { value: '118/72' },
      weight: { value: 74.8 },
    },
    intervals: { wellness: [], activities: [], athlete: undefined },
  },
};

const API_BASE = (process.env.EXPO_PUBLIC_API_URL ?? '');

export function AppProvider({ children }: React.PropsWithChildren) {
  const [state, setState] = useState<AppState>(DEFAULT_STATE);
  const [intervalsSyncing, setIntervalsSyncing] = useState(false);
  const [intervalsSyncError, setIntervalsSyncError] = useState<string | null>(null);

  async function syncIntervals() {
    const creds = state.intervalsCredentials;
    if (!creds) return;
    setIntervalsSyncing(true);
    setIntervalsSyncError(null);
    try {
      const headers = {
        'x-intervals-key': creds.apiKey,
        'x-intervals-id': creds.athleteId,
      };
      const [wellnessRes, activitiesRes, athleteRes] = await Promise.all([
        fetch(`${API_BASE}/api/intervals/wellness?days=60`, { headers }),
        fetch(`${API_BASE}/api/intervals/activities?days=60&limit=30`, { headers }),
        fetch(`${API_BASE}/api/intervals/athlete`, { headers }),
      ]);
      const [wellness, activities, athlete] = await Promise.all([
        wellnessRes.json(),
        activitiesRes.json(),
        athleteRes.json(),
      ]);
      setState((prev) => ({
        ...prev,
        analytics: {
          ...prev.analytics,
          intervals: { wellness: wellness ?? [], activities: activities ?? [], athlete },
        },
      }));
    } catch (e) {
      setIntervalsSyncError('Sync fehlgeschlagen – prüfe Verbindung');
    } finally {
      setIntervalsSyncing(false);
    }
  }

  const value = useMemo(
    () => ({ state, setState, intervalsSyncing, intervalsSyncError, syncIntervals }),
    [state, intervalsSyncing, intervalsSyncError],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
