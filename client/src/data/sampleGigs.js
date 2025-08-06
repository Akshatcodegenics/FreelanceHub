// Sample gigs data for FreelanceHub marketplace
export const sampleGigs = [
  {
    _id: '1',
    slug: 'professional-logo-design-modern-minimalist',
    title: 'I will design a professional logo for your business',
    description: 'Get a stunning, professional logo that represents your brand perfectly. I specialize in modern, minimalist designs that work across all platforms and media. With over 5 years of experience in graphic design, I\'ve helped hundreds of businesses establish their visual identity.',
    fullDescription: 'Welcome to my professional logo design service! I\'m a passionate graphic designer with over 5 years of experience creating memorable brand identities for businesses worldwide.\n\nWhat you get:\n• Custom logo design tailored to your brand\n• Multiple concept variations\n• High-resolution files (PNG, JPG, SVG, AI)\n• Commercial usage rights\n• Unlimited revisions until satisfied\n• Brand guidelines document\n• Social media kit\n\nMy design process:\n1. Brand discovery and research\n2. Concept development\n3. Initial design presentation\n4. Revisions and refinements\n5. Final delivery with all files\n\nI work with businesses of all sizes, from startups to established companies. My designs are modern, timeless, and versatile - perfect for both digital and print applications.',
    category: 'graphics-design',
    subcategory: 'logo-design',
    tags: ['logo', 'branding', 'graphic design', 'business', 'modern', 'minimalist'],
    images: [
      'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1634942537034-2531766767d1?w=800&h=600&fit=crop'
    ],
    pricing: {
      basic: {
        title: 'Basic Logo',
        price: 25,
        description: '1 logo concept, 2 revisions, 48h delivery',
        deliveryTime: 2,
        revisions: 2,
        features: ['1 logo concept', '2 revisions', 'High-res PNG & JPG', '48h delivery']
      },
      standard: {
        title: 'Standard Package',
        price: 50,
        description: '3 logo concepts, 5 revisions, 24h delivery',
        deliveryTime: 1,
        revisions: 5,
        features: ['3 logo concepts', '5 revisions', 'All file formats', 'Social media kit', '24h delivery']
      },
      premium: {
        title: 'Premium Branding',
        price: 100,
        description: '5 concepts, unlimited revisions, brand guidelines',
        deliveryTime: 3,
        revisions: 'unlimited',
        features: ['5 logo concepts', 'Unlimited revisions', 'Brand guidelines', 'Business card design', 'Vector files', 'Commercial license']
      }
    },
    seller: {
      _id: 'seller1',
      name: 'Sarah Johnson',
      username: 'sarahdesigns',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
      level: 'Level 2 Seller',
      rating: 4.9,
      reviewCount: 847,
      responseTime: '1 hour',
      location: 'United States',
      memberSince: '2019-03-15',
      languages: ['English', 'Spanish'],
      skills: ['Logo Design', 'Brand Identity', 'Graphic Design', 'Adobe Illustrator']
    },
    rating: 4.9,
    reviewCount: 847,
    ordersInQueue: 12,
    featured: true,
    startingPrice: 25,
    deliveryTime: 2,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z'
  },
  {
    _id: '2',
    slug: 'react-web-application-development',
    title: 'I will develop a modern React web application',
    description: 'Full-stack React developer with 7+ years experience. I build responsive, fast, and scalable web applications using the latest technologies including React, Node.js, and MongoDB.',
    fullDescription: 'Transform your ideas into powerful web applications! I\'m a senior full-stack developer specializing in React ecosystem with extensive experience in modern web development.\n\nTechnologies I use:\n• Frontend: React, Next.js, TypeScript, Tailwind CSS\n• Backend: Node.js, Express, MongoDB, PostgreSQL\n• Tools: Git, Docker, AWS, Vercel\n• Testing: Jest, Cypress, React Testing Library\n\nWhat\'s included:\n• Responsive design for all devices\n• Clean, maintainable code\n• SEO optimization\n• Performance optimization\n• Security best practices\n• Documentation\n• Post-delivery support\n\nI follow agile development practices and maintain constant communication throughout the project.',
    category: 'programming-tech',
    subcategory: 'web-development',
    tags: ['react', 'javascript', 'web development', 'frontend', 'backend', 'full-stack'],
    images: [
      'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop'
    ],
    pricing: {
      basic: {
        title: 'Landing Page',
        price: 150,
        description: 'Single page React application',
        deliveryTime: 5,
        revisions: 3,
        features: ['Responsive design', 'Contact form', 'SEO optimization', '3 revisions']
      },
      standard: {
        title: 'Multi-page Website',
        price: 350,
        description: 'Complete website with CMS',
        deliveryTime: 10,
        revisions: 5,
        features: ['Up to 10 pages', 'Content management', 'Database integration', 'Admin panel', '5 revisions']
      },
      premium: {
        title: 'Full Web App',
        price: 750,
        description: 'Complete web application with backend',
        deliveryTime: 21,
        revisions: 'unlimited',
        features: ['Custom functionality', 'User authentication', 'Payment integration', 'API development', 'Deployment', 'Unlimited revisions']
      }
    },
    seller: {
      _id: 'seller2',
      name: 'Alex Chen',
      username: 'alexcodes',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      level: 'Top Rated Seller',
      rating: 4.95,
      reviewCount: 1203,
      responseTime: '30 minutes',
      location: 'Canada',
      memberSince: '2017-08-20',
      languages: ['English', 'Mandarin'],
      skills: ['React', 'Node.js', 'JavaScript', 'TypeScript', 'MongoDB']
    },
    rating: 4.95,
    reviewCount: 1203,
    ordersInQueue: 8,
    featured: true,
    startingPrice: 150,
    deliveryTime: 5,
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-25T12:00:00Z'
  },
  {
    _id: '3',
    slug: 'social-media-marketing-strategy',
    title: 'I will create a comprehensive social media marketing strategy',
    description: 'Boost your brand\'s online presence with a data-driven social media strategy. I\'ll help you grow your audience, increase engagement, and drive conversions across all major platforms.',
    fullDescription: 'Ready to dominate social media? I\'m a certified digital marketing specialist with 6+ years of experience helping brands achieve explosive growth on social platforms.\n\nWhat you\'ll receive:\n• Complete social media audit\n• Platform-specific strategies\n• Content calendar (30 days)\n• Hashtag research\n• Competitor analysis\n• Growth tactics\n• Analytics setup\n• Performance metrics\n\nPlatforms I specialize in:\n• Instagram & Instagram Stories\n• Facebook & Facebook Ads\n• Twitter/X\n• LinkedIn\n• TikTok\n• YouTube\n• Pinterest\n\nI use proven strategies that have generated millions of impressions and thousands of conversions for my clients.',
    category: 'digital-marketing',
    subcategory: 'social-media-marketing',
    tags: ['social media', 'marketing', 'instagram', 'facebook', 'strategy', 'growth'],
    images: [
      'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop'
    ],
    pricing: {
      basic: {
        title: 'Strategy Basics',
        price: 75,
        description: 'Social media audit + basic strategy',
        deliveryTime: 3,
        revisions: 2,
        features: ['Platform audit', 'Basic strategy', 'Content ideas', '2 revisions']
      },
      standard: {
        title: 'Complete Strategy',
        price: 150,
        description: 'Full strategy + content calendar',
        deliveryTime: 5,
        revisions: 3,
        features: ['Complete audit', 'Detailed strategy', '30-day content calendar', 'Hashtag research', '3 revisions']
      },
      premium: {
        title: 'Growth Package',
        price: 300,
        description: 'Strategy + implementation + optimization',
        deliveryTime: 7,
        revisions: 5,
        features: ['Everything in Standard', 'Competitor analysis', 'Ad strategy', '60-day calendar', 'Monthly optimization', '5 revisions']
      }
    },
    seller: {
      _id: 'seller3',
      name: 'Maria Rodriguez',
      username: 'mariamarketing',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      level: 'Level 2 Seller',
      rating: 4.8,
      reviewCount: 592,
      responseTime: '2 hours',
      location: 'Spain',
      memberSince: '2020-01-10',
      languages: ['English', 'Spanish', 'French'],
      skills: ['Social Media Marketing', 'Content Strategy', 'Facebook Ads', 'Instagram Growth']
    },
    rating: 4.8,
    reviewCount: 592,
    ordersInQueue: 15,
    featured: false,
    startingPrice: 75,
    deliveryTime: 3,
    createdAt: '2024-01-12T14:00:00Z',
    updatedAt: '2024-01-22T16:45:00Z'
  }
];

