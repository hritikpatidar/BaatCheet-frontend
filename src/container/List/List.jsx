// List.js
import React from 'react';
import { useSelector } from 'react-redux';
import Item from '../../components/Item';

const List = () => {
  const items = useSelector(state => state.authReducer.AuthSlice.items);

  return (
    <div>
      {items.map(item => (
        <Item key={item.id} item={item} />
      ))}
    </div>
  );
};

export default List;
