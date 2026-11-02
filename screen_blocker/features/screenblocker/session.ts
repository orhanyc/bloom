import type { Activity } from '../interactive_activity/storage';

export type FocusSession = {
  id: string;
  activity: Activity;
  startedAt: number;
  endsAt: number;
  phase: 'focus' | 'confirm';
};

export function getSessionKey(site: string) {
  return `focusSession:${site}`;
}

export async function getFocusSession(site: string): Promise<FocusSession | null> {
  const key = getSessionKey(site);
  const result = await browser.storage.local.get(key);
  return (result[key] as FocusSession | null | undefined) ?? null;
}

export async function startFocusSession(site: string, activity: Activity) {
  const existing = await getFocusSession(site);
  if (existing) return existing;

  const startedAt = Date.now();
  const session: FocusSession = {
    id: crypto.randomUUID(),
    activity,
    startedAt,
    endsAt: startedAt + activity.minutes * 60_000,
    phase: 'focus',
  };
  await browser.storage.local.set({ [getSessionKey(site)]: session });
  return session;
}

export async function confirmFocusSession(site: string, session: FocusSession) {
  if ((await getFocusSession(site))?.id !== session.id) return;
  await browser.storage.local.set({
    [getSessionKey(site)]: { ...session, phase: 'confirm' },
  });
}

export async function finishFocusSession(site: string, session: FocusSession, completed: boolean) {
  if ((await getFocusSession(site))?.id !== session.id) return false;

  const next: Record<string, unknown> = { [getSessionKey(site)]: null };
  if (completed) {
    const key = `activityCompletion:${session.id}`;
    const existing = await browser.storage.local.get(key);
    if (!existing[key]) {
      next[key] = {
        id: session.id,
        site,
        activity: session.activity,
        points: session.activity.points,
        startedAt: session.startedAt,
        completedAt: Date.now(),
      };
    }
  }

  await browser.storage.local.set(next);
  return true;
}
