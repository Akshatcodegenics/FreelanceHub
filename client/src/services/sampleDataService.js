import { sampleGigs, additionalSampleGigs, categories } from '../data/sampleGigs';

// Combine all sample gigs
const allSampleGigs = [...sampleGigs, ...additionalSampleGigs];

// Add more gigs to reach 20 total
const moreSampleGigs = [
  {
    _id: '9',
    slug: 'voice-over-professional-recording',
    title: 'I will record a professional voice over for your project',
    description: 'Professional voice actor with broadcast-quality home studio. I deliver clear, engaging voice overs for commercials, explainer videos, and audiobooks.',
    category: 'music-audio',
    subcategory: 'voice-over',
    tags: ['voice over', 'narration', 'commercial', 'audio recording'],
    images: [
      'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&h=600&fit=crop'
    ],
    pricing: {
      basic: { title: '100 Words', price: 30, deliveryTime: 2, revisions: 2 },
      standard: { title: '300 Words', price: 75, deliveryTime: 3, revisions: 3 },
      premium: { title: '500 Words', price: 120, deliveryTime: 5, revisions: 4 }
    },
    seller: {
      _id: 'seller9',
      name: 'Robert Voice',
      username: 'robertvoice',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
      level: 'Level 1 Seller',
      rating: 4.76,
      reviewCount: 234
    },
    rating: 4.76,
    reviewCount: 234,
    featured: false,
    startingPrice: 30
  },
  {
    _id: '10',
    slug: 'business-plan-writing-service',
    title: 'I will write a comprehensive business plan for your startup',
    description: 'MBA-qualified business consultant with 10+ years experience. I create detailed, investor-ready business plans that help secure funding and guide growth.',
    category: 'writing-translation',
    subcategory: 'business-writing',
    tags: ['business plan', 'startup', 'consulting', 'investor pitch', 'strategy'],
    images: [
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop'
    ],
    pricing: {
      basic: { title: 'Basic Plan', price: 300, deliveryTime: 7, revisions: 2 },
      standard: { title: 'Detailed Plan', price: 600, deliveryTime: 14, revisions: 3 },
      premium: { title: 'Investor Ready', price: 1200, deliveryTime: 21, revisions: 5 }
    },
    seller: {
      _id: 'seller10',
      name: 'Jennifer Adams',
      username: 'jenniferplans',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face',
      level: 'Top Rated Seller',
      rating: 4.96,
      reviewCount: 567
    },
    rating: 4.96,
    reviewCount: 567,
    featured: true,
    startingPrice: 300
  }
];

// Complete gigs array
export const completeGigsList = [...allSampleGigs, ...moreSampleGigs];

// Sample data service functions
export const sampleDataService = {
  // Get all gigs with filtering and pagination
  getGigs: (params = {}) => {
    let filteredGigs = [...completeGigsList];
    
    // Apply search filter
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredGigs = filteredGigs.filter(gig => 
        gig.title.toLowerCase().includes(searchTerm) ||
        gig.description.toLowerCase().includes(searchTerm) ||
        gig.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    // Apply category filter
    if (params.category) {
      filteredGigs = filteredGigs.filter(gig => gig.category === params.category);
    }
    
    // Apply price range filter
    if (params.minPrice) {
      filteredGigs = filteredGigs.filter(gig => gig.startingPrice >= parseInt(params.minPrice));
    }
    if (params.maxPrice) {
      filteredGigs = filteredGigs.filter(gig => gig.startingPrice <= parseInt(params.maxPrice));
    }
    
    // Apply rating filter
    if (params.rating) {
      filteredGigs = filteredGigs.filter(gig => gig.rating >= parseFloat(params.rating));
    }
    
    // Apply delivery time filter
    if (params.delivery) {
      filteredGigs = filteredGigs.filter(gig => gig.deliveryTime <= parseInt(params.delivery));
    }
    
    // Apply sorting
    if (params.sort) {
      switch (params.sort) {
        case 'price-low':
          filteredGigs.sort((a, b) => a.startingPrice - b.startingPrice);
          break;
        case 'price-high':
          filteredGigs.sort((a, b) => b.startingPrice - a.startingPrice);
          break;
        case 'rating':
          filteredGigs.sort((a, b) => b.rating - a.rating);
          break;
        case 'reviews':
          filteredGigs.sort((a, b) => b.reviewCount - a.reviewCount);
          break;
        case 'newest':
          filteredGigs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          break;
        default:
          // Default: relevance (featured first, then by rating)
          filteredGigs.sort((a, b) => {
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            return b.rating - a.rating;
          });
      }
    }
    
    // Apply pagination
    const page = parseInt(params.page) || 1;
    const limit = parseInt(params.limit) || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedGigs = filteredGigs.slice(startIndex, endIndex);
    
    return {
      gigs: paginatedGigs,
      total: filteredGigs.length,
      totalPages: Math.ceil(filteredGigs.length / limit),
      currentPage: page,
      hasNextPage: endIndex < filteredGigs.length,
      hasPrevPage: page > 1
    };
  },
  
  // Get featured gigs
  getFeaturedGigs: (limit = 8) => {
    const featuredGigs = completeGigsList.filter(gig => gig.featured);
    return featuredGigs.slice(0, limit);
  },
  
  // Get gig by slug
  getGigBySlug: (slug) => {
    return completeGigsList.find(gig => gig.slug === slug);
  },
  
  // Get gig by ID
  getGigById: (id) => {
    return completeGigsList.find(gig => gig._id === id);
  },
  
  // Get categories with gig counts
  getCategories: () => {
    return categories.map(category => ({
      ...category,
      gigCount: completeGigsList.filter(gig => gig.category === category.slug).length
    }));
  },
  
  // Get related gigs
  getRelatedGigs: (gigId, limit = 4) => {
    const currentGig = completeGigsList.find(gig => gig._id === gigId);
    if (!currentGig) return [];
    
    const relatedGigs = completeGigsList
      .filter(gig => gig._id !== gigId && gig.category === currentGig.category)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
    
    return relatedGigs;
  },
  
  // Search suggestions
  getSearchSuggestions: (query) => {
    if (!query || query.length < 2) return [];
    
    const suggestions = new Set();
    const queryLower = query.toLowerCase();
    
    completeGigsList.forEach(gig => {
      // Add matching titles
      if (gig.title.toLowerCase().includes(queryLower)) {
        suggestions.add(gig.title);
      }
      
      // Add matching tags
      gig.tags.forEach(tag => {
        if (tag.toLowerCase().includes(queryLower)) {
          suggestions.add(tag);
        }
      });
    });
    
    return Array.from(suggestions).slice(0, 5);
  }
};

// Sample reviews data
export const sampleReviews = [
  {
    _id: 'review1',
    gigId: '1',
    buyer: {
      name: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face'
    },
    rating: 5,
    comment: 'Absolutely amazing work! Sarah delivered exactly what I needed and more. The logo perfectly captures our brand essence.',
    createdAt: '2024-01-20T10:00:00Z'
  },
  {
    _id: 'review2',
    gigId: '1',
    buyer: {
      name: 'Emily Davis',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face'
    },
    rating: 5,
    comment: 'Professional, fast, and creative. Will definitely work with Sarah again!',
    createdAt: '2024-01-18T15:30:00Z'
  }
];

export default sampleDataService;
