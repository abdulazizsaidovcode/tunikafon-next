import axios from 'axios';
import { base_url } from '../../service/urls';

interface FilterParams {
  employeeName?: string | null;
  ORDER_STATUS?: 'COMPLETED' | 'REJECTED' | 'WAIT' | null;
  address?: string | null;
  date?: string | null;
  page: number;
  size?: number;
}

export const fetchFilteredData = async (params: FilterParams, setData: (data: any[]) => void) => {
  try {
    const { employeeName, ORDER_STATUS, address, date, page, size = 10 } = params;

    // Create a query string dynamically based on provided parameters
    const queryParams = [];

    if (employeeName) queryParams.push(`employeeName=${encodeURIComponent(employeeName)}`);
    if (ORDER_STATUS) queryParams.push(`ORDER_STATUS=${encodeURIComponent(ORDER_STATUS)}`);
    if (address) queryParams.push(`address=${encodeURIComponent(address)}`);
    if (date) queryParams.push(`date=${encodeURIComponent(date)}`);
    
    // Page and size are always required
    queryParams.push(`page=${page}`);
    queryParams.push(`size=${size}`);

    // Join the queryParams array with '&' and create the final URL
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    const url = `${base_url}/order/dashboard/filter${queryString}`;

    // Make GET request
    const res = await axios.get(url);

    // Handle response
    if (res.data.success) {
      setData(res.data.body);
    } else {
      setData([]); // On failure, set empty array
    }
  } catch (error) {
    console.error("Error fetching filtered data:", error);
    setData([]); // On error, set empty array
  }
};
