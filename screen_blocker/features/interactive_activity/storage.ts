export type Activity = {
  id: string;
  name: string;
  minutes: number;
  points: number;
  icon?: 'read' | 'walk' | 'stretch' | 'study';
};

export const DEFAULT_ACTIVITIES: Activity[] = [
  { id: 'read', name: 'Read', minutes: 15, points: 2, icon: 'read' },
  { id: 'walk', name: 'Walk', minutes: 10, points: 1, icon: 'walk' },
  { id: 'stretch', name: 'Stretch', minutes: 5, points: 1, icon: 'stretch' },
  { id: 'study', name: 'Study', minutes: 25, points: 3, icon: 'study' },
];

export async function getActivities(): Promise<Activity[]> {
  const { activities = DEFAULT_ACTIVITIES } = await browser.storage.local.get('activities');
  if (!Array.isArray(activities)) return DEFAULT_ACTIVITIES;

  return activities.filter((activity): activity is Activity =>
    activity != null &&
    typeof activity.id === 'string' && activity.id.length > 0 &&
    typeof activity.name === 'string' && activity.name.trim().length > 0 &&
    Number.isFinite(activity.minutes) && activity.minutes > 0 &&
    Number.isInteger(activity.points) && activity.points >= 0,
  );
}
