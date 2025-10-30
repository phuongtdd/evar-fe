import apiClient from '../../../configs/axiosConfig';
import { BuyTimeRequest, BuyTimeResponse } from '../types';
import { getUserIdFromToken } from '../../userProfile/utils/auth';

/**
 * Mua thời gian cho user
 */
export const buyTime = async (
  packageId: string
): Promise<BuyTimeResponse> => {
  try {
    const userId = getUserIdFromToken();
    
    if (!userId) {
      throw new Error('Không tìm thấy user id trong token. Vui lòng đăng nhập lại.');
    }

    console.log('🌐 Mua thời gian cho user:', userId, 'package:', packageId);
    
    // TODO: Gọi API mua thời gian khi backend sẵn sàng
    // const response = await apiClient.post<BuyTimeResponse>(
    //   '/users/buy-time',
    //   { userId, packageId }
    // );

    console.log('✅ Mua thời gian thành công');
    
    return {
      success: true,
      message: 'Mua thời gian thành công!'
    };
  } catch (error: any) {
    console.error('❌ Lỗi khi mua thời gian:', error);
    throw error;
  }
};

export default {
  buyTime,
};

