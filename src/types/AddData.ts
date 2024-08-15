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