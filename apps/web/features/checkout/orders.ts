import { apiRequest, authorization } from '../../shared/api';

export interface Order {
  id: string;
  status: 'PLACED';
  createdAt: string;
  totalKopecks: number;
  items: { productId: number; productName: string; quantity: number; priceKopecks: number }[];
}

export async function getOrders(token: string): Promise<Order[]> {
  const response = await apiRequest('/orders', { headers: authorization(token) });
  if (response.status === 401) {
    return [];
  }
  if (!response.ok) {
    throw new Error('Order history is unavailable');
  }
  return response.json();
}
