import axios from '../service/api';
import { useState } from 'react';

const useDelete = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  const remove = async (url: string, id: any) => {
    console.clear();
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const { data } = await axios.delete(url + id);
      if (data.success) {
        setData(data);
      }
    } catch (err: any) {
      setError(err);
      throw new Error(
        err.response.data.message
          ? err.response.data.message
          : err.response.data.error,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, remove };
};

export default useDelete;
