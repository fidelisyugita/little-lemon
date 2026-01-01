import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  firstName: string;
  email: string;
  isOnboarded: boolean;
  // Add other fields if necessary
  lastName?: string;
  phoneNumber?: string;
  emailNotifications?: boolean[]; // [orderStatuses, passwordChanges, specialOffers, newsletter]
}

const STORAGE_KEY = 'little_lemon_user_profile';

export const saveUser = async (user: UserProfile): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(user);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error('Failed to save user profile', e);
  }
};

export const getUser = async (): Promise<UserProfile | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Failed to fetch user profile', e);
    return null;
  }
};

export const clearUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear user profile', e);
  }
};
