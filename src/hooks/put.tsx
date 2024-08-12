import axios from '../service/api';
import { useState } from 'react';

const usePut = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  const put = async (url: string, id: string, updateData: {}) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const { data } = await axios.put(`${url}/${id}`, updateData);
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

  return { data, error, isLoading, put };
};

export default usePut;
