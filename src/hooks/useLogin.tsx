import { useState } from 'react';
import axios from '../service/api'; // Adjust this path according to your folder structure
import { toast } from 'sonner';

const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const login = async (phoneNumber: string, password: string) => {
    setIsLoading(true);
    localStorage.clear();
    try {
      const { data } = await axios.post('/auth/login', {
        phoneNumber,
        password,
      });
      setData(data);

      if (data.success) {
        localStorage.setItem('token', data.body);
        localStorage.setItem('role', data.message);
        window.location.pathname = '/dashboard';
      } else throw new Error();
    } catch (err: any) {
      toast.error('Telefon raqam yoki parolingiz hato');
      throw new Error(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, data, login };
};

export default useLogin;
