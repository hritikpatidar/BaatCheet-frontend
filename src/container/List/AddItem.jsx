// AddItem.js
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '../../Redux/features/adminAuth/authSlice';

const AddItem = () => {
  const dispatch = useDispatch();
  const items = useSelector(state => state.authReducer.AuthSlice.items);
  const handleAdd = () => {
    const newItem = {
      id: items.length + 1,
      name: `Item ${items.length + 1}`,
      image: "https://via.placeholder.com/50"
    };
    dispatch(addItem(newItem));
  };

  return <button onClick={handleAdd}>Add Item</button>;
};

export default AddItem;