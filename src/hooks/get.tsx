import axios from '../service/api';
import { useState } from 'react';

const useGet = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const get = async (url: string, page?: number) => {
    setIsLoading(true);
    try {
      const api = page ? `${url}?page=${page ? page : 0}&size=10` : url;
      const { data } = await axios.get(api);
      if (data.success) {
        setData(data.body);
      } else {
        setError(new Error('Request failed'));
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, get };
};

export default useGet;
