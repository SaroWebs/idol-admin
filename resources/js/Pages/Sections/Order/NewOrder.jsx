import BreadcrumbsComponent from '@/Components/BreadcrumbComponent';
import MasterLayout from '@/Layouts/MasterLayout';
import { Head } from '@inertiajs/react';
import { Button, Loader, Select, TextInput, NumberInput } from '@mantine/core';
import { XIcon } from 'lucide-react';
import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const PAYMENT_MODES = [
    { value: 'cash', label: 'Cash' },
    { value: 'card', label: 'Card' },
    { value: 'online', label: 'Online' },
];

const NewOrder = (props) => {
    const { customers } = props;
    const [prescriptions, setPrescriptions] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [loading, setLoading] = useState(false);
    const [totalCost, setTotalCost] = useState(0);

    const [formInfo, setFormInfo] = useState({
        order_no: '',
        customer_id: '',
        customer_address_id: '',
        payment_mode: 'cash',
        payment_amount: 0,
        payment_status: 'pending',
        products: [],
    });

    const getPrescs = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/data/prescriptions/unassigned`);
            setPrescriptions(res.data);
        } catch (err) {
            alert('Error fetching prescriptions. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPrescription = (item) => {
        setOpen(false);
        setSelectedPrescription(item.prescriptions);
    };

    const handleProductSelect = useCallback((product) => {
        setFormInfo((prevState) => {
            const existingProductIndex = prevState.products.findIndex(p => p.product_id === product.id);
            const updatedProducts = [...prevState.products];

            if (existingProductIndex !== -1) {
                updatedProducts[existingProductIndex].quantity += 1;
            } else {
                updatedProducts.push({ product_id: product.id, name: product.name, quantity: 1, price: parseFloat(product.price) });
            }

            return {
                ...prevState,
                products: updatedProducts,
            };
        });
        calculateTotalCost();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormInfo(prevState => ({
            ...prevState,
            [name]: name === "payment_amount" ? parseFloat(value) : value,
        }));
    };

    const handleProductChange = (index, key, value) => {
        setFormInfo(prevState => {
            const updatedProducts = [...prevState.products];
            updatedProducts[index][key] = key === 'quantity' ? parseInt(value) : parseFloat(value);

            return {
                ...prevState,
                products: updatedProducts,
            };
        });
        calculateTotalCost();
    };

    const calculateTotalCost = () => {
        const total = formInfo.products.reduce((sum, product) => sum + product.price * product.quantity, 0);
        setTotalCost(total);
        setFormInfo(prevState => ({ ...prevState, payment_amount: total }));
    };

    const removeProduct = (index) => {
        setFormInfo(prevState => ({
            ...prevState,
            products: prevState.products.filter((_, i) => i !== index),
        }));
        calculateTotalCost();
    };

    const generateOrderNo = () => {
        const prefix = 'ORD';
        const timestamp = Date.now().toString();
        return `${prefix}${timestamp}`;
    };

    useEffect(() => {
        getPrescs();
        setFormInfo(prevState => ({
            ...prevState,
            order_no: generateOrderNo(),
        }));
    }, []);

    useEffect(() => {
        if (selectedPrescription) {
            setFormInfo(prevState => ({
                ...prevState,
                customer_id: selectedPrescription.customer.id,
                customer_address_id: selectedPrescription.customer.addresses.find(addr => addr.active === '').id,
            }));
        }
    }, [selectedPrescription]);

    return (
        <MasterLayout {...props}>
            <Head title="Create Order" />
            <div className="p-6">
                <BreadcrumbsComponent
                    items={[
                        { title: 'Home', href: '/' },
                        { title: 'Orders', href: '/orders' },
                        { title: 'New Order', href: '#' },
                    ]}
                />
                <div className="mt-8">
                    <h1 className="text-3xl font-bold">Create Orders</h1>
                    <hr className="my-6" />
                    <div className="flex justify-end gap-2">
                        <Button onClick={() => setOpen(!open)}>
                            {open ? 'Close' : 'Prescriptions'}
                        </Button>
                    </div>
                    <div className="container my-4">
                        <div className={`grid ${open || selectedPrescription ? 'grid-cols-2 gap-2' : ''}`}>
                            <div className="order-form p-4 bg-gray-100 rounded shadow-md">
                                <TextInput
                                    label="Order No"
                                    name="order_no"
                                    value={formInfo.order_no}
                                    onChange={handleInputChange}
                                    placeholder="Enter Order No"
                                    required
                                />
                                <Select
                                    label="Customer"
                                    name="customer_id"
                                    value={formInfo.customer_id}
                                    onChange={(value) => setFormInfo({ ...formInfo, customer_id: value })}
                                    data={customers.map((cstmr) => ({
                                        value: cstmr.id,
                                        label: cstmr.name,
                                    }))}
                                    placeholder="Select Customer"
                                    required
                                />
                                <Select
                                    label="Customer Address"
                                    name="customer_address_id"
                                    value={formInfo.customer_address_id}
                                    onChange={(value) => setFormInfo({ ...formInfo, customer_address_id: value })}
                                    data={
                                        customers.find(c => c.id === formInfo.customer_id)?.addresses.map(addr => ({
                                            value: addr.id,
                                            label: addr.street,
                                        })) || []
                                    }
                                    placeholder="Select Customer Address"
                                />
                                <Select
                                    label="Payment Mode"
                                    name="payment_mode"
                                    value={formInfo.payment_mode}
                                    onChange={(value) => setFormInfo({ ...formInfo, payment_mode: value })}
                                    data={PAYMENT_MODES}
                                />
                                <NumberInput
                                    label="Payment Amount"
                                    name="payment_amount"
                                    value={formInfo.payment_amount}
                                    readOnly
                                    min={0}
                                    required
                                />
                                <SearchInputComponent handleProductSelect={handleProductSelect} />
                                <table className="mt-4 w-full border border-gray-300">
                                    <thead>
                                        <tr className="bg-gray-100 text-left">
                                            <th className="px-4 py-2 border-b border-gray-300">Product</th>
                                            <th className="px-4 py-2 border-b border-gray-300">Quantity</th>
                                            <th className="px-4 py-2 border-b border-gray-300">Price</th>
                                            <th className="px-4 py-2 border-b border-gray-300">Total</th>
                                            <th className="px-4 py-2 border-b border-gray-300">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formInfo.products.map((product, index) => (
                                            <tr key={index} className="text-sm text-gray-700">
                                                <td className="px-4 py-2 border-b border-gray-300">{product.name}</td>
                                                <td className="px-4 py-2 border-b border-gray-300">
                                                    <input
                                                        type="number"
                                                        value={product.quantity}
                                                        onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                                                        min={1}
                                                        className="w-16 p-1 border border-gray-300 rounded text-center"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 border-b border-gray-300">
                                                    <input
                                                        value={product.price}
                                                        readOnly
                                                        min={0}
                                                        className="w-20 p-1 border border-gray-300 rounded text-center"
                                                    />
                                                </td>
                                                <td className="px-4 py-2 border-b border-gray-300">
                                                    {product.price * product.quantity}
                                                </td>
                                                <td className="px-4 py -2 border-b border-gray-300 text-center">
                                                    <Button
                                                        variant="outline"
                                                        color="red"
                                                        onClick={() => removeProduct(index)}
                                                        className="p-1 border-none"
                                                    >
                                                        <XIcon className="w-5 h-5 text-red-500" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="flex justify-end mt-4">
                                    <p className="text-xl font-semibold">Total: {totalCost}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MasterLayout>
    );
};

export default NewOrder;
