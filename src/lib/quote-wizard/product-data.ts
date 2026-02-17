export interface Product {
  name: string;
  slug: string;
  image: string;
  features: string[];
  basePrice: number;
}

export const PRODUCTS: Product[] = [
  {
    name: "Multi-Slide Patio Doors",
    slug: "multi-slide",
    image: "/images/products/multi-slide/header.avif",
    features: [
      "Panels slide & stack behind fixed panels",
      "Up to 24' wide openings",
      "Flush-mounted recessed tracks",
    ],
    basePrice: 8500,
  },
  {
    name: "Ultra Slim Multi-Slide",
    slug: "ultra-slim",
    image: "/images/products/ultra-slim/evening-at-beach.avif",
    features: [
      "Minimal 1\" sightlines",
      "Floor-to-ceiling glass views",
      "Premium thermal performance",
    ],
    basePrice: 12000,
  },
  {
    name: "Bi-Fold Doors",
    slug: "bi-fold",
    image: "/images/products/folding/steel-home.avif",
    features: [
      "Accordion-style folding panels",
      "Full opening capability",
      "Interior & exterior fold options",
    ],
    basePrice: 7500,
  },
  {
    name: "Slide & Stack Doors",
    slug: "slide-stack",
    image: "/images/products/slide-stack/left-right-open.avif",
    features: [
      "Panels slide left or right & stack",
      "Wide unobstructed openings",
      "Smooth roller track system",
    ],
    basePrice: 9000,
  },
  {
    name: "Pocket Doors",
    slug: "pocket",
    image: "/images/products/pocket/header.avif",
    features: [
      "Panels disappear into wall pockets",
      "Zero stacking footprint",
      "Seamless indoor-outdoor flow",
    ],
    basePrice: 10500,
  },
  {
    name: "Fold-Up Windows",
    slug: "fold-up-windows",
    image: "/images/products/fold-up-windows/header.jpg",
    features: [
      "Gas-strut assisted lift panels",
      "Bar & counter pass-through ready",
      "Weather-tight sealed design",
    ],
    basePrice: 6000,
  },
];
