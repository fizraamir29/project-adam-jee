import { Product, PCComponent, GameMetrics, Testimonial, BlogPost } from "./types";

export const CURRENCIES = {
  USD: { symbol: "$", rate: 1, name: "United States (USD $)" },
  PKR: { symbol: "Rs. ", rate: 278, name: "Pakistan (Rs. PKR)" }
};

export const NEW_ARRIVALS: Product[] = [
  {
    id: "na1",
    name: "Dell UltraSharp 29\" UltraWide LED Monitor",
    code: "Code u2917w",
    price: 500.00,
    rating: 5.0,
    image: "/images/dell_led_monitor_1780238004077.png",
    category: "Accessories",
    tag: "New",
    description: "The Dell UltraSharp U2917W is a 29-inch UltraWide IPS monitor designed to enhance productivity and streamline multitasking. With its 21:9 aspect ratio and 2560×1080 resolution, it offers significantly more horizontal screen space.",
    additionalImages: [
      "/images/dell_led_monitor_1780238004077.png",
      "/images/rog_monitor_new.png"
    ]
  },
  {
    id: "na2",
    name: "Aftershock Oden Mechanical Gaming Keyboard",
    code: "Code asmkb87-2020",
    price: 500.00,
    rating: 5.0,
    image: "/images/mechanical_keyboard_1780238028029.png",
    category: "Accessories",
    tag: "Hot",
    description: "The Aftershock Oden is a tenkeyless mechanical gaming keyboard built with Cherry MX switches. Featuring per-key RGB, N-key rollover, and a premium aluminium top plate.",
    additionalImages: [
      "/images/mechanical_keyboard_1780238028029.png",
      "/images/mechanical_keyboard_1780238028029.png",
      "/images/mechanical_keyboard_1780238028029.png"
    ]
  },
  {
    id: "na3",
    name: "ASUS RTX 4080 Gaming Graphics Card",
    code: "Code RTX-4080-ASUS",
    price: 999.00,
    rating: 5.0,
    image: "/images/rtx_graphics_card_1780238052630.png",
    category: "Accessories",
    tag: "New",
    description: "The ASUS RTX 4080 delivers next-generation Ada Lovelace performance with 16GB GDDR6X VRAM, real-time ray tracing, and DLSS 3.5 frame generation for the ultimate 4K gaming experience.",
    additionalImages: [
      "/images/rtx_graphics_card_1780238052630.png",
      "/images/rtx_graphics_card_1780238052630.png"
    ]
  },
  {
    id: "na4",
    name: "AMD Ryzen 9 7900X3D Processor",
    code: "Code AMD-R9-7900X3D",
    price: 549.00,
    rating: 5.0,
    image: "/images/ryzen_processor_box_1780238074653.png",
    category: "Accessories",
    tag: "Hot",
    description: "The AMD Ryzen 9 7900X3D combines 12 Zen 4 cores with AMD 3D V-Cache technology, delivering unprecedented gaming and multithreaded performance on the AM5 platform.",
    additionalImages: [
      "/images/ryzen_processor_box_1780238074653.png",
      "/images/ryzen_processor_box_1780238074653.png"
    ]
  },
  {
    id: "na5",
    name: "Corsair Vengeance RGB 32GB DDR5 RAM",
    code: "Code CMH32GX5M2",
    price: 125.00,
    rating: 5.0,
    image: "/images/corsair_rgb_ram_1780238095594.png",
    category: "Accessories",
    tag: "New",
    description: "Corsair Vengeance RGB DDR5-6000MHz 32GB dual-channel kit with XMP 3.0 and EXPO support. Individual per-stick iCUE RGB lighting with low-profile 44mm aluminium heatspreader.",
    additionalImages: [
      "/images/corsair_rgb_ram_1780238095594.png"
    ]
  },
  {
    id: "na6",
    name: "GameSir T4 Cyclone Pro Controller",
    code: "Code GAMESIR-T4-PRO",
    price: 59.00,
    rating: 5.0,
    image: "/images/gamesir_controller_1780238117003.png",
    category: "Accessories",
    tag: "Hot",
    description: "The GameSir T4 Cyclone Pro features Hall-effect joystick sensors for zero drift, 2.4GHz ultra-low latency wireless, and universal compatibility across PC, Android, iOS, and Nintendo Switch.",
    additionalImages: [
      "/images/gamesir_controller_1780238117003.png",
      "/images/gamesir_controller_1780238117003.png",
      "/images/gamesir_controller_1780238117003.png"
    ]
  }
];

