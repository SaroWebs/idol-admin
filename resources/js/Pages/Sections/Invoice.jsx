import React from 'react';

const Invoice = (props) => {
  const { order } =props

  const printInvoice = () => {
    window.print();
  };

  if (!order) {
    return <p>Order data not available</p>;
  }

  return (
    <div className="relative p-4">
      <div id="invoice" className="bg-white border p-6 rounded shadow">
        <h1 className="text-lg font-bold mb-4">Invoice</h1>
        <p><strong>Order No:</strong> {order.order_no}</p>
        <p><strong>Customer Name:</strong> {order.customer?.name}</p>
        <p><strong>Address:</strong></p>
        <p><strong>Payment Mode:</strong> {order.payment_mode}</p>
        <p><strong>Total Amount:</strong> ₹{order.payable_amount}</p>
        
        <h2 className="text-md font-semibold mt-4">Order Items</h2>
        <table className="w-full border-collapse border border-gray-200 mt-2">
          <thead>
            <tr>
              <th className="border p-2">#</th>
              <th className="border p-2">Product Name</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {order.order_items.map((item, index) => (
              <tr key={item.id}>
                <td className="border p-2">{index + 1}</td>
                <td className="border p-2">{item.product.name}</td>
                <td className="border p-2">{item.quantity}</td>
                <td className="border p-2">₹{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={printInvoice}
        className="mt-4 bg-orange-500 text-white px-4 py-2 rounded"
      >
        Print
      </button>
    </div>
  );
};

export default Invoice;
