export type AddData = {
    name: string;
    attachmentId: number;
    detailCategoryId: number | string;
    measure: string | number;
    price: number | string;
    description: string;
    width: number | string;
    height: number | string;
    largeDiagonal: number | string;
    smallDiagonal: number | string;
    side: string | null;
    detailTypeStatus: string;
  };
 export interface DetailAddModalProps {
    onClose: () => void;
  }
export interface Item {
    name: string;
    attachmentId: number;
    detailCategoryId: number;
    measure: string;
    price: number;
    description: string;
    width: number;
    height: number;
    largeDiagonal: number;
    smallDiagonal: number;
    detailWidth: number | null | string;
    detailTypeStatus: string;
  }