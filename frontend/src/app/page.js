'use client'

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

const formatPrice = (price) => {
    return `Rp ${new Intl.NumberFormat('id-ID').format(price)}`;
};

const Home = () => {
    const [products, setProducts] = useState([]);
    const [formData, setFormData] = useState({
        brand: '',
        type: '',
        stock: '',
        price: '',
        additional_info: ''
    });
    const [searchBrand, setSearchBrand] = useState('');
    const [editProductId, setEditProductId] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:3001/api/products')
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, []);

    const handleSearch = () => {
        axios.get(`http://localhost:3001/api/products?brand=${searchBrand}`)
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                console.error('Error searching products:', error);
            });
    };

    const handleDelete = (productId) => {
        axios.delete(`http://localhost:3001/api/products/${productId}`)
            .then(() => {
                setProducts(products.filter(product => product.id !== productId));
            })
            .catch(error => {
                console.error('Error deleting product:', error);
            });
    };

    return (
      <div className="container mx-auto mt-10">
        <h1 className="text-3xl font-semibold mb-6">Products</h1>
            <div className="flex mb-4">
                <input
                    type="text"
                    placeholder="Search by brand"
                    value={searchBrand}
                    onChange={(e) => setSearchBrand(e.target.value)}
                    className="border border-gray-300 rounded-l px-4 py-2 focus:outline-none"
                />
                <button onClick={handleSearch} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-r focus:outline-none">Search</button>
            </div>
            <Link href="/create">
                <span className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded mb-4 inline-block focus:outline-none">Create Product</span>
            </Link>
            <table className="w-full border-collapse">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2">Product ID</th>
                        <th className="border border-gray-300 px-4 py-2">Product Brand</th>
                        <th className="border border-gray-300 px-4 py-2">Product Type</th>
                        <th className="border border-gray-300 px-4 py-2">Total Stock</th>
                        <th className="border border-gray-300 px-4 py-2">Price</th>
                        <th className="border border-gray-300 px-4 py-2">Additional Info</th>
                        <th className="border border-gray-300 px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id}>
                            <td className="border border-gray-300 px-4 py-2">{product.id}</td>
                            <td className="border border-gray-300 px-4 py-2">{product.brand}</td>
                            <td className="border border-gray-300 px-4 py-2">{product.type}</td>
                            <td className="border border-gray-300 px-4 py-2">{product.stock}</td>
                            <td className="border border-gray-300 px-4 py-2">{formatPrice(product.price)}</td>
                            <td className="border border-gray-300 px-4 py-2">{product.additional_info}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                <Link href={`/edit/${product.id}`}>
                                    <span className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded mr-2 focus:outline-none">Edit</span>
                                </Link>
                                <button onClick={() => handleDelete(product.id)} className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded focus:outline-none">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
  </div>
    );
};

export default Home;