import axios from '../../service/api';
import React, { useState, useEffect } from 'react';
import Input from '../inputs/input';
import usePut from '../../hooks/put';
import { toast } from 'sonner';
import GlobalModal from '.';
import { Button } from '@material-tailwind/react';

interface Item {
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
  side: number | null | string;
  detailTypeStatus: string;
}

interface EditModalProps {
  isModal: boolean;
  onClose: () => void;
  item: Item;
  getting: () => void;
}
const detailTypeStatus = [
  { value: 'HOVUZ_ROMB', name: 'Hovuz Romb' },
  { value: 'HOVUZ_LAMPA', name: 'Hovuz Lampa' },
  { value: 'HOVUZ_LENTA', name: 'Hovuz Lenta' },
  { value: 'HOVUZ_YULDUZCHA', name: 'Hovuz Yulduzcha' },
  { value: 'LAMPA', name: 'Lampa' },
  { value: 'HOVUZ_YONI_KAPALAK', name: 'Hovuz Yoni Kapalak' },
  { value: 'HOVUZ_YONI', name: 'Hovuz Yoni' },
  { value: 'HOVUZ_YONI_TUNIKA', name: 'Hovuz Yoni Tunika' },
  { value: 'HOVUZ_YONI_TUNIKA_BEZAK', name: 'Hovuz Yoni Tunika Bezak' },
  { value: 'HOVUZ_YONI_TUNIKA_DETAIL', name: 'Hovuz Yoni Tunika Detail' },
];
const EditModal: React.FC<EditModalProps> = ({
  isModal,
  onClose,
  item,
  getting,
}) => {
  const { isLoading, put } = usePut();
  const [formData, setFormData] = useState<Item>({
    name: '',
    attachmentId: 0,
    detailCategoryId: 0,
    measure: '',
    price: 0,
    description: '',
    width: 0,
    height: 0,
    largeDiagonal: 0,
    smallDiagonal: 0,
    side: 0 || null,
    detailTypeStatus: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [detailCategory, setDetailCategory] = useState<any[]>();
  useEffect(() => {
    async function getDetailCategory() {
      const { data } = await axios.get('/detail-category/list');
      setDetailCategory(data.body.object);
    }
    getDetailCategory();
  }, []);
  useEffect(() => {
    setFormData(item);
  }, [item]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!formData.name) {
      toast.error('Name is required');
      return;
    }
    else if (!formData.attachmentId) {
      toast.error(' Attachment ID is required');
      return;
    }
     else if (!formData.price) {
      toast.error('Price is required');
      return;
    }
    else if (!formData.price) {
      toast.error('Price is required');
      return;
    }

    try {
      let newAttachmentId = formData.attachmentId;
      if (imageFile) {
        const imageData = new FormData();
        imageData.append('file', imageFile);

        if (!imageData.has('file')) throw new Error();

        const response = await axios.put(
          `/attachment/${formData.attachmentId}`,
          imageData,
        );
        newAttachmentId = response.data;
        console.log(response);
      }

      await put(`/detail`, item.id, {
        ...formData,
        attachmentId: newAttachmentId ? newAttachmentId : formData.attachmentId,
      });

      toast.success('Detail successfully edited');
      getting();
      onClose();
    } catch (error) {
      toast.error('Error updating Detail');
      // console.error('Error updating Detail:', error);
    }
  }; 

  return (
    isModal && (
      <GlobalModal isOpen={isModal} onClose={onClose}>
        <div className="p-4">
          <h2 className="text-xl mb-4">Edit Category</h2>
          <label className="block mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={(formData && formData.name) || ''}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded"
          />

          <label className="block mb-2">Status</label>
          <select
            name="detailTypeStatus"
            className="w-full rounded mb-3 px-1 py-2 outline-none"
            onChange={handleChange}
          >
            <option  selected>Select Status</option>
            {detailTypeStatus &&
              detailTypeStatus.map((item) => (
                <option value={item.value}>{item.name}</option>
              ))}
          </select>

          <label className="block mb-2">Detail Category ID</label>
          <select
            name="detailCategoryId"
            className="w-full rounded px-1 mb-3 py-2 outline-none"
            onChange={handleChange}
          >
            <option selected disabled>Select Category</option>
            {detailCategory &&
              detailCategory.map((item) => (
                <option value={item.id}>{item.name}</option>
              ))}
          </select>
          <div className="flex w-full gap-2 justify-between">
            {/* <div className="w-full">
              <label className="block mb-2">Measure Value</label>
              <input
                type="number"
                name="measureValue"
                value={(formData && formData.measureValue) || ''}
                onChange={handleChange}
                className="w-full p-2 mb-4 border rounded"
              />
            </div> */}
            <div className="w-full">
              <label className="block mb-2">Measure</label>
              <select
                name="measure"
                value={(formData && formData.measure) || ''}
                onChange={handleChange}
                className="w-full p-2 mb-4 border rounded"
              >
                <option value="METER">METER</option>
                <option value="SM">SM</option>
                <option value="DONA" selected>DONA</option>
              </select>
            </div>
          </div>
          <label className="block mb-2">Price</label>
          <input
            type="number"
            name="price"
            value={(formData && formData.price) || ''}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded"
          />

          <label className="block mb-2">width</label>
          <input
            type="number"
            name="width"
            value={(formData && formData.width) || ''}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded"
          />

          <label className="block mb-2">height</label>
          <input
            type="number"
            name="height"
            value={(formData && formData.height) || ''}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded"
          />
          <label className="block mb-2">Large Diagonal</label>
          <input
            type="number"
            name="largeDiagonal"
            value={(formData && formData.largeDiagonal) || ''}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded"
          />
          <label className="block mb-2">Small Diagonal</label>
          <input
            type="number"
            name="smallDiagonal"
            value={(formData && formData.smallDiagonal) || ''}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded"
          />
          <label className="block mb-2">Description</label>
          <input
            type="text"
            name="description"
            value={(formData && formData.description) || ''}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded"
          />
          <Input label="Image" onChange={handleImageChange} type="file" />
          {/* {formData.attachmentId && (
            <img
              key={formData.attachmentId}
              src={`${attechment}${formData.attachmentId}`}
              alt="Current"
              className="w-20 h-20 mb-4"
            />
          )} */}
          <div className="flex justify-end gap-5">
            <Button onClick={onClose} color="red">
              Cancel
            </Button>
            <Button disabled={isLoading} onClick={handleSave} color="green">
              {isLoading ? 'Loading...' : 'Save'}
            </Button>
          </div>
        </div>
      </GlobalModal>
    )
  );
};

export default EditModal;
