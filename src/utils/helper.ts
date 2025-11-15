import LocalStorageKey from '../constants/LocalStorageKey';
import {LoginResponseInterface} from '../models/login';
import {_getData} from './AsyncStorage';

type Item = string | number | unknown[];

export const getUser = async (): Promise<any> => {
  const result = await _getData({key: LocalStorageKey.userInfo});
  const userInformation = JSON.parse(result);
  const user = new LoginResponseInterface(userInformation);
  return user;
};

export const ellipsis = (value: string, strLength = 25): string => {
  return value.length > strLength
    ? `${value.substring(0, strLength)}...`
    : value;
};

export const replaceHostURL = (urlStr: string): string => {
  // if (urlStr !== undefined) {
  //   const url = new URL(urlStr);
  //   return ENV !== 'development'
  //     ? `${IMAGE_HOST}/${url.pathname}`
  //     : urlStr;
  // }
  return urlStr;
};

export function isNumber(item: Item): item is number {
  return typeof item === 'number';
}

export function truncate(item: Item, length: number): Item {
  // number
  if (isNumber(item)) {
    return Math.floor(item / 10 ** (length - 1));
  }

  // string | unknown[]
  return item.slice(0, length);
}
