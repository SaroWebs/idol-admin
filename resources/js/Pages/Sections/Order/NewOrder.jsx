import BreadcrumbsComponent from '@/Components/BreadcrumbComponent';
import MasterLayout from '@/Layouts/MasterLayout';
import { Head } from '@inertiajs/react';
import { Button, Loader, Select, TextInput, NumberInput } from '@mantine/core';
import { XIcon } from 'lucide-react';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import axios from 'axios';

const PAYMENT_MODES = [
    { value: 'cash', label: 'Cash' },
    { value: 'online', label: 'Online' },
];

const NewOrder = (props) => {
    const { customers, pins, charge_limit = 2000, per_km = 10 } = props;
    const [prescriptions, setPrescriptions] = useState([]);
    const [customerAddresses, setCustomerAddresses] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formInfo, setFormInfo] = useState({
        order_no: '',
        prescription_id: '',
        customer_id: '',
        customer_address_id: '',
        customer_address: '',
        transaction_id: '',
        payment_mode: 'cash',
        payment_amount: 0,
        payment_status: 'pending',
        products: [],
    });

    const totalCost = useMemo(() => {
        return formInfo.products.reduce((sum, product) => sum + Number((Number(product.price) + parseInt(product.tax)) * product.quantity), 0).toFixed(2);
    }, [formInfo.products]);


    const deliveryCharge = useMemo(() => {
        if (customerAddresses && formInfo.customer_address_id) {
            const delivery_address = customerAddresses.find(ca => ca.id == formInfo.customer_address_id);
            const pin = pins.find(p => p.pin == delivery_address.pin);
            if (totalCost < Number(charge_limit)) {
                const deliv_amount = Number(pin.distance) * Number(per_km);
                return deliv_amount;
            }
        }
        return 0;
    }, [formInfo.customer_address_id, totalCost]);


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
        const customer = item.prescriptions[0].customer;
        const activeAddress = customer.addresses?.find(addr => addr.active === 1);
        setSelectedPrescription(item.prescriptions);
        setCustomerAddresses(customer.addresses);
        setFormInfo(prevState => ({
            ...prevState,
            prescription_id: item.prescriptions[0].id,
            customer_id: String(customer.id),
            customer_address_id: activeAddress ? String(activeAddress.id) : '',
        }));

    };

    const handleProductSelect = useCallback((product) => {
        setFormInfo(prevState => {
            const existingProductIndex = prevState.products.findIndex(p => p.product_id === product.id);
            const updatedProducts = [...prevState.products];

            const tax = product.tax ? parseFloat(((Number(product.tax.tax_rate) / 100) * product.offer_price).toFixed(2)) : 0;
            const payable_amount = parseFloat((Number(product.offer_price) + tax).toFixed(2));

            if (existingProductIndex !== -1) {
                updatedProducts[existingProductIndex].quantity += 1;
            } else {
                updatedProducts.push({ product_id: product.id, name: product.name, quantity: 1, tax: Number(tax).toFixed(2), price: parseFloat(product.offer_price).toFixed(2) });
            }
            return {
                ...prevState,
                products: updatedProducts,
                payment_amount: parseFloat((Number(totalCost) + payable_amount + Number(deliveryCharge)).toFixed(2)),
            };
        });
    }, [totalCost]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormInfo(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleProductChange = (index, key, value) => {
        setFormInfo(prevState => {
            const updatedProducts = [...prevState.products];
            updatedProducts[index][key] = value;

            return {
                ...prevState,
                products: updatedProducts,
                payment_amount: parseFloat(totalCost + deliveryCharge).toFixed(2), // Update payment amount directly
            };
        });
    };

    const removeProduct = (index) => {
        setFormInfo(prevState => ({
            ...prevState,
            products: prevState.products.filter((_, i) => i !== index),
        }));
    };

    const generateOrderNo = () => {
        const prefix = 'ORD';
        const timestamp = Date.now().toString();
        return `${prefix}${timestamp}`;
    };

    const handleSelectCustomer = (value) => {
        const customer = customers.find(item => item.id == Number(value));
        const activeAddress = customer.addresses?.find(addr => addr.active == 1);
        setCustomerAddresses(customer.addresses);
        setFormInfo({ ...formInfo, customer_id: value, customer_address_id: activeAddress?.id })
    }

    useEffect(() => {
        getPrescs();
        setFormInfo(prevState => ({
            ...prevState,
            order_no: generateOrderNo(),
        }));
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formInfo.customer_id || !formInfo.customer_address_id || formInfo.products.length === 0) {
            alert('Please fill in all required fields and add at least one product.');
            return;
        }
        console.log('Form Data:', { ...formInfo, payment_amount: Number(totalCost) + Number(deliveryCharge) });
        axios.post(`/order/create`, formInfo)
            .then(res => {
                console.log(res.data);
                window.location.href = '/orders';
            })
            .catch(err => {
                console.log(err.message);
            });
    };

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
                    <form onSubmit={handleSubmit}>
                        <div className="flex justify-end gap-2">
                            <Button onClick={() => setOpen(!open)}>
                                {open ? 'Close' : 'Prescriptions'}
                            </Button>
                        </div>
                        <div className="container my-4">
                            <div className={`grid ${open || selectedPrescription ? 'grid-cols-2 gap-2' : ''}`}>
                                <div className="order-form p-4 bg-gray-100 rounded shadow-md">
                                    <div className="grid grid-cols-12 gap-2">
                                        <TextInput
                                            label="Order No"
                                            name="order_no"
                                            value={formInfo.order_no}
                                            onChange={handleInputChange}
                                            placeholder="Enter Order No"
                                            required
                                            className='col-span-12 md:col-span-6'
                                        />
                                        {customers.length > 0 ? (
                                            <Select
                                                label="Customer"
                                                name="customer_id"
                                                value={formInfo.customer_id || null}
                                                onChange={(value) => handleSelectCustomer(value)}
                                                data={customers.map(cstmr => ({
                                                    value: String(cstmr.id),
                                                    label: cstmr.name || 'no name',
                                                }))}
                                                required
                                                className="col-span-12 md:col-span-6"
                                            />
                                        ) : (
                                            <p>No customers available</p>
                                        )}

                                        <div className='col-span-12'>
                                            {customerAddresses.length > 0 ? (
                                                <Select
                                                    label="Customer Address"
                                                    name="customer_address_id"
                                                    value={formInfo.customer_address_id || null} // Ensure valid value
                                                    onChange={(value) => setFormInfo({ ...formInfo, customer_address_id: value })}
                                                    data={customerAddresses.map(addr => ({
                                                        value: String(addr.id),
                                                        label: `${addr.address_line_1}, ${addr.address_line_2}, ${addr.city}, ${addr.pin}` || 'no address',
                                                    }))}
                                                    required
                                                    className="col-span-12"
                                                />
                                            ) : (
                                                <p>No delivery addresses available</p>
                                            )}

                                        </div>
                                        <Select
                                            label="Payment Mode"
                                            name="payment_mode"
                                            value={formInfo.payment_mode}
                                            onChange={(value) => setFormInfo({ ...formInfo, payment_mode: value })}
                                            data={PAYMENT_MODES}
                                            className='col-span-12 md:col-span-6'
                                        />
                                        <NumberInput
                                            label="Payment Amount"
                                            name="payment_amount"
                                            value={parseFloat(totalCost) + parseFloat(deliveryCharge)}
                                            readOnly
                                            min={0}
                                            required
                                            className='col-span-12 md:col-span-6'
                                        />
                                    </div>

                                    <SearchInputComponent handleProductSelect={handleProductSelect} />
                                    <table className="mt-4 w-full border border-gray-300">
                                        <thead>
                                            <tr className="bg-gray-100 text-left">
                                                <th className="px-4 py-2 text-xs border-b border-gray-300">Product</th>
                                                <th className="px-4 py-2 text-xs border-b border-gray-300">Quantity</th>
                                                <th className="px-4 py-2 text-xs border-b border-gray-300">Price</th>
                                                <th className="px-4 py-2 text-xs border-b border-gray-300">Tax</th>
                                                <th className="px-4 py-2 text-xs border-b border-gray-300">Total</th>
                                                <th className="px-4 py-2 text-xs border-b border-gray-300">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {formInfo.products.map((product, index) => (
                                                <tr key={index} className="text-sm text-gray-700">
                                                    <td className="px-4 py-2 text-xs border-b border-gray-300">{product.name}</td>
                                                    <td className="px-4 py-2 text-xs border-b border-gray-300">
                                                        <input
                                                            type="number"
                                                            value={product.quantity}
                                                            onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                                                            min={1}
                                                            className="w-16 p-1 text-xs border border-gray-300 rounded text-center"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 text-xs border-b border-gray-300">
                                                        <input
                                                            value={product.price}
                                                            readOnly
                                                            min={0}
                                                            className="w-20 p-1 text-xs border border-gray-300 rounded text-center"
                                                        />
                                                    </td>
                                                    <td className="px-4 py-2 text-xs border-b border-gray-300">
                                                        {Number(product.tax * product.quantity).toFixed(2)}
                                                    </td>
                                                    <td className="px-4 py-2 text-xs border-b border-gray-300">
                                                        {(Number(product.price) + parseInt(product.tax)) * product.quantity}
                                                    </td>
                                                    <td className="px-4 py-2 border-b border-gray-300 text-center">
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
                                    <div className="mt-4 font-semibold">
                                        <h3>Total Cost: ₹{totalCost}</h3>
                                        <h4>Delivery Charge: ₹{deliveryCharge}</h4>
                                    </div>
                                </ div>
                                {open && (
                                    <div className="p-6 shadow-md rounded-md">
                                        {loading ? (
                                            <Loader />
                                        ) : prescriptions.length ? (
                                            <div className="flex flex-wrap gap-2">
                                                {prescriptions.map(item => (
                                                    <div
                                                        key={item.group_code}
                                                        onClick={() => handleSelectPrescription(item)}
                                                        className="w-[100px] h-[180px] cursor-pointer"
                                                    >
                                                        <img
                                                            src={'/storage/' + item.prescriptions[0].file_path}
                                                            alt="Prescription preview"
                                                            className="rounded shadow-md"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-center text-gray-500">No Prescriptions Available</p>
                                        )}
                                    </div>
                                )}

                                {!open && selectedPrescription && (
                                    <div className="preview_prescription relative p-4 bg-gray-100 shadow-md rounded-md">
                                        <div className="flex flex-col gap-2 overflow-y-scroll max-h-[70vh]">
                                            {selectedPrescription.map((page, index) => (
                                                <img
                                                    key={index}
                                                    src={'/storage/' + page.file_path}
                                                    alt={`Prescription page ${index + 1}`}
                                                    className="rounded shadow-md"
                                                />
                                            ))}
                                        </div>
                                        <button
                                            className="absolute right-4 top-4 text-gray-700"
                                            aria-label="Close prescription preview"
                                            onClick={() => {
                                                setOpen(false);
                                                setSelectedPrescription(null);
                                            }}
                                        >
                                            <XIcon className="w-8 h-8" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        <Button type="submit" className="mt-4">Submit Order</Button>
                    </form>
                </div>
            </div>
        </MasterLayout>
    );
};

const SearchInputComponent = ({ handleProductSelect }) => {
    const [productSearchResults, setProductSearchResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const handleProductSearch = async (query) => {
        if (query.length > 1) {
            try {
                const res = await axios.get(`/api/search?term=${query}`);
                setProductSearchResults(res.data);
                setShowDropdown(true);
            } catch (error) {
                alert('Error searching products. Please try again later.');
            }
        } else {
            setProductSearchResults([]);
            setShowDropdown(false);
        }
    };

    return (
        <div className="relative">
            <h2 className="mt-6 mb-4 text-lg font-semibold">Add Products</h2>
            <TextInput
                placeholder="Search for a product"
                onChange={(e) => handleProductSearch(e.target.value)}
                onFocus={() => productSearchResults.length > 0 && setShowDropdown(true)}
                className="w-full"
            />
            {showDropdown && productSearchResults.length > 0 && (
                <ul className="absolute left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-10">
                    {productSearchResults.map((product) => (
                        <li
                            key={product.id}
                            onClick={() => {
                                handleProductSelect(product);
                                setShowDropdown(false);
                            }}
                            className="cursor-pointer hover:bg-gray-200 px-4 py-2"
                        >
                            {product.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default NewOrder;