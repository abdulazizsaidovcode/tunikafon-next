import axios from '../../service/api';
import React, { useState, useEffect } from 'react';
import Input from '../inputs/input';
import usePut from '../../hooks/put';
import { toast } from 'sonner';
import GlobalModal from '.';

interface Item {
  id: number;
  attachmentId: string | number;
  name: string;
  detailCategoryId: number;
  measureValue?: number;
  measure: string;
  price: number;
  description: string;
}

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
  const [formData, setFormData] = useState<Item>({ ...item });
  const [imageFile, setImageFile] = useState<File | null>(null);

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
    if (!formData.name || !formData.attachmentId) {
      toast.error('Name and Attachment ID are required');
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
      console.error('Error updating Detail:', error);
    }
  };

  return (
    isModal && (
      <GlobalModal isOpen={isModal} onClose={onClose}>
        <div className="p-4">
          <h2 className="text-xl mb-4">Edit Category</h2>
          {/* {error && (
            <p className="text-red-500 mb-4">{error.message || error}</p>
          )} */}
          <label className="block mb-2">Name</label>
          <input
            type="text"
            name="name"
            value={(formData && formData.name) || ''}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded"
          />
          <label className="block mb-2">Detail Category ID</label>
          <input
            type="number"
            name="detailCategoryId"
            value={(formData && formData.detailCategoryId) || ''}
            onChange={handleChange}
            className="w-full p-2 mb-4 border rounded"
          />
          <div className="flex w-full gap-2 justify-between">
            <div className="w-full">
              <label className="block mb-2">Measure Value</label>
              <input
                type="number"
                name="measureValue"
                value={(formData && formData.measureValue) || ''}
                onChange={handleChange}
                className="w-full p-2 mb-4 border rounded"
              />
            </div>
            <div className="w-full">
              <label className="block mb-2">Measure</label>
              <select
                name="measure"
                value={(formData && formData.measure) || ''}
                onChange={handleChange}
                className="w-full p-2 mb-4 border rounded"
              >
                <option value="KG">KG</option>
                <option value="METER">METER</option>
                <option value="SM">SM</option>
                <option value="PIECE">PIECE</option>
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
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="mr-4 px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
            <button
              disabled={isLoading}
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {isLoading ? 'Loading...' : 'Save'}
            </button>
          </div>
        </div>
      </GlobalModal>
    )
  );
};

export default EditModal;
