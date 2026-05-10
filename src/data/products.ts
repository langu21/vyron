import { Product } from "../types";

export const products: Product[] = [
  {
    id: "v-001",
    name: "CYBER-HOOD 'NEON X'",
    description: "Heavyweight oversized hoodie with tactical straps and glow-in-the-dark VYRON emblem. Water-resistant tech fabric.",
    price: 189,
    category: "unisex",
    type: "hoodie",
    images: ["https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1000"],
    sizes: ["S", "M", "L", "XL"],
    stock: 15,
    isNewArrival: true,
    tags: ["techwear", "neon", "oversized"]
  },
  {
    id: "v-002",
    name: "PHANTOM TECH JOGGERS",
    description: "Futuristic silhouette with multiple utility pockets and reflective accents. Maximum mobility and comfort.",
    price: 145,
    category: "men",
    type: "pants",
    images: ["https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&q=80&w=1000"],
    sizes: ["M", "L", "XL"],
    stock: 22,
    isBestSeller: true,
    tags: ["phantom", "tech", "joggers"]
  },
  {
    id: "v-003",
    name: "GLITCH CORE TEE",
    description: "Premium cotton tee with high-density glitch print. Boxy fit for the urban explorer.",
    price: 65,
    category: "unisex",
    type: "tshirt",
    images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=1000"],
    sizes: ["XS", "S", "M", "L"],
    stock: 40,
    isSale: true,
    discountPrice: 45,
    tags: ["minimal", "streetwear", "essentials"]
  },
  {
    id: "v-004",
    name: "AURA VEST 'SILVER'",
    description: "Experimental metallic finish vest with lightweight insulation. Futuristic aesthetic for layering.",
    price: 210,
    category: "women",
    type: "accessories",
    images: ["https://images.unsplash.com/photo-1539109132381-31a1C974573f?auto=format&fit=crop&q=80&w=1000"],
    sizes: ["S", "M"],
    stock: 8,
    isNewArrival: true,
    tags: ["experimental", "silver", "aura"]
  },
  {
    id: "v-005",
    name: "VOID CARGO PANTS",
    description: "Matte black cargo pants with modular pockets and adjustable ankle straps.",
    price: 155,
    category: "unisex",
    type: "pants",
    images: ["https://images.unsplash.com/photo-1621072138294-59262f852230?auto=format&fit=crop&q=80&w=1000"],
    sizes: ["S", "M", "L", "XL"],
    stock: 12,
    tags: ["cargo", "stealth", "void"]
  }
];