export const BUNDLE_PRODUCTS: Product[] = [
  {
    id: "bp1",
    name: "Glowing RGB Wired Gaming Mouse",
    code: "Code MS-RGB-GLOW",
    price: 500.00,
    rating: 5.0,
    image: "/images/gaming_mouse_rgb_new.png"
  },
  {
    id: "bp2",
    name: "Premium Ergonomic Blue Gaming Chair",
    code: "Code CH-ERGO-BLUE",
    price: 500.00,
    rating: 5.0,
    image: "/images/gaming_chair_blue_1780246513295.png",
    tag: "Hot"
  },
  {
    id: "bp3",
    name: "ASUS ROG Red & Black Headset",
    code: "Code HP-ROG-RED",
    price: 500.00,
    rating: 5.0,
    image: "/images/headphones_red_black_1780246535746.png",
    tag: "Hot"
  },
  {
    id: "bp4",
    name: "ASUS ROG Swift Gaming Monitor",
    code: "Code MON-ROG360",
    price: 500.00,
    rating: 5.0,
    image: "/images/rog_monitor_new.png"
  }
];

export const PROCESSORS: PCComponent[] = [
  { id: "cpu1", type: "Processor", name: "AMD Ryzen 7 7800X3D (Extreme Gaming)", price: 419, watts: 120 },
  { id: "cpu2", type: "Processor", name: "Intel Core i9-14900KS (Ultimate Performance)", price: 589, watts: 150 },
  { id: "cpu3", type: "Processor", name: "AMD Ryzen 5 7600X (Budget King)", price: 199, watts: 105 },
  { id: "cpu4", type: "Processor", name: "Intel Core i7-14700K (Content Creation)", price: 389, watts: 125 }
];

export const GPUS: PCComponent[] = [
  { id: "gpu1", type: "Graphics Card", name: "NVIDIA RTX 4095 Extreme (24GB VRAM)", price: 1690, watts: 450 },
  { id: "gpu2", type: "Graphics Card", name: "NVIDIA RTX 4080 Super (16GB VRAM)", price: 999, watts: 320 },
  { id: "gpu3", type: "Graphics Card", name: "AMD Radeon RX 7800 XT (16GB GDDR6)", price: 499, watts: 263 },
  { id: "gpu4", type: "Graphics Card", name: "NVIDIA RTX 4070 Ti Super (12GB VRAM)", price: 799, watts: 285 }
];

export const MOTHERBOARDS: PCComponent[] = [
  { id: "mob1", type: "Motherboard", name: "ASUS ROG Strix Z790-E WiFi", price: 399, watts: 65 },
  { id: "mob2", type: "Motherboard", name: "MSI MAG B650 Tomahawk WiFi", price: 219, watts: 50 },
  { id: "mob3", type: "Motherboard", name: "ASRock X670E Taichi Carrara", price: 499, watts: 75 }
];

export const MEMORIES: PCComponent[] = [
  { id: "ram1", type: "RAM Memory", name: "32GB (2x16GB) Corsair Vengeance DDR5 6000MHz", price: 125, watts: 12 },
  { id: "ram2", type: "RAM Memory", name: "64GB (2x32GB) G.Skill Trident Z5 RGB 6400MHz", price: 245, watts: 18 },
  { id: "ram3", type: "RAM Memory", name: "16GB (2x8GB) Kingston Fury Beast 5200MHz", price: 69, watts: 8 }
];

export const STORAGES: PCComponent[] = [
  { id: "ssd1", type: "SSD Storage", name: "2TB Samsung 990 Pro M.2 NVMe PCIe 4.0", price: 185, watts: 7 },
  { id: "ssd2", type: "SSD Storage", name: "4TB Crucial T700 Gen5 NVMe (Extreme Speed)", price: 360, watts: 11 },
  { id: "ssd3", type: "SSD Storage", name: "1TB Kingston NV2 PCIe NVMe SSD", price: 65, watts: 5 }
];

