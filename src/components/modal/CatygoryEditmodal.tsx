import axios from '../../service/api';
import React, { useState } from 'react';
// import axios from '../service/api';
// // import { attechment } from '../service/urls';
// import { FaRegEdit, FaRegFolderOpen } from 'react-icons/fa';
// import { RiDeleteBinLine } from 'react-icons/ri';
import { attechment } from '../../service/urls';
import Input from '../inputs/input';

interface Item {
  id: number;
  attachmentId: string | number;
  name: string;
}

interface EditModalProps {
  isModal: boolean;
  onClose: () => void;
  item: Item;
  value: string;
  getting: () => void;
  onChange: (val: string) => void;
}

const EditModal: React.FC<EditModalProps> = ({ isModal, onClose, item, getting }) => {
  const [name, setName] = useState<string>(item.name);
  const [attachmentId, setAttachmentId] = useState<string | number>(
    item.attachmentId,
  );
  
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    try {
      let newAttachmentId = attachmentId;
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const { data } = await axios.post('/attachment/upload', formData);
        newAttachmentId = data.body;
      }
      const updatedItem = {
        name,
        attachmentId: newAttachmentId,
      };

      await axios.put(`/category/${item.id}`, updatedItem);
      onClose();
      getting();
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  return (
    isModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-5 rounded-lg shadow-lg w-1/2">
          <h2 className="text-xl mb-4">Edit Category</h2>
          <label className="block mb-2">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
          />
          <Input label="Image" onChange={handleImageChange} type="file" />
          {attachmentId && (
            <img
              src={attechment + attachmentId}
              alt="Current"
              className="w-20 h-20 mb-4"
            />
          )}
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="mr-4 px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default EditModal;
