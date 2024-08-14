import axios from '../service/api';
import { useState } from 'react';

const useGet = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const get = async (url: string, page?: any) => {
    setIsLoading(true);

    try {
      const api = page >= 0 ? `${url}?page=${page}&size=10` : url;
      const { data } = await axios.get(api);
      if (data.success) {
        setData(data.body);
      }
    } catch (err: any) {
      setError(err);
      if (err.response && err.response.status === 404) setData(null)
      throw new Error(
        err.response.data.message
          ? err.response.data.message
          : err.response.data.error,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, get };
};

export default useGet;