export const PSUS: PCComponent[] = [
  { id: "psu1", type: "Power Supply", name: "Corsair RM1000x 1000W 80+ Gold Modular", price: 189, watts: 0 },
  { id: "psu2", type: "Power Supply", name: "MSI MAG A850GL 850W PCIe 5 Gold", price: 129, watts: 0 },
  { id: "psu3", type: "Power Supply", name: "EVGA SuperNOVA 1600W T2 Titanium", price: 399, watts: 0 }
];

export const COOLS: PCComponent[] = [
  { id: "col1", type: "CPU Cooler", name: "ROG Ryujin III 360 ARGB Liquid Cooler", price: 329, watts: 38 },
  { id: "col2", type: "CPU Cooler", name: "LIAN LI Galahad II Trinity 360 AIO", price: 169, watts: 30 },
  { id: "col3", type: "CPU Cooler", name: "Noctua NH-D15 chromax.black Dual-Tower", price: 119, watts: 12 }
];

export const CASES: PCComponent[] = [
  { id: "cas1", type: "PC Cabinet", name: "Lian Li O11 Dynamic EVO (Panoramic Glass)", price: 169, watts: 0 },
  { id: "cas2", type: "PC Cabinet", name: "NZXT H9 Flow High Airflow Chassis", price: 159, watts: 0 },
  { id: "cas3", type: "PC Cabinet", name: "Montech KING 95 Pro Panoramic RGB Blue", price: 129, watts: 0 }
];

export const ADD_ON_COMPONENTS = [
  { type: "Case Fans", name: "3x Corsair QX120 RGB Magnetic Fans", price: 119, watts: 15 },
  { type: "Sleeved Cables", name: "Lian Li Strimer Plus V2 RGB Cable Set", price: 69, watts: 5 },
  { type: "Custom Lighting", name: "Razer Chroma Light Strip Expansion", price: 49, watts: 8 },
  { type: "Sound Card", name: "Creative Sound BlasterX AE-5 Plus", price: 149, watts: 10 },
  { type: "WiFi Card", name: "Intel Killer WiFi 7 BE1750 PCIe Card", price: 59, watts: 4 }
];

export const TARGET_GAMES: GameMetrics[] = [
  { name: "Cyberpunk 2077 (Ray-Tracing Overdrive)", cpuScale: 1.1, gpuScale: 1.8, baseFps: 55 },
  { name: "GTA V / FiveM Roleplay Servers", cpuScale: 1.4, gpuScale: 1.1, baseFps: 120 },
  { name: "Counter-Strike 2 (Esports Competitive)", cpuScale: 2.1, gpuScale: 0.9, baseFps: 290 },
  { name: "Valorant (Competitive Settings)", cpuScale: 2.4, gpuScale: 0.7, baseFps: 380 },
  { name: "Call of Duty: Warzone 3.0 (Battle Royale)", cpuScale: 1.5, gpuScale: 1.4, baseFps: 105 }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Hamza A.",
    text: "Absolutely loved the custom PC build quality and cable management. The performance is smooth, and the team guided me perfectly throughout the process.",
    verified: true,
    image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
  },
  {
    name: "Adamjee Setup Showcase",
    text: "Dual screens with glowing mechanical keyboard and extreme water cooling setup setup build.",
    verified: true,
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-gaming-setup-with-keyboard-and-mouse-rgb-lighting-40019-large.mp4"
  },
  {
    name: "Ali R.",
    text: "Ordered my gaming setup from Adamjee Computers and the experience was amazing. Genuine products, fast delivery, and excellent customer support.",
    verified: true,
    image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150"
  },
  {
    name: "Futuristic Studio",
    text: "RGB glowing desktop setup",
    verified: true,
    videoUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=400"
  },
  {
    name: "Zeeshan T.",
    text: "Their upgrade recommendations helped me improve my FPS and streaming performance without overspending. Highly recommended for gamers.",
    verified: true,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150"
  },
  {
    name: "Submit Setup",
    text: "Join the legendary Adamjee Battlestations ring",
    verified: true,
    isCustomSubmit: true
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: "blog1",
    title: "How to Build a Gaming PC",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=600",
    tag: "GAMING PC",
    date: "13 May 2026",
    desc: "Building a gaming PC may seem complicated at first, but with the right components and planning, you can craft the perfect rig. Follow our comprehensive tutorial."
  },
  {
    id: "blog2",
    title: "Best GPUs for Gaming in Pakistan",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=600",
    tag: "GPUs",
    date: "13 May 2026",
    desc: "Choosing the right graphics card is one of the most important decisions for any gaming setup. Whether you play competitive esports titles or high-end AAA games..."
  }
];

