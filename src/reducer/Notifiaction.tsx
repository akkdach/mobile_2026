import {useEffect, useReducer} from 'react';
import {INotification} from '../models';

export interface INotificationState {
  loading: string;
  error: string;
  data: INotification[];
  dataDetail: INotification | null;
}

type ActionType =
  | {type: 'DATA_FETCH_START'}
  | {type: 'DATA_FETCH_SUCCESS'; payload: INotification[] | INotification}
  | {type: 'DATA_FETCH_FAILURE'; payload: string};

const initialState: INotificationState = {
  loading: '',
  error: '',
  data: [],
  dataDetail: null,
};

const notificationReducer = (
  state: INotificationState,
  action: ActionType,
): INotificationState => {
  switch (action.type) {
    case 'DATA_FETCH_START':
      return {...state, loading: 'yes'};
    case 'DATA_FETCH_SUCCESS':
      return {
        ...state,
        loading: 'yes',
        data: action.payload as INotification[],
      };
    case 'DATA_FETCH_FAILURE':
      return {...state, loading: 'yes', error: action.payload};
    default:
      return state;
  }
};

export const useFetchNotification = () => {
  const [data, dispatch] = useReducer(notificationReducer, initialState);

  const getNotification = async () => {
    const notificationResponse: INotification[] = [
      {
        title: 'แจ้งซ่อม',
        description: 'กรุณาไปทำการซ่อมตู้สาขา A1',
        action: 'a1',
      },
      {
        title: 'แจ้งซ่อม',
        description: 'กรุณาไปทำการซ่อมตู้สาขา A2',
        action: 'a2',
      },
      {
        title: 'แจ้งซ่อม',
        description: 'กรุณาไปทำการซ่อมตู้สาขา A3',
        action: 'a3',
      },
      {
        title: 'แจ้งซ่อม',
        description: 'กรุณาไปทำการซ่อมตู้สาขา A4',
        action: 'a4',
      },
      {
        title: 'แจ้งซ่อม',
        description: 'กรุณาไปทำการซ่อมตู้สาขา A1',
        action: 'a5',
      },
    ];

    dispatch({
      type: 'DATA_FETCH_SUCCESS',
      payload: notificationResponse as INotification[],
    });
  };

  useEffect(() => {
    dispatch({type: 'DATA_FETCH_START'});
    getNotification();
  }, []);

  return data;
};
