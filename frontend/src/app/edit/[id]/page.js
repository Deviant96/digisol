'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const Edit = ({ params }) => {
    const router = useRouter();
    const id = params.id;
    const [formData, setFormData] = useState({
        brand: '',
        type: '',
        stock: '',
        price: '',
        additional_info: ''
    });

    useEffect(() => {
        console.log(id)
        if (id) {
            axios.get(`http://localhost:3001/api/products/1`)
                .then(response => {
                    setFormData(response.data);
                })
                .catch(error => {
                    console.error('Error fetching product:', error);
                });
        }
    }, [id]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = () => {
        axios.put(`http://localhost:3001/api/products/${id}`, formData)
            .then(() => {
                router.push('/');
            })
            .catch(error => {
                console.error('Error updating product:', error);
            });
    };

    return (
        <div className="container mx-auto mt-10">
            <h1 className="text-3xl font-semibold mb-6">Edit Product</h1>
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
            <button onClick={handleUpdate} className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded mr-2 focus:outline-none">Update</button>
        </div>
    );
};

export default Edit;
