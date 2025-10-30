import { getUserIdFromToken as getIdFromToken } from '../../../utils/de-codeJWT';

/**
 * Helper function để lấy userId từ token trong localStorage
 * Tương tự như userProfile/utils/auth.ts
 */
export const getUserIdFromToken = (): string | null => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.warn('⚠️ Không tìm thấy token trong localStorage');
    return null;
  }

  try {
    const userId = getIdFromToken(token);
    console.log('🆔 UserId từ token:', userId);
    return userId;
  } catch (error) {
    console.error('❌ Lỗi giải mã token:', error);
    return null;
  }
};

