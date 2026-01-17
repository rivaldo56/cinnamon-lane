import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Classic Cinnamon Roll',
    description: 'Our signature roll. 24-hour brioche dough, Ceylon cinnamon, and a cream cheese glaze.',
    price: 450,
    image: 'https://picsum.photos/id/1080/800/800',
    hoverImage: 'https://picsum.photos/id/1062/800/800',
    stock: 4,
    isActive: true,
    category: 'pastry'
  },
  {
    id: '2',
    name: 'Cardamom Knot',
    description: 'A Nairobi favorite. Spiced dough twisted with brown sugar and fresh cardamom.',
    price: 350,
    image: 'https://picsum.photos/id/835/800/800',
    hoverImage: 'https://picsum.photos/id/431/800/800',
    stock: 12,
    isActive: true,
    category: 'pastry'
  },
  {
    id: '3',
    name: 'Artisan Sourdough',
    description: 'Crusty, chewy, and perfectly fermented. Baked fresh at 4 AM daily.',
    price: 600,
    image: 'https://picsum.photos/id/999/800/800',
    hoverImage: 'https://picsum.photos/id/365/800/800',
    stock: 2,
    isActive: true,
    category: 'bread'
  },
  {
    id: '4',
    name: 'Pain au Chocolat',
    description: 'Dark Belgian chocolate folded into 81 layers of butter pastry.',
    price: 400,
    image: 'https://picsum.photos/id/292/800/800',
    hoverImage: 'https://picsum.photos/id/493/800/800',
    stock: 8,
    isActive: true,
    category: 'pastry'
  },
  {
    id: '5',
    name: 'Espresso Walnut Cake',
    description: 'Dense, moist cake infused with single-origin Kenyan espresso.',
    price: 550,
    image: 'https://picsum.photos/id/486/800/800',
    hoverImage: 'https://picsum.photos/id/225/800/800',
    stock: 0, // Out of stock example
    isActive: true,
    category: 'cake'
  },
  {
    id: '6',
    name: 'Savory Feta Danish',
    description: 'Flaky pastry topped with whipped feta, thyme, and roasted tomatoes.',
    price: 450,
    image: 'https://picsum.photos/id/139/800/800',
    hoverImage: 'https://picsum.photos/id/674/800/800',
    stock: 15,
    isActive: true,
    category: 'pastry'
  }
];
