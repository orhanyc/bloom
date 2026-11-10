
export const POINTS_PER_HOUR = 100;
export const POINTS_PER_FLOWER = 1000;
export const POINTS_PER_STAGE = 250;
export const BYPASS_PENALTY = 100;

export type FlowerStage =
  | 'seedling'
  | 'sprout'
  | 'leafy'
  | 'bud'
  | 'fully-grown';

export type ActiveFlower = {
  points: number;
  highestPoints: number;
};

export type CollectedFlower = {
  id: string;
  collectedAt: number;
};

export type FlowerGrowthData = {
  activeFlower: ActiveFlower;
  collection: CollectedFlower[];
  processedActivities: string[];
};

const DEFAULT_GROWTH_DATA: FlowerGrowthData = {
  activeFlower: {
    points: 0,
    highestPoints: 0,
  },
  collection: [],
  processedActivities: [],
};

export function calculateActivityPoints(minutes: number): number {
  return Math.round((minutes / 60) * POINTS_PER_HOUR);
}

export function getFlowerStage(points: number): FlowerStage {
  if (points >= POINTS_PER_FLOWER) return 'fully-grown';
  if (points >= 750) return 'bud';
  if (points >= 500) return 'leafy';
  if (points >= 250) return 'sprout';
  return 'seedling';
}

// A flower is wilted when its current progress is below its previous best.
export function isFlowerWilted(flower: ActiveFlower): boolean {
  return flower.points < flower.highestPoints;
}

export async function getFlowerGrowth(): Promise<FlowerGrowthData> {
  const result = await browser.storage.local.get('flowerGrowth');
  const saved = result.flowerGrowth as Partial<FlowerGrowthData> | undefined;

  const points = saved?.activeFlower?.points ?? 0;

  return {
    activeFlower: {
      points,
      highestPoints:
        saved?.activeFlower?.highestPoints ?? points,
    },
    collection: Array.isArray(saved?.collection)
      ? saved.collection
      : [],
    processedActivities: Array.isArray(saved?.processedActivities)
      ? saved.processedActivities
      : [],
  };
}

export async function saveFlowerGrowth(data: FlowerGrowthData) {
  await browser.storage.local.set({ flowerGrowth: data });
}

// Award points only once for each completed activity session.
export async function awardFlowerPoints(
  minutes: number,
  sessionId: string,
): Promise<number> {
  const data = await getFlowerGrowth();

  if (data.processedActivities.includes(sessionId)) {
    return 0;
  }

  const earnedPoints = calculateActivityPoints(minutes);
  let remainingPoints = data.activeFlower.points + earnedPoints;

  // Collect a flower whenever it reaches 1,000 points.
  while (remainingPoints >= POINTS_PER_FLOWER) {
    data.collection.push({
      id: crypto.randomUUID(),
      collectedAt: Date.now(),
    });

    remainingPoints -= POINTS_PER_FLOWER;
  }

  // Start the next flower with its remaining progress.
  // If no flower was collected, preserve the previous highest progress.
  const highestPoints =
    data.activeFlower.points + earnedPoints >= POINTS_PER_FLOWER
      ? remainingPoints
      : Math.max(data.activeFlower.highestPoints, remainingPoints);

  data.activeFlower = {
    points: remainingPoints,
    highestPoints,
  };

  data.processedActivities.push(sessionId);

  await saveFlowerGrowth(data);

  return earnedPoints;
}

// Deduct points when the user bypasses a blocked site.
export async function deductFlowerPoints(): Promise<number> {
  const data = await getFlowerGrowth();

  const deductedPoints = Math.min(
    data.activeFlower.points,
    BYPASS_PENALTY,
  );

  data.activeFlower.points -= deductedPoints;

  await saveFlowerGrowth(data);

  return deductedPoints;
}

