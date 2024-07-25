import { useState } from 'react';
import axios from '../service/api';

const usePost = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const post = async (url: string, postData: any) => {
    setError(null);
    setIsLoading(true);
    try {
      const { data } = await axios.post(url, postData);
      if (data.success) {
        setData(data.body);
      } else {
        setError(new Error('Error fetching'));
      }
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, post };
};

export default usePost;
