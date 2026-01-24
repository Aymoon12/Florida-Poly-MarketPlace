import api from './api';

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

const SaleService = {
  markAsSold: async (request: MarkAsSoldRequest): Promise<Sale> => {
    const response = await api.post('/api/v1/sale/mark-as-sold', request);
    return response.data;
  },

  getPotentialBuyers: async (itemId: number): Promise<BuyerInfo[]> => {
    const response = await api.get('/api/v1/sale/potential-buyers', {
      params: { itemId }
    });
    return response.data;
  },

  getUserSales: async (): Promise<Sale[]> => {
    const response = await api.get('/api/v1/sale/user-sales');
    return response.data;
  },

  getPendingReviews: async (): Promise<Sale[]> => {
    const response = await api.get('/api/v1/sale/pending-reviews');
    return response.data;
  }
};

export default SaleService;
