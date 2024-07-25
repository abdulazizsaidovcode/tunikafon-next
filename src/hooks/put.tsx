import axios from '../service/api';
import { useState } from 'react';

const usePut = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  const put = async (url: string, id: string, updateData: {}) => {
    setIsLoading(true);
    try {
      const { data } = await axios.put(`${url}/${id}`, updateData);
      if (data.success) {
        setData(data);
      } else {
        setError(new Error());
      }
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, error, isLoading, put };
};

export default usePut;
