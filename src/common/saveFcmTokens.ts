 

import messaging from "@react-native-firebase/messaging";
import { useUpdateFcmTokenMutation } from "../store/services/user/userApi";  

export function useSaveFcmToken() {
  const [updateFcmToken] = useUpdateFcmTokenMutation();
  const saveFcmToken = async (userId: string) => {
    console.log(`userId`)
    console.log(userId)
    try {
      const fcmToken = await messaging().getToken();
      if(userId){
       await updateFcmToken({userId,fcmToken}).unwrap();
      }

    } catch (error) {
      console.error("❌ Failed to save FCM token:", error);
    }
  };

  return saveFcmToken;
}


