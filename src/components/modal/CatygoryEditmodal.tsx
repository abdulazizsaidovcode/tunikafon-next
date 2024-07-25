import axios from '../../service/api';
import React, { useState } from 'react';
import { attechment } from '../../service/urls';
import Input from '../inputs/input';
import usePut from '../../hooks/put';
import GlobalModal from '.';
import { toast } from 'sonner';

interface Item {
  id: number;
  attachmentId: string | number;
  name: string;
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
  const [name, setName] = useState<string>(item.name);
  const [attachmentId, setAttachmentId] = useState<string | number>(
    item.attachmentId,
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { data, isLoading, error, put } = usePut();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!name || !attachmentId) {
      toast.error('Name and Attachment ID are required');
      return;
    }

    try {
      let newAttachmentId = attachmentId;
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        const response = await axios.put(
          `/attachment/${attachmentId}`,
          formData,
        );
        newAttachmentId = response.data.body;
      }

      const updatedItem = {
        name,
        attachmentId: newAttachmentId,
      };
      await put('/category', item.id, updatedItem);
      toast.success('Category successfully edited');
      getting();
      onClose();
    } catch (error) {
      toast.error('Error updating category');
      console.error('Error updating category:', error);
    }
  };

  return (
    isModal && (
      <GlobalModal
        isOpen={isModal}
        onClose={onClose}
        children={
          <div className="p-4">
            <h2 className="text-xl mb-4">Edit Category</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
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
                key={attachmentId} // Add key to force re-render
                src={`${attechment}${attachmentId}`}
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
                disabled={isLoading}
                onClick={handleSave}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                {isLoading ? 'Loading...' : 'Save'}
              </button>
            </div>
          </div>
        }
      />
    )
  );
};

export default EditModal;
