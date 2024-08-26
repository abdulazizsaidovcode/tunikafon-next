import { create } from 'zustand';

interface DashboardType {
  data: any;
  setData: (data: any) => void;
  page: number;
  setPage: (data: number) => void;
  size: number;
  setSize: (data: number) => void;
  employeeName: string | null;
  ORDER_STATUS: 'COMPLETED' | 'REJECTED' | 'WAIT' | null;
  address: string | null;
  date: string | null;
  setEmployeeName: (name: string | null) => void;
  setOrderStatus: (status: 'COMPLETED' | 'REJECTED' | 'WAIT' | null) => void;
  setAddress: (address: string | null) => void;
  setDate: (date: string | null) => void;
  resetFilters: () => void;
}

export const dashboardStore = create<DashboardType>((set) => ({
    data: [],
    setData: (data) => set({data: data}),
    page: 0,
    setPage: (data) => set({page: data}),
    size: 10,
    setSize: (data) => set({size: data}),
    employeeName: null,
    ORDER_STATUS: null,
    address: "",
    date: null,
    setEmployeeName: (name) => set({ employeeName: name }),
    setOrderStatus: (status) => set({ ORDER_STATUS: status }),
    setAddress: (address) => set({ address: address }),
    setDate: (date) => set({ date: date }),
    resetFilters: () => set({
        employeeName: null,
        ORDER_STATUS: null,
        address: "",
        date: null
    }),
}));