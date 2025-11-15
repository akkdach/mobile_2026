import {useEffect, useReducer} from 'react';
import {ISparePartBalance} from '../models';

export interface ISparePartState {
  loading: string;
  error: string;
  data: ISparePartBalance[];
  dataDetail: ISparePartBalance | null;
}

type ActionType =
  | {type: 'DATA_FETCH_START'}
  | {type: 'DATA_FETCH_SUCCESS'; payload: ISparePartBalance[] | ISparePartBalance}
  | {type: 'DATA_FETCH_FAILURE'; payload: string};

const initialState: ISparePartState = {
  loading: '',
  error: '',
  data: [],
  dataDetail: null,
};

const sparePartReducer = (
  state: ISparePartState,
  action: ActionType,
): ISparePartState => {
  switch (action.type) {
    case 'DATA_FETCH_START':
      return {...state, loading: 'yes'};
    case 'DATA_FETCH_SUCCESS':
      return {
        ...state,
        loading: 'yes',
        data: action.payload as ISparePartBalance[],
      };
    case 'DATA_FETCH_FAILURE':
      return {...state, loading: 'yes', error: action.payload};
    default:
      return state;
  }
};

export const useFetchSparePartBalance = () => {
  const [data, dispatch] = useReducer(sparePartReducer, initialState);

  const getSparePartBalance = async () => {
    const sparePartBalanceResponse: ISparePartBalance[] = [
      {
        code: '200000001',
        name: 'Adjustadle Spanner (Big) - 25.5mm',
        quota: 0,
        overdue: 0,
        balance: 1
      },
      {
        code: '200000008',
        name: 'Locking plier คีมล็อค Solex',
        quota: 0,
        overdue: 0,
        balance: 1
      },
      {
        code: '200000013',
        name: 'Wrench - 3/4 open end ประแจรวม 3/4',
        quota: 0,
        overdue: 0,
        balance: 1
      },
      {
        code: '200000014',
        name: 'Wrench - 9/16 open end ประแจรวม 9/16',
        quota: 0,
        overdue: 0,
        balance: 1
      },
      {
        code: '200000016',
        name: 'Clip ampmeter snap - cn meter คิปแอมป์',
        quota: 0,
        overdue: 0,
        balance: 1
      },
    ];

    dispatch({
      type: 'DATA_FETCH_SUCCESS',
      payload: sparePartBalanceResponse as ISparePartBalance[],
    });
  };

  useEffect(() => {
    dispatch({type: 'DATA_FETCH_START'});
    getSparePartBalance();
  }, []);

  return data;
};
