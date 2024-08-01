import axios from '../service/api';
import { useState } from 'react';

const useDelete = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  const remove = async (url: string, id: any) => {
    setIsLoading(true);
    setError(null);
    setData(null);
    try {
      const { data } = await axios.delete(`${url}/${id}`);
      if (data.success) {
        setData(data);
      } else {
        setError('Feild to fetch');
      }
    } catch (error) {
      setError(error);
      throw new Error();
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, remove };
};

export default useDelete;
