import apiClient from '../../../configs/axiosConfig';
import { ChangePasswordRequest, ChangePasswordResponse } from '../types';
import { getUserIdFromToken } from '../../userProfile/utils/auth';
import type { UpdateUserRequest } from '../../userProfile/types';

/**
 * Đổi mật khẩu người dùng
 */
export const changePassword = async (
  data: ChangePasswordRequest
): Promise<ChangePasswordResponse> => {
  try {
    const userId = getUserIdFromToken();
    
    if (!userId) {
      throw new Error('Không tìm thấy user id trong token. Vui lòng đăng nhập lại.');
    }

    console.log('🌐 Đổi mật khẩu cho user:', userId);
    
    // Tạo request body - CHỈ gửi id và password
    const updateRequest: UpdateUserRequest = {
      id: userId,
      password: data.newPassword,
      person: {} // Không cần gửi thông tin person khi chỉ đổi password
    };

    console.log('📤 Gửi request update password:', { id: updateRequest.id, password: '***' });
    
    const response = await apiClient.put(
      '/users/update',
      updateRequest
    );

    console.log('✅ Đổi mật khẩu thành công');
    
    return {
      success: true,
      message: 'Đổi mật khẩu thành công!'
    };
  } catch (error: any) {
    console.error('❌ Lỗi khi đổi mật khẩu:', error);
    throw error;
  }
};

export default {
  changePassword,
};