// Continue with more sample gigs
export const additionalSampleGigs = [
  {
    _id: '4',
    slug: 'professional-copywriting-sales-content',
    title: 'I will write compelling copy that converts visitors into customers',
    description: 'Award-winning copywriter with 8+ years experience. I craft persuasive copy for websites, emails, ads, and sales pages that drive results and boost conversions.',
    category: 'writing-translation',
    subcategory: 'copywriting',
    tags: ['copywriting', 'sales copy', 'content writing', 'marketing', 'conversion'],
    images: [
      'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&h=600&fit=crop'
    ],
    pricing: {
      basic: { title: 'Website Copy', price: 100, deliveryTime: 3, revisions: 2 },
      standard: { title: 'Sales Page', price: 250, deliveryTime: 5, revisions: 3 },
      premium: { title: 'Complete Campaign', price: 500, deliveryTime: 7, revisions: 5 }
    },
    seller: {
      _id: 'seller4',
      name: 'David Thompson',
      username: 'davidwrites',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      level: 'Top Rated Seller',
      rating: 4.92,
      reviewCount: 1456
    },
    rating: 4.92,
    reviewCount: 1456,
    featured: true,
    startingPrice: 100
  },
  {
    _id: '5',
    slug: 'animated-explainer-video-production',
    title: 'I will create an engaging animated explainer video for your business',
    description: 'Professional animator specializing in explainer videos. I create engaging, high-quality animations that explain your product or service in a clear and compelling way.',
    category: 'video-animation',
    subcategory: 'animated-videos',
    tags: ['animation', 'explainer video', 'motion graphics', 'video production'],
    images: [
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop'
    ],
    pricing: {
      basic: { title: '30-second Video', price: 200, deliveryTime: 7, revisions: 2 },
      standard: { title: '60-second Video', price: 400, deliveryTime: 10, revisions: 3 },
      premium: { title: '90-second Video', price: 650, deliveryTime: 14, revisions: 5 }
    },
    seller: {
      _id: 'seller5',
      name: 'Emma Wilson',
      username: 'emmaanimations',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
      level: 'Level 2 Seller',
      rating: 4.85,
      reviewCount: 324
    },
    rating: 4.85,
    reviewCount: 324,
    featured: false,
    startingPrice: 200
  },
  {
    _id: '6',
    slug: 'mobile-app-ui-ux-design',
    title: 'I will design a stunning mobile app UI/UX that users love',
    description: 'Expert mobile app designer with 6+ years experience. I create intuitive, beautiful interfaces that provide exceptional user experiences and drive engagement.',
    category: 'graphics-design',
    subcategory: 'mobile-design',
    tags: ['mobile app', 'ui design', 'ux design', 'app interface', 'user experience'],
    images: [
      'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop'
    ],
    pricing: {
      basic: { title: '5 Screens', price: 120, deliveryTime: 5, revisions: 3 },
      standard: { title: '10 Screens', price: 220, deliveryTime: 7, revisions: 4 },
      premium: { title: 'Complete App', price: 450, deliveryTime: 14, revisions: 6 }
    },
    seller: {
      _id: 'seller6',
      name: 'James Park',
      username: 'jamesdesigns',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&crop=face',
      level: 'Level 2 Seller',
      rating: 4.87,
      reviewCount: 678
    },
    rating: 4.87,
    reviewCount: 678,
    featured: true,
    startingPrice: 120
  },
  {
    _id: '7',
    slug: 'seo-optimization-google-ranking',
    title: 'I will boost your website ranking with advanced SEO strategies',
    description: 'SEO specialist with proven track record of ranking websites on Google\'s first page. I use white-hat techniques to improve your search visibility and organic traffic.',
    category: 'digital-marketing',
    subcategory: 'seo',
    tags: ['seo', 'google ranking', 'search optimization', 'organic traffic', 'keyword research'],
    images: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1553830591-fddf9c784d53?w=800&h=600&fit=crop'
    ],
    pricing: {
      basic: { title: 'SEO Audit', price: 50, deliveryTime: 2, revisions: 1 },
      standard: { title: 'On-Page SEO', price: 150, deliveryTime: 7, revisions: 2 },
      premium: { title: 'Complete SEO', price: 350, deliveryTime: 14, revisions: 3 }
    },
    seller: {
      _id: 'seller7',
      name: 'Lisa Kumar',
      username: 'lisakumar',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
      level: 'Top Rated Seller',
      rating: 4.93,
      reviewCount: 1124
    },
    rating: 4.93,
    reviewCount: 1124,
    featured: false,
    startingPrice: 50
  },
  {
    _id: '8',
    slug: 'wordpress-website-development',
    title: 'I will create a professional WordPress website for your business',
    description: 'WordPress expert with 5+ years experience building custom websites. I create fast, secure, and SEO-optimized WordPress sites that convert visitors into customers.',
    category: 'programming-tech',
    subcategory: 'wordpress',
    tags: ['wordpress', 'website development', 'cms', 'responsive design', 'ecommerce'],
    images: [
      'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop'
    ],
    pricing: {
      basic: { title: 'Basic Website', price: 200, deliveryTime: 7, revisions: 3 },
      standard: { title: 'Business Website', price: 400, deliveryTime: 10, revisions: 4 },
      premium: { title: 'E-commerce Site', price: 800, deliveryTime: 21, revisions: 5 }
    },
    seller: {
      _id: 'seller8',
      name: 'Michael Brown',
      username: 'mikewp',
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face',
      level: 'Level 2 Seller',
      rating: 4.81,
      reviewCount: 892
    },
    rating: 4.81,
    reviewCount: 892,
    featured: true,
    startingPrice: 200
  }
];

