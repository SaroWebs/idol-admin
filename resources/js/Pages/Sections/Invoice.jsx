import { Tooltip } from '@mantine/core';
import React, { useEffect } from 'react';

const Invoice = ({ order }) => {
  const handlePrint = () => {
    // Trigger the print dialog
    window.print();

    // Close the browser window after printing
    window.addEventListener('afterprint', () => {
      window.close();
    });
  };

  useEffect(() => {
    if (order) {
      handlePrint();
    }

    return () => {
      window.removeEventListener('afterprint', () => {
        window.close();
      });
    };
  }, [order]);

  if (!order) {
    return <p>Order data not available</p>;
  }

  const shippingAddress = order.customer_address
    ? `${order.customer_address.address_line_1}, ${order.customer_address.address_line_2}, ${order.customer_address.city}, ${order.customer_address.state}, ${order.customer_address.pin}`
    : 'N/A';

  return (
    <div className="relative p-4">
      <div id="invoice" className="bg-white border p-6 rounded shadow">
        <div className="bg-gray-800 text-white mb-6 text-center py-2">
          <h1 className="text-lg font-bold">Invoice</h1>
        </div>

        <div className="flex justify-between">
          <div>
            <h2 className="text-sm font-semibold">IDOL PHARMA</h2>
            <p>Khadi Office Building</p>
            <p>Maniram Dewan Road, Krishna Nagar</p>
            <p>Chandmari, Guwahati-781003</p>
            <p>Phone: 7896024584</p>
          </div>
          <div className='max-w-[400px]'>
            <p><strong>Order No:</strong> {order.order_no}</p>
            <p><strong>Customer Name:</strong> {order.customer?.name}</p>
            <p><strong>Address:</strong> {shippingAddress}</p>
            <p><strong>Payment Mode:</strong> {order.payment_mode}</p>
            <p><strong>Total Amount:</strong> ₹{order.payable_amount}</p>
          </div>
        </div>

        <table className="w-full border-collapse border border-gray-200 mt-6">
          <thead>
            <tr>
              <th className="border p-2 text-center">#</th>
              <th className="border p-2 text-center">Product Name</th>
              <th className="border p-2 text-center">MRP</th>
              <th className="border p-2 text-center">Offer Price</th>
              <th className="border p-2 text-center">Qty</th>
              <th className="border p-2 text-center">Tax</th>
              <th className="border p-2 text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.order_items.map((item, index) => {
              const isCancelled = item.statuses.find(st => st.active == 1).status == 'cancelled';
              const isReturned = item.statuses.find(st => st.active == 1).status == 'returned';
              const taxAmount = item.product?.tax?.tax_rate
                ? (Number(item.product.tax.tax_rate) / 100) * Number(item.product.offer_price)
                : 0;
              const totalTax = taxAmount * item.quantity;

              const totalWithTax = (item.quantity * Number(item.product?.offer_price)) + totalTax;

              return (
                <tr key={item.id}>
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2 text-center">{item.product?.name || 'N/A'}</td>
                  <td className="border p-2 text-center">₹{item.product?.price || 0}</td>
                  <td className="border p-2 text-center">₹{item.product?.offer_price || 0}</td>
                  <td className="border p-2 text-center">{item.quantity}</td>
                  <td className="border p-2 text-center">{Number(totalTax).toFixed(2)} ({Number(item.product.tax?.tax_rate || 0)}%)</td>
                  <td className="border p-2 text-center">₹{Number(totalWithTax).toFixed(2)}</td>
                </tr>
              );
            })}
            {/* Total Row */}
            <tr>
              <td className="border p-2 text-right font-bold" colSpan={6}>
                Delivery Charge
              </td>
              <td className="border p-2 text-center font-bold">₹{Number(order.delivery_charge).toFixed(2)}</td>
            </tr>
            <tr>
              <td className="border p-2 text-right font-bold" colSpan={6}>
                Total
              </td>
              <td className="border p-2 text-center font-bold">₹{(Number(order.payable_amount) +  Number(order.delivery_charge)).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Invoice;
