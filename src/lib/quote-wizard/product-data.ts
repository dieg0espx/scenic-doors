export interface Product {
  name: string;
  slug: string;
  image: string;
  features: string[];
  basePrice: number;
}

export const PRODUCTS: Product[] = [
  {
    name: "Multi-Slide & Pocket",
    slug: "multi-slide-pocket",
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/v1771414504/multislide_and_pocket_wisqby.png",
    features: [
      "Disappears into wall",
      "Modern & sleek",
      "Space-saving design",
    ],
    basePrice: 8500,
  },
  {
    name: "Ultra Slim Multi-Slide",
    slug: "ultra-slim",
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/v1771414503/ultra_slim_multi_side_lw7gci.png",
    features: [
      "Minimal frames",
      "Maximum views",
      "Weather-sealed",
    ],
    basePrice: 12000,
  },
  {
    name: "Bi-Fold Doors",
    slug: "bi-fold",
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/v1771414503/bi_fold_doors_lv0unn.png",
    features: [
      "Space-saving",
      "Wide openings",
      "Premium hardware",
    ],
    basePrice: 7500,
  },
  {
    name: "Slide-&-Stack",
    slug: "slide-stack",
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/v1771414503/slide_and_stack_zrlgyc.png",
    features: [
      "Flexible widths",
      "German precision",
      "Minimal frame design",
    ],
    basePrice: 9000,
  },
  {
    name: "Awning Window",
    slug: "awning-window",
    image: "https://res.cloudinary.com/dku1gnuat/image/upload/v1771414503/awning_window_ndamee.png",
    features: [
      "Weather protection",
      "Enhanced security",
      "Energy-efficient",
    ],
    basePrice: 6000,
  },
];
