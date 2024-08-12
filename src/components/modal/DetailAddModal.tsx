import { useEffect, useState } from "react";
import usePost from "../../hooks/post";
import axios from "../../service/api";
import { toast } from "sonner";
import useGet from "../../hooks/get";

type DetailCategory = {
    id: number;
    name: string;
};

type AddData = {
    name: string;
    attachmentId: number;
    detailCategoryId: number;
    measureValue: number;
    measure: string;
    price: number;
    description: string;
    width: number;
    height: number;
    largeDiagonal: number;
    smallDiagonal: number;
    side: string | null; // Added 'side' field
};

export default function DetailAddModal() {
    const [addModal, setAddModal] = useState<boolean>(false);
    const addToggleModal = () => setAddModal(!addModal);
    const { get } = useGet()
    const [detailCategory, setDetailCategory] = useState<DetailCategory[]>([]);
    const [addData, setAddData] = useState<AddData>({
        name: '',
        attachmentId: 0,
        detailCategoryId: 0,
        measureValue: 0,
        measure: '',
        price: 0,
        description: '',
        width: 0,
        height: 0,
        largeDiagonal: 0,
        smallDiagonal: 0,
        side: null, // Initialize side as null
    });
    const [isLoading, setIsLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const { post, isLoading: postIsLoading } = usePost();
    useEffect(() => {
        
    })
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleClick = async () => {
        try {
            if (
                !file ||
                !addData.name ||
                !addData.detailCategoryId ||
                !addData.measureValue ||
                !addData.measure ||
                !addData.price ||
                !addData.description ||
                !addData.width ||
                !addData.height ||
                !addData.largeDiagonal ||
                !addData.smallDiagonal
            ) {
                throw new Error('All fields are required');
            }

            setIsLoading(true);

            const formData = new FormData();
            formData.append('file', file);

            const { data } = await axios.post(`/attachment/upload`, formData);

            await post('/detail', {
                ...addData,
                attachmentId: data.body,
                detailCategoryId: +addData.detailCategoryId,
                measureValue: +addData.measureValue,
                width: +addData.width,
                height: +addData.height,
                largeDiagonal: +addData.largeDiagonal,
                smallDiagonal: +addData.smallDiagonal,
            });

            toast.success('Successfully created');
            setIsLoading(false);
            // Reset the form
            setAddData({
                name: '',
                attachmentId: 0,
                detailCategoryId: 0,
                measureValue: 0,
                measure: '',
                price: 0,
                description: '',
                width: 0,
                height: 0,
                largeDiagonal: 0,
                smallDiagonal: 0,
                side: null, // Reset side to null
            });
        } catch (error) {
            toast.error('Error creating detail');
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div className="p-4">
                <h2 className="text-xl mb-4">Add Detail</h2>
                <label className="block mb-2">Name</label>
                <input
                    type="text"
                    name="name"
                    onChange={(e) => setAddData({ ...addData, name: e.target.value })}
                    value={addData.name}
                    className="w-full p-2 mb-4 border rounded"
                />
                <label className="block mb-2">Detail Category ID</label>
                <select
                    className="w-full rounded px-1 py-2 outline-none"
                    onChange={(e) => setAddData({ ...addData, detailCategoryId: parseInt(e.target.value) })}
                    value={addData.detailCategoryId}
                >
                    <option value={0}>Select Category</option>
                    {detailCategory.map((item) => (
                        <option key={item.id} value={item.id}>
                            {item.name}
                        </option>
                    ))}
                </select>
                <div className="flex gap-2">
                    <div className="w-full">
                        <label className="block mb-2">Measure Value</label>
                        <input
                            type="number"
                            name="measureValue"
                            onChange={(e) => setAddData({ ...addData, measureValue: parseFloat(e.target.value) })}
                            value={addData.measureValue}
                            className="w-full p-2 mb-4 border rounded"
                        />
                    </div>
                    <div className="w-full">
                        <label className="block mb-2">Measure</label>
                        <select
                            className="w-full rounded px-1 py-2"
                            onChange={(e) => setAddData({ ...addData, measure: e.target.value })}
                            value={addData.measure}
                        >
                            <option value="KG">Kg</option>
                            <option value="METER">Meter</option>
                            <option value="SM">Sm</option>
                            <option value="PIECE">Piece</option>
                        </select>
                    </div>
                </div>
                <label className="block mb-2">Width</label>
                <input
                    type="number"
                    name="width"
                    onChange={(e) => setAddData({ ...addData, width: parseFloat(e.target.value) })}
                    value={addData.width}
                    className="w-full p-2 mb-4 border rounded"
                />
                <label className="block mb-2">Height</label>
                <input
                    type="number"
                    name="height"
                    onChange={(e) => setAddData({ ...addData, height: parseFloat(e.target.value) })}
                    value={addData.height}
                    className="w-full p-2 mb-4 border rounded"
                />
                <label className="block mb-2">Large Diagonal</label>
                <input
                    type="number"
                    name="largeDiagonal"
                    onChange={(e) => setAddData({ ...addData, largeDiagonal: parseFloat(e.target.value) })}
                    value={addData.largeDiagonal}
                    className="w-full p-2 mb-4 border rounded"
                />
                <label className="block mb-2">Small Diagonal</label>
                <input
                    type="number"
                    name="smallDiagonal"
                    onChange={(e) => setAddData({ ...addData, smallDiagonal: parseFloat(e.target.value) })}
                    value={addData.smallDiagonal}
                    className="w-full p-2 mb-4 border rounded"
                />
                <label className="block mb-2">Side</label>
                <input
                    type="text"
                    name="side"
                    onChange={(e) => setAddData({ ...addData, side: e.target.value })}
                    value={addData.side ?? ""}
                    className="w-full p-2 mb-4 border rounded"
                />
                <label className="block mb-2">Price</label>
                <input
                    type="number"
                    name="price"
                    onChange={(e) => setAddData({ ...addData, price: parseFloat(e.target.value) })}
                    value={addData.price}
                    className="w-full p-2 mb-4 border rounded"
                />
                <label className="block mb-2">Description</label>
                <input
                    type="text"
                    name="description"
                    onChange={(e) => setAddData({ ...addData, description: e.target.value })}
                    value={addData.description}
                    className="w-full p-2 mb-4 border rounded"
                />
                <input
                    type="file"
                    onChange={handleImageChange}
                    className="w-full p-2 mb-4 border rounded"
                />
                <div className="flex justify-end">
                    <button
                        className="mr-4 px-4 py-2 bg-gray-500 text-white rounded"
                        onClick={addToggleModal}
                    >
                        Cancel
                    </button>
                    <button
                        disabled={isLoading}
                        onClick={handleClick}
                        className="rounded-lg px-3 py-2 bg-green-500 text-white"
                    >
                        {isLoading ? 'Loading...' : 'Save'}
                    </button>
                </div>
            </div>
        </div>
    );
}