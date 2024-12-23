import { useState } from 'react';
import axios from '../service/api';

const usePost = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>(null);

  const post = async (url: string, postData: any) => {
    setIsLoading(true);
   //  console.clear();
    setError(null);
    setData(null);
    try {
      const { data } = await axios.post(url, postData);
      if (data.success) {
        setData(data.body);
      }
      return data.body;
    } catch (err: any) {
      setError(err);
      throw new Error(
        err.response.data.message
          ? err.response.data.message
          : err.response.data.error,
      );
    } 
    finally {
      setIsLoading(false);
    }
  };

  return { data, isLoading, error, post };
};

export default usePost;
