import { Product, LightingColor } from './types';

// In a real app (lumiply-client), this data would come from lumiply-server
export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'ikea-hektar',
    name: 'HEKTAR',
    price: '$69.99',
    category: 'Floor Lamp',
    image: 'https://www.ikea.com/us/en/images/products/hektar-floor-lamp-dark-gray__0880579_pe656209_s5.jpg?f=xl', 
    description: 'Industrial style, dark grey. Distinct oversized lamp head.'
  },
  {
    id: 'ikea-isjakt',
    name: 'ISJAKT',
    price: '$99.00',
    category: 'LED Floor Uplighter',
    image: 'https://www.ikea.com/us/en/images/products/isjakt-led-floor-uplighter-reading-lamp-dimmable-nickel-plated__0967664_pe810185_s5.jpg?f=xl',
    description: 'Dimmable, reading lamp integrated. Modern functionality.'
  },
  {
    id: 'ikea-vickleby',
    name: 'VICKLEBY',
    price: '$14.99',
    category: 'Floor Lamp',
    image: 'https://www.ikea.com/us/en/images/products/vickleby-floor-lamp-white-handmade__1059739_pe849767_s5.jpg?f=xl',
    description: 'Paper shade, handmade feel. Diffused decorative light.'
  },
  {
    id: 'ikea-fado',
    name: 'FADO',
    price: '$29.99',
    category: 'Table Lamp',
    image: 'https://www.ikea.com/us/en/images/products/fado-table-lamp-white__0880373_pe613763_s5.jpg?f=xl',
    description: 'Soft mood light, globe shape. Perfect for cozy corners.'
  },
  {
    id: 'ikea-symfonisk',
    name: 'SYMFONISK',
    price: '$199.00',
    category: 'Speaker Lamp',
    image: 'https://www.ikea.com/us/en/images/products/symfonisk-speaker-lamp-w-wi-fi-glass-shade-white__1073238_pe855639_s5.jpg?f=xl',
    description: 'Wi-Fi speaker and lamp in one. Rich sound, warm light.'
  },
  {
    id: 'ikea-tokabo',
    name: 'TOKABO',
    price: '$12.99',
    category: 'Table Lamp',
    image: 'https://www.ikea.com/us/en/images/products/tokabo-table-lamp-glass-opal-white__0714488_pe730107_s5.jpg?f=xl',
    description: 'Small glass mushroom lamp. Adds a touch of purple.'
  },
  {
    id: 'ikea-dejsa',
    name: 'DEJSA',
    price: '$49.99',
    category: 'Table Lamp',
    image: 'https://www.ikea.com/us/en/images/products/dejsa-table-lamp-beige-opal-white-glass__0967527_pe810153_s5.jpg?f=xl',
    description: 'Bamboo details, mouth-blown glass. Organic modern.'
  },
  {
    id: 'ikea-tertial',
    name: 'TERTIAL',
    price: '$19.99',
    category: 'Work Lamp',
    image: 'https://www.ikea.com/us/en/images/products/tertial-work-lamp-with-led-bulb-dark-gray__0882772_pe613768_s5.jpg?f=xl',
    description: 'Classic steel work lamp. Adjustable arm and head.'
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