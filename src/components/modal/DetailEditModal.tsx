import axios from '../../service/api';
import React, { useState, useEffect } from 'react';
import Input from '../inputs/input';
import usePut from '../../hooks/put';
import { toast } from 'sonner';
import GlobalModal from '.';
import { Button } from '@material-tailwind/react';
import { detailTypeStatus } from '../StatusDetail';
import { Item } from '../../types/AddData';

interface EditModalProps {
  isModal: boolean;
  onClose: () => void;
  item: Item;
  getting: () => void;
}

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
    detailWidth: 0 || null,
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
    } else if (!formData.attachmentId) {
      toast.error(' Attachment ID is required');
      return;
    } else if (!formData.price) {
      toast.error('Price is required');
      return;
    } else if (!formData.price) {
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

      toast.success('Detal muofaqiyatli tahrirlandi');
      getting();
      onClose();
    } catch (error) {
      // toast.error('Error updating Detail');
      //  console.error('Error updating Detail:', error);
    }
  };

  return (
    isModal && (
      <GlobalModal isOpen={isModal} onClose={onClose}>
        <div className="p-4">
          <h2 className="text-xl lg:w-[600px] mb-4">Detalni Tahrirlash</h2>
          <label className="block mb-2">Nomi</label>
          <input
            type="text"
            name="name"
            value={(formData && formData.name) || ''}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded"
          />

          <label className="block mb-2">Turi</label>
          <select
            name="detailTypeStatus"
            className="w-full rounded  mb-3 px-1 py-2 outline-none"
            onChange={handleChange}
          >
            <option selected>Turini tanlash</option>
            {detailTypeStatus &&
              detailTypeStatus.map((item) => (
                <option value={item.value}>{item.name}</option>
              ))}
          </select>

          <label className="block mb-2">Detal bo'limzlari</label>
          <select
            name="detailCategoryId"
            className="w-full rounded bg-transparent px-1 mb-3 py-2 outline-none"
            onChange={handleChange}
          >
            <option selected disabled className="">
              Detal bo'limini tanlash{' '}
            </option>
            {detailCategory &&
              detailCategory.map((item) => (
                <option value={item.id}>{item.name}</option>
              ))}
          </select>
          <div className="flex w-full gap-2 justify-between">
            <div className="w-full">
              <label className="block mb-2">Ulchov</label>
              <select
                name="measure"
                value={(formData && formData.measure) || ''}
                onChange={handleChange}
                className="w-full  p-2 mb-4 border rounded"
              >
                <option value="METER">METER</option>
                <option value="SM">SM</option>
                <option value="DONA" selected>
                  DONA
                </option>
              </select>
            </div>
          </div>
          <label className="block mb-2">Narxi</label>
          <input
            type="number"
            name="price"
            value={(formData && formData.price) || ''}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded"
          />

          <label className="block mb-2">Eni</label>
          <input
            type="number"
            name="width"
            value={(formData && formData.width) || ''}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded"
          />

          <label className="block mb-2">Buyi</label>
          <input
            type="number"
            name="height"
            value={(formData && formData.height) || ''}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded"
          />
          <label className="block mb-2">Detal Eni</label>
          <input
            type="number"
            name="detailWidth"
            value={(formData && formData.detailWidth) || ''}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded"
          />
          <label className="block mb-2">Katta Diagonal</label>
          <input
            type="number"
            name="largeDiagonal"
            value={(formData && formData.largeDiagonal) || ''}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded"
          />
          <label className="block mb-2">Kichik Diagonal</label>
          <input
            type="number"
            name="smallDiagonal"
            value={(formData && formData.smallDiagonal) || ''}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded"
          />
          <label className="block mb-2">Tavsif</label>
          <input
            type="text"
            name="description"
            value={(formData && formData.description) || ''}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded"
          />
          <Input label="Rasm" onChange={handleImageChange} type="file" />
          <div className="flex justify-end gap-5">
            <Button onClick={onClose} color="red">
              Chiqish
            </Button>
            <Button disabled={isLoading} onClick={handleSave} color="green">
              {isLoading ? 'Loading...' : "O'zgartirish  "}
            </Button>
          </div>
        </div>
      </GlobalModal>
    )
  );
};

export default EditModal;
