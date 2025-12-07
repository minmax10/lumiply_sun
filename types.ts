export interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  image: string;
  description: string;
}

export interface PlacedProduct {
  uniqueId: string;
  product: Product;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
}

export interface GeneratedImage {
  id: string;
  url: string; // Base64 or Blob URL
  color: string;
  timestamp: number;
}

export interface HistoryItem {
  id: string;
  originalImage: string;
  generatedVariants: GeneratedImage[];
  date: string;
}

export enum LightingColor {
  ORIGINAL = "Original",
  RED = "Red",
  ORANGE = "Orange",
  YELLOW = "Yellow",
  GREEN = "Green",
  BLUE = "Blue",
  PURPLE = "Purple"
}