
export type DisplayFlower = {
  id: string;
  name: string;
  image: string;
  position: {
    left: string;
    bottom: string;
  };
};

export const displayFlowers: DisplayFlower[] = [
  // Top shelf
  {
    id: 'flower-1',
    name: 'Bloom 1',
    image: '/flower-progression/fully-grown.svg',
    position: { left: '20%', bottom: '68%' },
  },
  /*{
    id: 'flower-2',
    name: 'Bloom 2',
    image: '/flower-progression/fully-grown.svg',
    position: { left: '50%', bottom: '68%' },
  },
  {
    id: 'flower-3',
    name: 'Bloom 3',
    image: '/flower-progression/fully-grown.svg',
    position: { left: '80%', bottom: '68%' },
  },

  // Middle shelf
  {
    id: 'flower-4',
    name: 'Bloom 4',
    image: '/flower-progression/fully-grown.svg',
    position: { left: '20%', bottom: '35%' },
  },
  {
    id: 'flower-5',
    name: 'Bloom 5',
    image: '/flower-progression/fully-grown.svg',
    position: { left: '50%', bottom: '35%' },
  },
  {
    id: 'flower-6',
    name: 'Bloom 6',
    image: '/flower-progression/fully-grown.svg',
    position: { left: '80%', bottom: '35%' },
  },

  // Bottom shelf
  {
    id: 'flower-7',
    name: 'Bloom 7',
    image: '/flower-progression/fully-grown.svg',
    position: { left: '20%', bottom: '3%' },
  },
  {
    id: 'flower-8',
    name: 'Bloom 8',
    image: '/flower-progression/fully-grown.svg',
    position: { left: '50%', bottom: '3%' },
  },
  {
    id: 'flower-9',
    name: 'Bloom 9',
    image: '/flower-progression/fully-grown.svg',
    position: { left: '80%', bottom: '3%' },
  },*/
];
