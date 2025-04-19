 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@env';
export async function fetchWithAuth(path: string, init: RequestInit = {}) {
  const token = await AsyncStorage.getItem('authToken');
  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      ...(init.headers ?? {}),
      Authorization: `Bearer ${token}`
    }
  });
}
