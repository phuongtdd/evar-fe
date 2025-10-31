export interface TimePackage {
  id: string;
  name: string;
  hours: number;
  price: number;
  description: string;
  features: string[];
}

export interface BuyTimeRequest {
  packageId: string;
  userId: string;
}

export interface BuyTimeResponse {
  success: boolean;
  message: string;
  remainingTime?: number;
}

