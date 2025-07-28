 

import messaging from "@react-native-firebase/messaging";
import { useUpdateFcmTokenMutation } from "../store/services/user/userApi";  

export function useSaveFcmToken() {
  const [updateFcmToken] = useUpdateFcmTokenMutation();

  const saveFcmToken = async (userId: string, immediateToken?: string) => {
    try {
      const fcmToken = await messaging().getToken();
      const token = immediateToken || await AsyncStorage.getItem('authToken');
      
      if (!token) throw new Error("No authentication token available");

      const response = await updateFcmToken({
        userId,
        fcmToken,
        headers: { Authorization: `Bearer ${token}` } // Explicit headers
      }).unwrap();

      return response;
    } catch (error) {
      console.error("FCM Update Failed:", {
        status: error?.status,
        endpoint: `/api/users/${userId}/fcm-token`,
        authHeader: token ? `Bearer ${token.substring(0, 10)}...` : 'MISSING'
      });
      throw error;
    }
  };
  return saveFcmToken;
}