export const ALL_PRODUCTS: Product[] = [
  // Headphones (4)
  {
    id: "hp1",
    name: "ASUS ROG Red & Black Gaming Headset",
    code: "Code HP-ROG-RED",
    price: 150.00,
    rating: 4.8,
    image: "/images/headphones_red_black_1780246535746.png",
    category: "Headphones",
    tag: "Hot",
    description: "The ASUS ROG Gaming Headset delivers immersive 7.1 surround sound with premium 50mm neodymium drivers. Features a detachable noise-cancelling boom mic, memory foam ear cushions, and RGB lighting for your battle station."
  },
  {
    id: "hp2",
    name: "Premium 3D Wireless Gaming Headset",
    code: "Code HP-3D-WRLS",
    price: 199.00,
    rating: 5.0,
    image: "/images/3d_gaming_headset.png",
    category: "Headphones",
    tag: "New",
    description: "Experience true wireless freedom with this Premium 3D Gaming Headset. Bluetooth 5.2 with 40-hour battery life, Hi-Res Audio certified, and virtual 3D spatial audio for unmatched immersion."
  },
  {
    id: "hp3",
    name: "RGB Surround Sound Gaming Headphones",
    code: "Code HP-RGB-SURR",
    price: 120.00,
    rating: 4.7,
    image: "/images/rgb_gaming_headphones_1780227081148.png",
    category: "Headphones",
    description: "Premium RGB Gaming Headphones with 50mm drivers and virtual 7.1 surround sound. Foldable design with memory foam ear cups and a flexible microphone for crystal-clear team communication."
  },
  {
    id: "hp4",
    name: "Wireless Pro Noise Cancelling Headset",
    code: "Code HP-WL-PRO",
    price: 250.00,
    rating: 4.9,
    image: "/images/headphones_deal_1780250259718.png",
    category: "Headphones",
    tag: "20% OFF",
    description: "Professional-grade Active Noise Cancellation with three ANC modes. Hi-Res Audio, 30-hour battery, USB-C fast charging, and multi-device pairing for seamless switching between PC and mobile."
  },

  // Earphones (3)
  {
    id: "ep1",
    name: "TWS Pro Wireless Blue Earbuds",
    code: "Code EP-TWS-BLUE",
    price: 89.00,
    rating: 4.9,
    image: "/images/tws_blue_earbuds_1780227103510.png",
    category: "Earphones",
    tag: "Hot",
    description: "True Wireless earbuds with Bluetooth 5.3, Active Noise Cancellation, and 8+32hr total battery life. IPX5 water resistant with premium 10mm titanium-coated drivers for deep bass and crisp highs."
  },
  {
    id: "ep2",
    name: "Premium Wireless Sport Earbuds",
    code: "Code EP-WL-PREM",
    price: 79.00,
    rating: 4.7,
    image: "/images/new_earbuds_transparent.png",
    category: "Earphones",
    tag: "New",
    description: "Sport-optimized wireless earbuds with secure ear-hook design, IPX7 waterproofing, and 6-hour playtime per charge. Perfect for workouts, commutes, and all-day listening."
  },
  {
    id: "ep3",
    name: "High-Fidelity Wired In-Ear Monitors",
    code: "Code EP-WD-HI-FI",
    price: 49.00,
    rating: 4.5,
    image: "/images/new_earbuds_transparent.png",
    category: "Earphones",
    description: "Studio-grade wired in-ear monitors with dual-driver hybrid system (dynamic + balanced armature). Detachable 3.5mm cable with inline mic for calls. Perfect for audiophiles and content creators."
  },

  // Speakers (2)
  {
    id: "sp1",
    name: "LD Systems Premium Bluetooth Speaker",
    code: "Code SP-LD-PREM",
    price: 349.00,
    rating: 5.0,
    image: "/images/image 117.png",
    category: "Speakers",
    tag: "Hot",
    description: "The LD Systems Premium Bluetooth Speaker delivers 120W RMS with a 2.1 channel system. Deep bass subwoofer, optical and AUX inputs, RGB sync lighting, and wireless multi-room audio support."
  },
  {
    id: "sp2",
    name: "RGB Desktop Gaming Soundbar Speakers",
    code: "Code SP-RGB-SND",
    price: 99.00,
    rating: 4.7,
    image: "/images/image 122.png",
    category: "Speakers",
    tag: "New",
    description: "Compact RGB gaming soundbar with 60W stereo output and built-in subwoofer. USB, optical, and Bluetooth connectivity. RGB lighting syncs with your gaming setup for the ultimate aesthetic."
  },

  // Accessories (6)
  {
    id: "ac1",
    name: "Glowing RGB Wired Gaming Mouse",
    code: "Code MS-RGB-GLOW",
    price: 45.00,
    rating: 4.8,
    image: "/images/gaming_mouse_rgb_new.png",
    category: "Accessories",
    description: "High-precision RGB gaming mouse with PixArt optical sensor, 6400 DPI, 6 programmable buttons, and ergonomic design. Braided USB cable and PTFE feet for smooth gliding on any surface."
  },
  {
    id: "ac2",
    name: "Premium Ergonomic Blue Gaming Chair",
    code: "Code CH-ERGO-BLUE",
    price: 299.00,
    rating: 5.0,
    image: "/images/gaming_chair_blue_1780246513295.png",
    category: "Accessories",
    tag: "Hot",
    description: "Premium ergonomic gaming chair with lumbar and neck memory foam pillows, 4D adjustable armrests, 155° recline, and class-4 hydraulic gas lift. Supports up to 150kg with PU leather upholstery."
  },
  {
    id: "ac3",
    name: "Aftershock Oden Mechanical Keyboard",
    code: "Code asmkb87-2020",
    price: 119.00,
    rating: 5.0,
    image: "/images/mechanical_keyboard_1780238028029.png",
    category: "Accessories",
    tag: "New",
    description: "The Aftershock Oden is a premium TKL mechanical keyboard with Cherry MX switches, per-key RGB lighting, N-key rollover, and aluminium top plate for professional gamers and typists."
  },
  {
    id: "ac4",
    name: "GameSir T4 Cyclone Pro Controller",
    code: "Code GAMESIR-T4-PRO",
    price: 59.00,
    rating: 4.8,
    image: "/images/gamesir_controller_1780238117003.png",
    category: "Accessories",
    description: "GameSir T4 with Hall-effect joysticks (zero drift), 2.4GHz wireless (<5ms latency), 20-hour battery, adjustable triggers, and universal compatibility with PC, Android, iOS, and Nintendo Switch."
  },
  {
    id: "ac5",
    name: "ASUS ROG Swift 360Hz Gaming Monitor",
    code: "Code MON-ROG360",
    price: 599.00,
    rating: 5.0,
    image: "/images/rog_monitor_new.png",
    category: "Accessories",
    tag: "Hot",
    description: "ASUS ROG Swift 24.5\" FHD 360Hz IPS gaming monitor with 1ms GTG response time, G-SYNC Ultimate, NVIDIA Reflex Latency Analyzer, and ROG OLED display for competitive esports gaming."
  },
  {
    id: "ac6",
    name: "Meta Quest 3 VR Headset",
    code: "Code VR-CONSOLE",
    price: 399.00,
    rating: 4.9,
    image: "/images/deal-vr.png",
    category: "Accessories",
    tag: "30% OFF",
    description: "The Meta Quest 3 delivers a stunning mixed reality experience with 4K+ display, 120Hz refresh rate, inside-out 6DoF tracking, and pancake lenses. Standalone VR with optional PC streaming via Air Link."
  }
];
