import { useState } from 'react';
import axios from '../service/api'; // Adjust this path according to your folder structure

const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<any>(null);

  const login = async (phoneNumber: string, password: string) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post('/auth/login', {
        phoneNumber,
        password,
      });
      setData(data);
      if (data.success) {
        localStorage.setItem('token', data.body);
        window.location.pathname = '/';
      } else throw new Error();
    } catch (error) {
      setError(error);
      throw new Error();
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, data, login };
};

export default useLogin;
