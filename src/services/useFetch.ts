import {useEffect, useState} from 'react';
import api from './api';

interface PropsGet<T = any> {
  url: string;
  ref: any;
  initialValue?: T;
  params?: any;
}

export const useFetch = (payload: PropsGet) => {
  const [data, setData] = useState(payload.initialValue);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (payload.ref.current) {
      (async () => {
        try {
          let params = {};
          if (payload.params) {
            params = payload.params;
          }
          console.log('params ====>', params)
          const response = await api.get<any>(payload.url, {params});
          const jsonData = response.data;
          setData(jsonData);
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      })();
    }

    return () => {
      payload.ref.current = false;
    };
  }, [payload.url, payload.ref, payload.initialValue, payload.params]);

  return {loading, data, error};
};
