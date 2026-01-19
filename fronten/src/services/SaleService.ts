import axios from 'axios';

export interface BuyerInfo {
  id: number;
  name: string;
  email: string;
  conversationId: number;
}

export interface Sale {
  id: number;
  salesDate: string;
  salesPrice: number;
  sellerId: number;
  sellerName: string;
  buyerId: number;
  buyerName: string;
  itemId: number;
  itemTitle: string;
  itemImageUrl?: string;
  sellerReviewed: boolean;
  buyerReviewed: boolean;
  itemReviewed: boolean;
}

export interface MarkAsSoldRequest {
  itemId: number;
  buyerId: number;
  salePrice: number;
}

const BASE_URL = 'http://localhost:8080/api/v1/sale';

const SaleService = {
  markAsSold: async (sellerId: string, request: MarkAsSoldRequest): Promise<Sale> => {
    const response = await axios.post(`${BASE_URL}/mark-as-sold`, request, {
      params: { sellerId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  getPotentialBuyers: async (sellerId: string, itemId: number): Promise<BuyerInfo[]> => {
    const response = await axios.get(`${BASE_URL}/potential-buyers`, {
      params: { sellerId, itemId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  getUserSales: async (userId: string): Promise<Sale[]> => {
    const response = await axios.get(`${BASE_URL}/user-sales`, {
      params: { userId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  },

  getPendingReviews: async (userId: string): Promise<Sale[]> => {
    const response = await axios.get(`${BASE_URL}/pending-reviews`, {
      params: { userId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  }
};

export default SaleService;
