import AsyncStorage from '@react-native-async-storage/async-storage';

export interface StoreInterface {
  key: string;
  value?: any;
}

export const _storeData = async (data: StoreInterface) => {
  try {
    await AsyncStorage.setItem(data.key, JSON.stringify(data.value));
  } catch (error) {
    return error;
  }
};

export const _getData = async (data: StoreInterface) => {
  try {
    const value = await AsyncStorage.getItem(data.key);
    if (value !== null) {
      return value;
    } else {
      return false;
    }
  } catch (error) {
    return error;
  }
};

export const _getDataJson = async (data: StoreInterface) => {
  try {
    const value = await AsyncStorage.getItem(data.key);
    if (value !== null) {
      return JSON.parse(value);
    } else {
      return false;
    }
  } catch (error) {
    return error;
  }
};

export const _removeData = async (data: StoreInterface) => {
  try {
    await AsyncStorage.removeItem(data.key);
  } catch (error) {
    return error;
  }
};
