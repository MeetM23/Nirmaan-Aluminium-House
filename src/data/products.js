// src/data/products.js
// Central data file for all products — includes pricing, units, variants, and gallery

export const products = [
  {
    id: 1,
    slug: 'stainless-steel-railing',
    name: 'Stainless Steel Railing',
    shortName: 'SS Railing',
    number: '01',
    tagline: 'Strength meets elegance',
    description:
      'Our stainless steel railings combine strength, safety and modern aesthetics, making them ideal for residential, commercial and industrial spaces. With high-grade stainless steel and precision fabrication, we ensure long-lasting performance and a premium look.',
    image: '/images/products/ss-railing.jpg',
    price: 850,
    unit: 'per running ft',
    minQty: 10,
    priceNote: 'Final price may vary after site measurement.',
    variants: {
      finish: [
        { name: 'Satin', priceMultiplier: 1.0 },
        { name: 'Mirror', priceMultiplier: 1.08 },
        { name: 'PVD Gold', priceMultiplier: 1.35 },
        { name: 'Brushed', priceMultiplier: 1.05 },
      ],
      material: [
        { name: 'SS 304', priceMultiplier: 1.0 },
        { name: 'SS 316', priceMultiplier: 1.22 },
      ],
    },
    features: [
      { icon: 'ShieldCheck', label: 'Rust Resistant' },
      { icon: 'Gem', label: 'High Durability' },
      { icon: 'Sparkles', label: 'Modern Finish' },
      { icon: 'Settings', label: 'Low Maintenance' },
    ],
    specs: {
      Material: 'SS 304 / SS 316 (Customized options available)',
      Finish: 'Satin, Mirror, PVD, Brushed',
      Applications: 'Staircase, Balcony, Terrace, Commercial Spaces',
      Customization: 'Design, Height, Pipe Thickness, Handrail Options',
      Installation: 'Professional Installation by Expert Team',
    },
    gallery: [
      { image: '/images/gallery/ss-railing-1.jpg', caption: 'Residential Railing' },
      { image: '/images/gallery/ss-railing-2.jpg', caption: 'Indoor Staircase Railing' },
      { image: '/images/gallery/ss-railing-3.jpg', caption: 'Balcony Railing' },
      { image: '/images/gallery/ss-railing-4.jpg', caption: 'Terrace Railing' },
    ],
    galleryDescription:
      'A showcase of our recent stainless steel railing installations across residential, commercial and industrial spaces.',
  },
  {
    id: 2,
    slug: 'aluminium-balcony',
    name: 'Aluminium Balcony',
    shortName: 'Alum Balcony',
    number: '02',
    tagline: 'Open views, secured elegantly',
    description:
      'Our aluminium balconies offer a perfect combination of lightweight strength and architectural elegance. Featuring toughened glass panels within precision-crafted aluminium frames, they transform ordinary balconies into statement spaces that add value and visual appeal to any building.',
    image: '/images/products/alum-balcony.jpg',
    price: 1200,
    unit: 'per sq ft',
    minQty: 20,
    priceNote: 'Final price may vary after site measurement.',
    variants: {
      finish: [
        { name: 'Powder Coated Matt Black', priceMultiplier: 1.0 },
        { name: 'Anodized Champagne', priceMultiplier: 1.15 },
        { name: 'Wood Finish Grain', priceMultiplier: 1.25 },
      ],
      material: [
        { name: 'Aluminium 6063 T5', priceMultiplier: 1.0 },
        { name: 'Heavy Duty 6061 T6', priceMultiplier: 1.2 },
      ],
    },
    features: [
      { icon: 'ShieldCheck', label: 'Rust Resistant' },
      { icon: 'Gem', label: 'High Durability' },
      { icon: 'Sparkles', label: 'Modern Finish' },
      { icon: 'Settings', label: 'Low Maintenance' },
    ],
    specs: {
      Material: 'High-grade Aluminium Alloy 6063 T5',
      Finish: 'Powder Coated, Anodized, Wood Finish',
      Applications: 'Residential Balconies, Commercial Buildings, Villas',
      Customization: 'Frame Color, Glass Type, Panel Size, Design',
      Installation: 'Expert Installation with 5-Year Warranty',
    },
    gallery: [
      { image: '/images/gallery/alum-balcony-1.jpg', caption: 'Residential Balcony' },
      { image: '/images/gallery/alum-balcony-2.jpg', caption: 'Commercial Balcony' },
      { image: '/images/gallery/alum-balcony-3.jpg', caption: 'Villa Balcony' },
      { image: '/images/gallery/alum-balcony-4.jpg', caption: 'Terrace Balcony' },
    ],
    galleryDescription:
      'Explore our recent aluminium balcony installations that blend safety, style and lasting durability.',
  },
  {
    id: 3,
    slug: 'aluminium-railing',
    name: 'Aluminium Railing',
    shortName: 'Alum Railing',
    number: '03',
    tagline: 'Sleek protection, stylish design',
    description:
      'Nirmaan\'s aluminium railings are engineered to deliver outstanding performance in demanding environments. Lightweight yet robust, our horizontal-slat and vertical-post aluminium railings complement modern architectural styles while providing reliable safety for terraces, staircases and walkways.',
    image: '/images/products/alum-railing.jpg',
    price: 750,
    unit: 'per running ft',
    minQty: 15,
    priceNote: 'Final price may vary after site measurement.',
    variants: {
      finish: [
        { name: 'Powder Coated Black', priceMultiplier: 1.0 },
        { name: 'Anodized Silver', priceMultiplier: 1.1 },
        { name: 'Dark Bronze', priceMultiplier: 1.18 },
      ],
      material: [
        { name: 'Alum 6063 T5', priceMultiplier: 1.0 },
        { name: 'Alum 6061 T6', priceMultiplier: 1.15 },
      ],
    },
    features: [
      { icon: 'ShieldCheck', label: 'Rust Resistant' },
      { icon: 'Gem', label: 'High Durability' },
      { icon: 'Sparkles', label: 'Modern Finish' },
      { icon: 'Settings', label: 'Low Maintenance' },
    ],
    specs: {
      Material: 'Aluminium Alloy 6063 T5 / 6061 T6',
      Finish: 'Powder Coated, Anodized, Matt, Gloss',
      Applications: 'Terrace, Balcony, Walkways, Pool Areas',
      Customization: 'Color, Height, Slat Spacing, Profile Shape',
      Installation: 'Professional Installation with Anchoring',
    },
    gallery: [
      { image: '/images/gallery/ss-railing-3.jpg', caption: 'Terrace Railing' },
      { image: '/images/gallery/alum-balcony-2.jpg', caption: 'Outdoor Walkway' },
      { image: '/images/gallery/alum-balcony-1.jpg', caption: 'Pool Area Railing' },
      { image: '/images/gallery/ss-railing-1.jpg', caption: 'Staircase Railing' },
    ],
    galleryDescription:
      'Our aluminium railing projects showcase precision engineering and modern design across varied applications.',
  },
  {
    id: 4,
    slug: 'stainless-steel-sliding-openable-gate',
    name: 'Stainless Steel Sliding & Openable Gate',
    shortName: 'SS Sliding Gate',
    number: '04',
    tagline: 'Grand entrances, lasting impressions',
    description:
      'Make a powerful first impression with our premium stainless steel sliding and openable gates. Crafted from heavy-gauge SS 304/316 with a precision horizontal-louvre design, these gates offer maximum security without compromising on aesthetics — perfect for luxury residences, commercial premises and industrial sites.',
    image: '/images/products/ss-gate.jpg',
    price: 28500,
    unit: 'per piece',
    minQty: 1,
    priceNote: 'Final price may vary after site measurement.',
    variants: {
      finish: [
        { name: 'Matte Black Louvre', priceMultiplier: 1.0 },
        { name: 'Mirror Finish', priceMultiplier: 1.12 },
        { name: 'PVD Coated Gold Accents', priceMultiplier: 1.3 },
      ],
      material: [
        { name: 'SS 304 Heavy Gauge', priceMultiplier: 1.0 },
        { name: 'SS 316 Marine Grade', priceMultiplier: 1.25 },
      ],
    },
    features: [
      { icon: 'ShieldCheck', label: 'Rust Resistant' },
      { icon: 'Gem', label: 'High Durability' },
      { icon: 'Sparkles', label: 'Modern Finish' },
      { icon: 'Settings', label: 'Low Maintenance' },
    ],
    specs: {
      Material: 'SS 304 / SS 316',
      Finish: 'Matte Black, Mirror, Brushed, PVD Coated',
      Applications: 'Residential, Commercial, Industrial Entrances',
      Customization: 'Size, Design, Automation-Ready, Access Control',
      Installation: 'Turnkey Installation by Expert Team',
    },
    gallery: [
      { image: '/images/gallery/gate-1.jpg', caption: 'Residential Sliding Gate' },
      { image: '/images/gallery/ss-railing-1.jpg', caption: 'Commercial Entrance Gate' },
      { image: '/images/gallery/cnc-1.jpg', caption: 'Decorative Openable Gate' },
      { image: '/images/gallery/gate-1.jpg', caption: 'Industrial Gate' },
    ],
    galleryDescription:
      'Our gate installations combine superior security with architectural appeal for homes and commercial spaces.',
  },
  {
    id: 5,
    slug: 'aluminium-staircase-railing',
    name: 'Aluminium Staircase Railing',
    shortName: 'Alum Staircase',
    number: '05',
    tagline: 'Elevate every step you take',
    description:
      'Transform your staircase into a focal point with our exquisitely crafted aluminium staircase railings. Available in a range of profiles and finishes including brushed gold, matte black and custom powder-coated colours, our railings pair seamlessly with glass treads, wooden steps and marble staircases alike.',
    image: '/images/products/alum-staircase.jpg',
    price: 950,
    unit: 'per running ft',
    minQty: 10,
    priceNote: 'Final price may vary after site measurement.',
    variants: {
      finish: [
        { name: 'Brushed Gold', priceMultiplier: 1.2 },
        { name: 'Matte Black', priceMultiplier: 1.0 },
        { name: 'Silver Anodized', priceMultiplier: 1.05 },
      ],
      material: [
        { name: 'Standard Extruded Alloy', priceMultiplier: 1.0 },
        { name: 'Reinforced Steel Insert', priceMultiplier: 1.2 },
      ],
    },
    features: [
      { icon: 'ShieldCheck', label: 'Rust Resistant' },
      { icon: 'Gem', label: 'High Durability' },
      { icon: 'Sparkles', label: 'Modern Finish' },
      { icon: 'Settings', label: 'Low Maintenance' },
    ],
    specs: {
      Material: 'Premium Aluminium Alloy with Steel Inserts',
      Finish: 'Brushed Gold, Matte Black, Silver, Custom Colors',
      Applications: 'Indoor Staircases, Mezzanines, Duplex Homes',
      Customization: 'Profile Design, Height, Glass Infill, LED Integration',
      Installation: 'Precision Installation with Level Guarantee',
    },
    gallery: [
      { image: '/images/gallery/ss-railing-2.jpg', caption: 'Glass Staircase Railing' },
      { image: '/images/gallery/ss-railing-1.jpg', caption: 'Marble Staircase Railing' },
      { image: '/images/gallery/alum-balcony-4.jpg', caption: 'Duplex Staircase' },
      { image: '/images/gallery/alum-balcony-1.jpg', caption: 'Commercial Staircase' },
    ],
    galleryDescription:
      'Our aluminium staircase railing projects demonstrate how premium materials elevate interior architecture.',
  },
  {
    id: 6,
    slug: 'stainless-steel-pvd-work',
    name: 'Stainless Steel PVD Work',
    shortName: 'SS PVD Work',
    number: '06',
    tagline: 'Luxury surfaces, timeless gold',
    description:
      'Our PVD (Physical Vapour Deposition) coated stainless steel products add a touch of opulence to any interior. Available in gold, rose-gold, black and champagne finishes, our PVD work covers decorative panels, partitions, door frames, cladding and reception counters — delivering a mirror-like luxury finish that resists scratches, tarnishing and corrosion.',
    image: '/images/products/pvd-work.jpg',
    price: 3200,
    unit: 'per sq ft',
    minQty: 10,
    priceNote: 'Final price may vary after site measurement.',
    variants: {
      finish: [
        { name: 'Mirror Gold', priceMultiplier: 1.0 },
        { name: 'Rose Gold', priceMultiplier: 1.05 },
        { name: 'Black Titanium', priceMultiplier: 1.1 },
        { name: 'Champagne Bronze', priceMultiplier: 1.08 },
      ],
      material: [
        { name: 'SS 304 Sheet Clad', priceMultiplier: 1.0 },
        { name: 'SS 316 Solid Panel', priceMultiplier: 1.25 },
      ],
    },
    features: [
      { icon: 'ShieldCheck', label: 'Rust Resistant' },
      { icon: 'Gem', label: 'High Durability' },
      { icon: 'Sparkles', label: 'Modern Finish' },
      { icon: 'Settings', label: 'Low Maintenance' },
    ],
    specs: {
      Material: 'SS 304 / SS 316 with PVD Coating',
      Finish: 'Gold, Rose Gold, Black Titanium, Champagne, Copper',
      Applications: 'Partitions, Door Frames, Wall Panels, Cladding',
      Customization: 'Color, Pattern, Size, CNC Cutouts',
      Installation: 'Expert Installation with Precision Fitting',
    },
    gallery: [
      { image: '/images/gallery/pvd-1.jpg', caption: 'Gold PVD Partition' },
      { image: '/images/gallery/pvd-1.jpg', caption: 'Rose Gold Door Frame' },
      { image: '/images/gallery/cnc-1.jpg', caption: 'PVD Wall Cladding' },
      { image: '/images/gallery/pvd-1.jpg', caption: 'Luxury Reception Counter' },
    ],
    galleryDescription:
      'Our PVD work projects showcase how metallic luxury finishes can elevate commercial and residential interiors.',
  },
  {
    id: 7,
    slug: 'stainless-steel-cnc-work',
    name: 'Stainless Steel CNC Work',
    shortName: 'SS CNC Work',
    number: '07',
    tagline: 'Art in metal, precision in craft',
    description:
      'Our CNC and laser-cut stainless steel work brings intricate artistry to metal. From traditional jali screens and decorative gates to modern geometric panels and room dividers, our precision CNC cutting enables complex designs that traditional fabrication cannot achieve — delivering stunning visual impact with structural integrity.',
    image: '/images/products/cnc-work.jpg',
    price: 1800,
    unit: 'per sq ft',
    minQty: 10,
    priceNote: 'Final price may vary after site measurement.',
    variants: {
      finish: [
        { name: 'Natural Brushed SS', priceMultiplier: 1.0 },
        { name: 'PVD Gold Coated', priceMultiplier: 1.4 },
        { name: 'Powder Coated Black', priceMultiplier: 1.05 },
      ],
      material: [
        { name: 'SS 304 (2mm Gauge)', priceMultiplier: 1.0 },
        { name: 'SS 304 (3mm Heavy)', priceMultiplier: 1.3 },
        { name: 'SS 316 (3mm Marine)', priceMultiplier: 1.55 },
      ],
    },
    features: [
      { icon: 'ShieldCheck', label: 'Rust Resistant' },
      { icon: 'Gem', label: 'High Durability' },
      { icon: 'Sparkles', label: 'Modern Finish' },
      { icon: 'Settings', label: 'Low Maintenance' },
    ],
    specs: {
      Material: 'SS 304 / MS / Aluminium / Corten Steel',
      Finish: 'PVD Coated, Powder Coated, Natural, Painted',
      Applications: 'Jali Screens, Gates, Panels, Room Dividers',
      Customization: 'Custom Patterns, Size, Material, Finish',
      Installation: 'Professional Installation with Precise Alignment',
    },
    gallery: [
      { image: '/images/gallery/cnc-1.jpg', caption: 'Floral Jali Screen' },
      { image: '/images/gallery/cnc-1.jpg', caption: 'Geometric Gate Panel' },
      { image: '/images/gallery/pvd-1.jpg', caption: 'CNC Room Divider' },
      { image: '/images/gallery/cnc-1.jpg', caption: 'Decorative Wall Panel' },
    ],
    galleryDescription:
      'Our CNC work gallery demonstrates the extraordinary detail and artistry achievable with precision metal cutting.',
  },
];

