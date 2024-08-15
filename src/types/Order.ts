export interface OrderDetail {
    detailId: number;
    detailName: string;
    detailAttachmentId: number;
    amount: number;
    residual: string | null;
}

export interface Order {
    id: string;
    employeeName: string;
    productName: string | number;
    orderDetails: string | null;
    orderDetailsRes: OrderDetail[];
    width: number;
    tall: number;
    price: number | null;
    date: string | null;
    orderStatus: string | null;
    address: string | null;
}