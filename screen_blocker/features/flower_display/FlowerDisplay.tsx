
import { displayFlowers } from './flowerData';
import './FlowerDisplay.css';

function FlowerDisplay() {
  return (
    <main className="flower-display">
      <header className="flower-display-header">
        <h1>My Garden</h1>
        <p>Your fully grown flowers</p>
      </header>

      <section className="display-case">
        {displayFlowers.length > 0 ? (
          displayFlowers.map((flower) => (
            <img
              key={flower.id}
              className="display-flower"
              src={flower.image}
              alt={flower.name}
              title={flower.name}
              style={{
                left: flower.position.left,
                bottom: flower.position.bottom,
              }}
            />
          ))
        ) : (
          <p className="empty-garden">
            Your display case is empty. Grow a flower to add it here!
          </p>
        )}
      </section>

      <p className="flower-count">
        {displayFlowers.length}{' '}
        {displayFlowers.length === 1 ? 'flower' : 'flowers'} collected
      </p>
    </main>
  );
}

export default FlowerDisplay;
