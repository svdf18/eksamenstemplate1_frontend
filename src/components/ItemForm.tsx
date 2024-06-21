import React, { useState } from 'react';
import { IItem } from '../types/types';

interface ItemFormProps {
  item?: IItem; 
  onSubmit: (formData: Partial<IItem>) => void;
}

const ItemForm = ({ item, onSubmit }: ItemFormProps) => {
  const [formData, setFormData] = useState<Partial<IItem>>({
    name: item?.name || '', // Initialize form data with item's name if editing
    // Add more fields as needed for Athlete entity or ResultType entity
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        value={formData.name || ''}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      {/* Add more fields as needed for athlete entity or result entity */}
      <button type="submit">Submit</button>
    </form>
  );
};

export default ItemForm;
