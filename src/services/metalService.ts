import { MetalData, MetalId } from '../types';

export const fetchMetalPrice = async (id: MetalId): Promise<MetalData> => {
  const response = await fetch(`/api/metals/${id}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${id} price from server`);
  }

  return response.json();
};
