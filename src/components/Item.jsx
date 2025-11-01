// Item.js
import React from 'react';

const Item = React.memo(({ item }) => {
  console.log("Rendering:", item.name); // Debug: Only new items should render
  return (
    <div style={{ display: 'flex', alignItems: 'center', margin: "5px 0" }}>
      <img src={item.image} alt={item.name} width={50} height={50} />
      <span style={{ marginLeft: 10 }}>{item.name}</span>
    </div>
  );
});

export default Item;