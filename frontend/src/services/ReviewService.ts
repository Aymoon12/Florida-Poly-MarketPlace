import api from './api';

export interface Review {
  id: number;
  saleId: number;
  reviewerId: number;
  reviewerName: string;
  reviewType: 'SELLER' | 'ITEM' | 'BUYER';
  rating: number;
  comment?: string;
  createdAt: string;
  relativeTime: string;
  reviewedSellerId?: number;
  reviewedSellerName?: string;
  reviewedItemId?: number;
  reviewedItemTitle?: string;
  reviewedBuyerId?: number;
  reviewedBuyerName?: string;
}

export interface CreateReviewRequest {
  saleId: number;
  reviewType: 'SELLER' | 'ITEM' | 'BUYER';
  rating: number;
  comment?: string;
}

export interface RatingSummary {
  averageRating: number;
  reviewCount: number;
}

const ReviewService = {
  createReview: async (request: CreateReviewRequest): Promise<Review> => {
    const response = await api.post('/api/v1/reviews', request);
    return response.data;
  },

  canReview: async (saleId: number, reviewType: 'SELLER' | 'ITEM' | 'BUYER'): Promise<boolean> => {
    const response = await api.get('/api/v1/reviews/can-review', {
      params: { saleId, reviewType }
    });
    return response.data;
  },

  getSellerReviews: async (sellerId: number, page: number = 0, size: number = 10): Promise<Review[]> => {
    const response = await api.get(`/api/v1/reviews/seller/${sellerId}`, {
      params: { page, size }
    });
    return response.data;
  },

  getItemReviews: async (itemId: number, page: number = 0, size: number = 10): Promise<Review[]> => {
    const response = await api.get(`/api/v1/reviews/item/${itemId}`, {
      params: { page, size }
    });
    return response.data;
  },

  getSellerRatingSummary: async (sellerId: number): Promise<RatingSummary> => {
    const response = await api.get(`/api/v1/reviews/seller/${sellerId}/summary`);
    return response.data;
  },

  getItemRatingSummary: async (itemId: number): Promise<RatingSummary> => {
    const response = await api.get(`/api/v1/reviews/item/${itemId}/summary`);
    return response.data;
  },

  getUserGivenReviews: async (): Promise<Review[]> => {
    const response = await api.get('/api/v1/reviews/user/given');
    return response.data;
  },

  deleteReview: async (reviewId: number): Promise<boolean> => {
    const response = await api.delete(`/api/v1/reviews/${reviewId}`);
    return response.data;
  },

  getBuyerReviews: async (buyerId: number, page: number = 0, size: number = 10): Promise<Review[]> => {
    const response = await api.get(`/api/v1/reviews/buyer/${buyerId}`, {
      params: { page, size }
    });
    return response.data;
  },

  getBuyerRatingSummary: async (buyerId: number): Promise<RatingSummary> => {
    const response = await api.get(`/api/v1/reviews/buyer/${buyerId}/summary`);
    return response.data;
  }
};

export default ReviewService;
