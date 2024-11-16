import { Button, Modal, Select, TextInput, NumberInput, Checkbox, Grid, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddMedicine = ({ reload, categories = [], taxes = [] }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [loading, setLoading] = useState(false);
  const [formInfo, setFormInfo] = useState({
    name: '',
    code: '',
    details: '',
    top: 'N',
    feat: 'N',
    k_details: '',
    d_details: '',
    sip_details: '',
    o_details: '',
    price: '0',
    discount: '0',
    offer_price: '0',
    mfg_name: '',
    total_qty: '50',
    alert_qty: '10',
    category_id: '1',
    tax_id: '',
    prescription: '0',
    status: '1',
    returnable: '0',
    return_time: '0'
  });

  useEffect(() => {
    generateProductCode();
  }, []);

  const handleChange = (field, value) => {
    setFormInfo((prev) => ({
      ...prev,
      [field]: typeof value === 'number' ? String(value) : value,
      offer_price: field === 'price' || field === 'discount'
        ? calculateOfferPrice(Number(prev.price), field === 'discount' ? Number(value) : Number(prev.discount)).toString()
        : prev.offer_price
    }));
  };

  const calculateOfferPrice = (price, discount) => price - (price * discount) / 100;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    Object.entries(formInfo).forEach(([key, value]) => fd.append(key, value));

    axios.post(`data/product`, fd)
      .then((res) => {
        console.log(res.data);
        setLoading(false);
        close();
        reload();
      })
      .catch((err) => {
        console.log(err.message);
        setLoading(false);
      });
  };

  const generateProductCode = async () => {
    let isCodeAvailable = false;
    let newCode;

    while (!isCodeAvailable) {
      newCode = `PRO-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

      try {
        const response = await axios.get(`/product/code/${newCode}/check`);
        if (response.status === 200) {
          isCodeAvailable = true;
        }
      } catch (error) {
        console.error(`Code check failed: ${error.message}`);
      }
    }
    setFormInfo((prev) => ({ ...prev, code: newCode }));
  };

  return (
    <>
      <Button onClick={open}>Add Medicine</Button>
      <Modal opened={opened} onClose={close} size="70%" title="Add Medicine">
        <form onSubmit={handleSubmit}>
          <Grid gutter="sm">
            <Grid.Col span={8}>
              <TextInput
                label="Product Name"
                placeholder="Enter product name"
                required
                value={formInfo.name}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Select
                label="Category"
                placeholder="Select category"
                required
                data={categories.map((cat) => ({ value: String(cat.id), label: cat.name }))}
                value={formInfo.category_id}
                onChange={(value) => handleChange('category_id', value)}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                label="Product Code"
                placeholder="Auto-generated code"
                readOnly
                value={formInfo.code}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput
                label="Price"
                placeholder="Enter price"
                required
                value={Number(formInfo.price)}
                onChange={(value) => handleChange('price', value)}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput
                label="Discount (%)"
                placeholder="Enter discount"
                value={Number(formInfo.discount)}
                onChange={(value) => handleChange('discount', value)}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <TextInput
                label="Offer Price"
                placeholder="Calculated offer price"
                readOnly
                value={formInfo.offer_price}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Select
                label="Top Product"
                data={[{ value: 'Y', label: 'Yes' }, { value: 'N', label: 'No' }]}
                value={formInfo.top}
                onChange={(value) => handleChange('top', value)}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Select
                label="Featured Product"
                data={[{ value: 'Y', label: 'Yes' }, { value: 'N', label: 'No' }]}
                value={formInfo.feat}
                onChange={(value) => handleChange('feat', value)}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Select
                label="Tax Rate"
                placeholder="Select tax rate"
                data={taxes.map((tax) => ({ value: String(tax.id), label: `${tax.tax_rate}%` }))}
                value={formInfo.tax_id}
                onChange={(value) => handleChange('tax_id', value)}
              />
            </Grid.Col>
            <Grid.Col span={8}>
              <TextInput
                  label="Manufacturer"
                  placeholder=""
                  value={formInfo.mfg_name}
                  onChange={(e) => handleChange('mfg_name', e.target.value)}
                />
            </Grid.Col>
            <Grid.Col span={12}>
              <Textarea
                label="Details"
                placeholder="Enter product details"
                value={formInfo.details}
                onChange={(e) => handleChange('details', e.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Textarea
                label="Key Benefits"
                placeholder="Enter key benefits"
                value={formInfo.k_details}
                onChange={(e) => handleChange('k_details', e.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Textarea
                label="Directions for Use"
                placeholder="Enter directions for use"
                value={formInfo.d_details}
                onChange={(e) => handleChange('d_details', e.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Textarea
                label="Safety Information / Precautions"
                placeholder="Enter safety information"
                value={formInfo.sip_details}
                onChange={(e) => handleChange('sip_details', e.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <Textarea
                label="Other Details"
                placeholder="Enter other details"
                value={formInfo.o_details}
                onChange={(e) => handleChange('o_details', e.target.value)}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Total Quantity"
                required
                value={Number(formInfo.total_qty)}
                onChange={(value) => handleChange('total_qty', value)}
              />
            </Grid.Col>
            <Grid.Col span={6}>
              <NumberInput
                label="Alert Quantity"
                value={Number(formInfo.alert_qty)}
                onChange={(value) => handleChange('alert_qty', value)}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Checkbox
                label="Requires Prescription"
                checked={formInfo.prescription === '1'}
                onChange={(e) => handleChange('prescription', e.target.checked ? '1' : '0')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <Checkbox
                label="Returnable"
                checked={formInfo.returnable === '1'}
                onChange={(e) => handleChange('returnable', e.target.checked ? '1' : '0')}
              />
            </Grid.Col>
            <Grid.Col span={4}>
              <NumberInput
                label="Return Time (days)"
                disabled={formInfo.returnable === '0'}
                value={Number(formInfo.return_time)}
                onChange={(value) => handleChange('return_time', value)}
              />
            </Grid.Col>
          </Grid>
          <div className="mt-4 flex justify-end">
            <Button type="submit" loading={loading}>Save Medicine</Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default AddMedicine;
