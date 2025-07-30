const products = [
  {
    id: "P-1001",
    name: "QuantumBlast Wireless Earbuds",
    brand: "AudioTech",
    price: 89.99,
    discount: 15,
    inStock: true,
    rating: 4.7,
    reviews: 1245,
    colors: ["Matte Black", "Pearl White", "Midnight Blue"],
    features: [
      "Active Noise Cancellation (ANC)",
      "30-hour battery life (with case)",
      "IPX7 waterproof",
      "Bluetooth 5.3",
      "Touch controls"
    ],
    description: "Experience crystal-clear sound with QuantumBlast Wireless Earbuds.",
    specifications: {
      weight: "45g (earbuds + case)",
      dimensions: "2.5 x 2.5 x 3.2 cm (per earbud)",
      battery: {
        earbuds: "8 hours",
        case: "22 hours (additional)"
      },
      warranty: "2 years"
    },
    imageUrl: "/images/quantumblast-earbuds.jpg"
  },
  {
    id: "P-1002",
    name: "Phoenix X5 Pro Smartphone",
    brand: "Nexus",
    price: 699.99,
    discount: 10,
    inStock: true,
    rating: 4.5,
    reviews: 856,
    colors: ["Stellar Black", "Arctic Silver", "Ocean Blue"],
    features: [
      "6.7-inch AMOLED Display",
      "108MP Triple Camera",
      "Snapdragon 8 Gen 2",
      "5000mAh Battery"
    ],
    description: "Flagship smartphone with professional-grade camera system.",
    specifications: {
      weight: "198g",
      storage: ["128GB", "256GB"],
      os: "Android 13",
      warranty: "1 year"
    },
    imageUrl: "/images/phoenix-x5-pro.jpg"
  },
  {
    id: "P-1003",
    name: "TitanForce RTX Gaming Laptop",
    brand: "CyberNova",
    price: 1899.99,
    discount: 5,
    inStock: true,
    rating: 4.8,
    reviews: 432,
    colors: ["Stealth Black"],
    features: [
      "17.3-inch QHD 165Hz Display",
      "RTX 4080 GPU",
      "32GB DDR5 RAM",
      "RGB Keyboard"
    ],
    description: "Desktop-level gaming performance in a portable chassis.",
    specifications: {
      weight: "2.6kg",
      storage: "1TB NVMe SSD",
      ports: "Thunderbolt 4, HDMI 2.1"
    },
    imageUrl: "/images/titanforce-rtx.jpg"
  },
  {
    id: "P-1004",
    name: "AeroFit Pro Smartwatch",
    brand: "FitNova",
    price: 249.99,
    discount: 20,
    inStock: true,
    rating: 4.6,
    reviews: 1203,
    colors: ["Graphite", "Rose Gold"],
    features: [
      "ECG Monitoring",
      "7-Day Battery",
      "GPS Tracking",
      "AMOLED Display"
    ],
    description: "Premium smartwatch for fitness and health tracking.",
    specifications: {
      weight: "42g",
      waterproof: "5ATM",
      warranty: "2 years"
    },
    imageUrl: "/images/aerofit-pro.jpg"
  },
  {
    id: "P-1005",
    name: "NovaTab 10 Pro Tablet",
    brand: "Nexus",
    price: 549.99,
    discount: 12,
    inStock: true,
    rating: 4.4,
    reviews: 678,
    colors: ["Space Gray", "Silver"],
    features: [
      "10.5-inch 2K Display",
      "Stylus Support",
      "8GB RAM",
      "128GB Storage"
    ],
    description: "Powerful tablet for productivity and entertainment.",
    specifications: {
      weight: "480g",
      battery: "12 hours",
      os: "Android 12"
    },
    imageUrl: "/images/novatab-10pro.jpg"
  },
  {
    id: "P-1006",
    name: "ThunderDrive External SSD",
    brand: "StorageMaster",
    price: 129.99,
    discount: 0,
    inStock: true,
    rating: 4.9,
    reviews: 2104,
    colors: ["Black", "Silver"],
    features: [
      "1TB Capacity",
      "1050MB/s Transfer Speed",
      "USB-C 3.2",
      "Shock Resistant"
    ],
    description: "Ultra-fast portable SSD for professionals.",
    specifications: {
      weight: "45g",
      dimensions: "8.5 x 5 x 0.8 cm",
      warranty: "5 years"
    },
    imageUrl: "/images/thunderdrive-ssd.jpg"
  },
  {
    id: "P-1007",
    name: "UltraView 4K Monitor",
    brand: "DispTech",
    price: 399.99,
    discount: 25,
    inStock: true,
    rating: 4.7,
    reviews: 892,
    colors: ["Black"],
    features: [
      "32-inch 4K UHD",
      "144Hz Refresh Rate",
      "HDR400",
      "AMD FreeSync"
    ],
    description: "Immersive gaming and creative workstation monitor.",
    specifications: {
      ports: "HDMI 2.1, DisplayPort 1.4",
      standAdjustable: "Yes",
      warranty: "3 years"
    },
    imageUrl: "/images/ultraview-4k.jpg"
  },
  {
    id: "P-1008",
    name: "BoomPulse Bluetooth Speaker",
    brand: "AudioTech",
    price: 79.99,
    discount: 30,
    inStock: true,
    rating: 4.3,
    reviews: 1567,
    colors: ["Red", "Blue", "Black"],
    features: [
      "24-Hour Playtime",
      "IP67 Waterproof",
      "Party Pairing",
      "Bass Boost"
    ],
    description: "Portable speaker with powerful 360° sound.",
    specifications: {
      weight: "680g",
      drivers: "Dual 10W",
      connectivity: "Bluetooth 5.0"
    },
    imageUrl: "/images/boompulse-speaker.jpg"
  },
  {
    id: "P-1009",
    name: "AirFlow Pro Cooler",
    brand: "CoolMaster",
    price: 49.99,
    discount: 10,
    inStock: true,
    rating: 4.2,
    reviews: 432,
    colors: ["White", "Black"],
    features: [
      "6-Speed Settings",
      "USB-Powered",
      "Quiet Operation",
      "Adjustable Tilt"
    ],
    description: "Laptop cooling pad with ergonomic design.",
    specifications: {
      dimensions: "35 x 30 x 5 cm",
      fans: "Dual 120mm",
      weight: "800g"
    },
    imageUrl: "/images/airflow-cooler.jpg"
  },
  {
    id: "P-1010",
    name: "PowerGrip Wireless Charger",
    brand: "ChargeX",
    price: 29.99,
    discount: 5,
    inStock: true,
    rating: 4.0,
    reviews: 876,
    colors: ["White", "Black"],
    features: [
      "15W Fast Charging",
      "Qi-Certified",
      "Non-Slip Surface",
      "LED Indicator"
    ],
    description: "Effortless wireless charging for Qi-enabled devices.",
    specifications: {
      input: "5V/3A, 9V/2A",
      cableLength: "1.2m",
      warranty: "1 year"
    },
    imageUrl: "/images/powergrip-charger.jpg"
  }
];

export default products;