// Categories with realistic gig counts
export const categories = [
  {
    name: 'Graphics & Design',
    slug: 'graphics-design',
    icon: '🎨',
    description: 'Logo design, branding, illustrations',
    gigCount: 1247,
    subcategories: ['Logo Design', 'Brand Style Guides', 'Business Cards', 'Illustration', 'Web Design']
  },
  {
    name: 'Programming & Tech',
    slug: 'programming-tech', 
    icon: '💻',
    description: 'Web development, mobile apps, software',
    gigCount: 892,
    subcategories: ['Web Development', 'Mobile Apps', 'Desktop Applications', 'Databases', 'DevOps']
  },
  {
    name: 'Digital Marketing',
    slug: 'digital-marketing',
    icon: '📈',
    description: 'SEO, social media, advertising',
    gigCount: 634,
    subcategories: ['Social Media Marketing', 'SEO', 'Content Marketing', 'Email Marketing', 'PPC Advertising']
  },
  {
    name: 'Writing & Translation',
    slug: 'writing-translation',
    icon: '✍️',
    description: 'Content writing, copywriting, translation',
    gigCount: 756,
    subcategories: ['Content Writing', 'Copywriting', 'Technical Writing', 'Translation', 'Proofreading']
  },
  {
    name: 'Video & Animation',
    slug: 'video-animation',
    icon: '🎬',
    description: 'Video editing, animation, motion graphics',
    gigCount: 423,
    subcategories: ['Video Editing', 'Animation', 'Motion Graphics', 'Whiteboard Videos', 'Video Marketing']
  },
  {
    name: 'Music & Audio',
    slug: 'music-audio',
    icon: '🎵',
    description: 'Voice over, music production, audio editing',
    gigCount: 298,
    subcategories: ['Voice Over', 'Music Production', 'Audio Editing', 'Sound Design', 'Podcast Production']
  }
];
