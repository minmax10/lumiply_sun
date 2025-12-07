import { Product, LightingColor } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'FADO',
    price: '$29.99',
    category: 'Table Lamp',
    image: 'https://picsum.photos/seed/fado/400/400',
    description: 'Soft mood light, globe shape.'
  },
  {
    id: '2',
    name: 'HEKTAR',
    price: '$69.99',
    category: 'Floor Lamp',
    image: 'https://picsum.photos/seed/hektar/400/400',
    description: 'Industrial style, dark grey.'
  },
  {
    id: '3',
    name: 'SYMFONISK',
    price: '$199.00',
    category: 'Speaker Lamp',
    image: 'https://picsum.photos/seed/symfonisk/400/400',
    description: 'Wi-Fi speaker and lamp in one.'
  },
  {
    id: '4',
    name: 'TOKABO',
    price: '$12.99',
    category: 'Table Lamp',
    image: 'https://picsum.photos/seed/tokabo/400/400',
    description: 'Small glass mushroom lamp.'
  },
  {
    id: '5',
    name: 'VICKLEBY',
    price: '$14.99',
    category: 'Floor Lamp',
    image: 'https://picsum.photos/seed/vickleby/400/400',
    description: 'Paper shade, handmade feel.'
  },
  {
    id: '6',
    name: 'ISJAKT',
    price: '$99.00',
    category: 'LED Uplighter',
    image: 'https://picsum.photos/seed/isjakt/400/400',
    description: 'Dimmable, reading lamp integrated.'
  }
];

export const COLORS_TO_GENERATE = [
  LightingColor.RED,
  LightingColor.ORANGE,
  LightingColor.YELLOW,
  LightingColor.GREEN,
  LightingColor.BLUE,
  LightingColor.PURPLE
];

export const SYSTEM_INSTRUCTION = `You are an expert interior lighting designer. 
Your task is to take an input image of a room and re-imagine it with specific colored lighting. 
Maintain the original furniture, layout, and perspective exactly. 
Only change the ambient lighting color and atmosphere. 
Make it look photorealistic, like high-end architectural photography.`;