export const getProductBySlug = (slug) => products.find((p) => p.slug === slug);
export const getRelatedProducts = (slug, count = 4) =>
  products.filter((p) => p.slug !== slug).slice(0, count);

export const projects = [
  { id: 1, image: '/images/projects/project1.jpg', title: 'Luxury Villa Railing, Anand', category: 'Stainless Steel Railing' },
  { id: 2, image: '/images/projects/project2.jpg', title: 'High-Rise Balcony, Vadodara', category: 'Aluminium Balcony' },
  { id: 3, image: '/images/projects/project3.jpg', title: 'Grand Staircase, Ahmedabad', category: 'Aluminium Staircase' },
  { id: 4, image: '/images/projects/project4.jpg', title: 'CNC Gate, Surat', category: 'CNC Work' },
  { id: 5, image: '/images/projects/project5.jpg', title: 'Terrace Railing, Anand', category: 'Aluminium Railing' },
  { id: 6, image: '/images/projects/project6.jpg', title: 'Sliding Gate, Bharuch', category: 'SS Gate' },
];

export const testimonials = [
  {
    id: 1,
    name: 'Rajesh Patel',
    role: 'Homeowner, Anand',
    text: 'Nirmaan transformed our villa with stunning SS railings and an aluminium balcony. The craftsmanship is exceptional and the team was professional throughout.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Priya Shah',
    role: 'Interior Designer, Vadodara',
    text: 'I\'ve recommended Nirmaan to all my clients. Their PVD work and CNC panels are of the finest quality — truly luxury grade at competitive pricing.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Amit Desai',
    role: 'Builder, Ahmedabad',
    text: 'Reliable, on-time delivery and superb installation. We\'ve partnered with Nirmaan for 3 projects now and the quality never disappoints.',
    rating: 5,
  },
];

export const whyUsPoints = [
  { icon: 'Award', title: '10+ Years Experience', desc: 'A decade of precision fabrication and installation expertise across Gujarat.' },
  { icon: 'CheckCircle', title: 'Premium Materials', desc: 'We use only certified SS 304/316 and aerospace-grade aluminium alloys.' },
  { icon: 'Users', title: 'Skilled Team', desc: 'Our craftsmen are trained to deliver flawless finishes on every project.' },
  { icon: 'Clock', title: 'On-Time Delivery', desc: 'We respect your timeline and commit to delivering on schedule, always.' },
  { icon: 'Headphones', title: 'After-Sales Support', desc: 'Dedicated support team for maintenance, warranty and post-installation queries.' },
  { icon: 'MapPin', title: 'Local & Pan-Gujarat', desc: 'Based in Anand, serving residential, commercial and industrial clients statewide.' },
];
