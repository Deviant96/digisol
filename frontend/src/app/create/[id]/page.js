'use client'

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Create = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        brand: '',
        type: '',
        stock: '',
        price: '',
        additional_info: ''
    });

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCreate = () => {
        axios.post('http://localhost:3001/api/products', formData)
            .then(() => {
                router.push('/');
            })
            .catch(error => {
                console.error('Error creating product:', error);
            });
    };

    return (
        <div className="container mx-auto mt-10">
            <h1 className="text-3xl font-semibold mb-6">Create Product</h1>
            <input
                type="text"
                name="brand"
                placeholder="Brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-4 py-2 mb-4 block w-full focus:outline-none"
            />
            <input
                type="text"
                name="type"
                placeholder="Type"
                value={formData.type}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-4 py-2 mb-4 block w-full focus:outline-none"
            />
            <input
                type="number"
                name="stock"
                placeholder="Stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-4 py-2 mb-4 block w-full focus:outline-none"
            />
            <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-4 py-2 mb-4 block w-full focus:outline-none"
            />
            <input
                type="text"
                name="additional_info"
                placeholder="Additional Info"
                value={formData.additional_info}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-4 py-2 mb-4 block w-full focus:outline-none"
            />
            <button onClick={handleCreate} className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded mr-2 focus:outline-none">Create</button>
        </div>
    );
};

export default Create;
