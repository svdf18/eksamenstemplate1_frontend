// components/ItemTableComponent.js
import { useContext } from 'react';
import { DataContext } from '../utils/Context';
import { PageContainer } from '../styles/GlobalStyles';
import '../index.css'; // Import index.css for styling

const ItemTableComponent = () => {
  const { items } = useContext(DataContext);

  return (
    <>
      <PageContainer>
        <table className="table"> {/* Add className for styling */}
          <thead>
            <tr>
              <th>Item</th>
              <th>Prop</th>
              <th>Prop</th>
              <th>Prop</th>
              <th>Prop</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>Value</td>
                <td>Value</td>
                <td>Value</td>
                <td>Value</td>
                <td>
                  <button className="btn">Edit</button> 
                  <button className="btn">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </PageContainer>
    </>
  );
};

export default ItemTableComponent;
