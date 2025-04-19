import Toast from 'react-native-toast-message';

export type ToastType = 'success' | 'error' | 'info';

export function ToastMessage(type: ToastType, text1: string, text2?: string) {
  Toast.show({ type, text1, text2 });
}