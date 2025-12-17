import axios from 'axios';

export interface Review {
  id: number;
  saleId: number;
  reviewerId: number;
  reviewerName: string;
  reviewType: 'SELLER' | 'ITEM';
  rating: number;
  comment?: string;
  createdAt: string;
  relativeTime: string;
  reviewedSellerId?: number;
  reviewedSellerName?: string;
  reviewedItemId?: number;
  reviewedItemTitle?: string;
}

export interface CreateReviewRequest {
  saleId: number;
  reviewType: 'SELLER' | 'ITEM';
  rating: number;
  comment?: string;
}

export interface RatingSummary {
  averageRating: number;
  reviewCount: number;
}

const BASE_URL = 'http://localhost:8080/api/v1/reviews';

const ReviewService = {
  createReview: async (userId: string, request: CreateReviewRequest): Promise<Review> => {
    const response = await axios.post(`${BASE_URL}`, request, {
      params: { userId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  canReview: async (userId: string, saleId: number, reviewType: 'SELLER' | 'ITEM'): Promise<boolean> => {
    const response = await axios.get(`${BASE_URL}/can-review`, {
      params: { userId, saleId, reviewType },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  getSellerReviews: async (sellerId: number, page: number = 0, size: number = 10): Promise<Review[]> => {
    const response = await axios.get(`${BASE_URL}/seller/${sellerId}`, {
      params: { page, size },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  getItemReviews: async (itemId: number, page: number = 0, size: number = 10): Promise<Review[]> => {
    const response = await axios.get(`${BASE_URL}/item/${itemId}`, {
      params: { page, size },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  getSellerRatingSummary: async (sellerId: number): Promise<RatingSummary> => {
    const response = await axios.get(`${BASE_URL}/seller/${sellerId}/summary`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  getItemRatingSummary: async (itemId: number): Promise<RatingSummary> => {
    const response = await axios.get(`${BASE_URL}/item/${itemId}/summary`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  getUserGivenReviews: async (userId: string): Promise<Review[]> => {
    const response = await axios.get(`${BASE_URL}/user/${userId}/given`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  deleteReview: async (reviewId: number, userId: string): Promise<boolean> => {
    const response = await axios.delete(`${BASE_URL}/${reviewId}`, {
      params: { userId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  }
};

export default ReviewService;
