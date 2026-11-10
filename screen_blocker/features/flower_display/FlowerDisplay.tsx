import { useEffect, useState } from 'react';
import {
  getFlowerGrowth,
  getFlowerStage,
  isFlowerWilted,
  type FlowerGrowthData,
} from '../flower_growth/storage';
import './FlowerDisplay.css';

const shelfPositions = [
  // Top shelf
  { left: '20%', bottom: '68%' },
  { left: '50%', bottom: '68%' },
  { left: '80%', bottom: '68%' },

  // Middle shelf
  { left: '20%', bottom: '35%' },
  { left: '50%', bottom: '35%' },
  { left: '80%', bottom: '35%' },

  // Bottom shelf
  { left: '20%', bottom: '3%' },
  { left: '50%', bottom: '3%' },
  { left: '80%', bottom: '3%' },
];

function FlowerDisplay() {
  const [growth, setGrowth] = useState<FlowerGrowthData | null>(null);

  useEffect(() => {
    let active = true;

    async function loadGrowth() {
      const data = await getFlowerGrowth();

      if (active) {
        setGrowth(data);
      }
    }

    void loadGrowth();

    const handleStorageChange = (
      changes: Record<string, { newValue?: unknown }>,
      areaName: string,
    ) => {
      if (areaName === 'local' && changes.flowerGrowth) {
        void loadGrowth();
      }
    };

    browser.storage.onChanged.addListener(handleStorageChange);

    return () => {
      active = false;
      browser.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  const points = growth?.activeFlower.points ?? 0;
  const stage = getFlowerStage(points);
  const wilted = growth
    ? isFlowerWilted(growth.activeFlower)
    : false;

  const flowerImage = `/flower-progression/${
    wilted && stage !== 'seedling' ? 'wilted-' : ''
  }${stage}.svg`;

  const stageName = stage
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const collection = growth?.collection ?? [];

  return (
    <main className="flower-display">
      <header className="flower-display-header">
        <h1>My Garden</h1>
        <p>Your fully grown flowers</p>
      </header>

      <section className="display-case">
        {collection.length > 0 ? (
          collection.slice(0, shelfPositions.length).map((flower, index) => {
            const position = shelfPositions[index];

            if (!position) return null;

            return (
              <img
                key={flower.id}
                className="display-flower"
                src="/flower-progression/fully-grown.svg"
                alt={`Bloom ${index + 1}`}
                title={`Bloom ${index + 1}`}
                style={{
                  left: position.left,
                  bottom: position.bottom,
                }}
              />
            );
          })
        ) : (
          <p className="empty-garden">
            Your display case is empty. Grow a flower to add it here!
          </p>
        )}
      </section>

      <p className="flower-count">
        {collection.length}{' '}
        {collection.length === 1 ? 'flower' : 'flowers'} collected
      </p>

      <section className="active-flower">
        <h2>Current Flower</h2>

        <div className="active-flower-content">
          <img
            className="active-flower-image"
            src={flowerImage}
            alt={wilted ? `Wilted ${stageName}` : stageName}
          />

          <div className="active-flower-info">
            <h3>{stageName}</h3>

            {wilted && (
              <p className="wilted-message">Recovering...</p>
            )}

            <p className="active-flower-points">
              {points.toLocaleString()} / 1,000 points
            </p>

            <div
              className="flower-progress-track"
              role="progressbar"
              aria-valuenow={points}
              aria-valuemin={0}
              aria-valuemax={1000}
              aria-label="Flower growth progress"
            >
              <div
                className="flower-progress-fill"
                style={{ width: `${Math.min(points / 10, 100)}%` }}
              />
            </div>

            <p className="flower-progress-label">
              {Math.floor(points / 10)}% grown
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default FlowerDisplay;
