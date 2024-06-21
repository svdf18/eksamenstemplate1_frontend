import { useContext, useEffect, useState } from 'react';
import { DataContext } from '../utils/Context';
import useItem from '../hooks/useItem';
import { IItem } from '../types/types';
import { Grid1, PageContainer } from '../styles/GlobalStyles';
import Modal from '../components/Modal';
import ItemForm from '../components/ItemForm';

function ItemComponent() {
  const { items: contextItems, setItems } = useContext(DataContext);
  const { items, isLoading, fetchItems, createItem, editItem, deleteItem } = useItem();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<IItem | null>(null);
  const [modalMode, setModalMode] = useState<'details' | 'delete' | 'edit' | 'create' | null>(null);

  useEffect(() => {
    if (contextItems.length === 0) {
      fetchItems().then(fetchedItems => {
        setItems(fetchedItems);
      });
    }
  }, [contextItems.length, fetchItems, setItems]);

  const handleImageClick = (item: IItem) => {
    setSelectedItem(item);
    setModalMode('details');
    setIsModalOpen(true);
  };

  const handleEditClick = (item: IItem) => {
    setSelectedItem(item);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleUpdateItem = (formData: Partial<IItem>) => {
    if (selectedItem) {
      editItem(selectedItem.id, formData);
      handleCloseModal();
    }
  };

  const handleCreateItem = (formData: Partial<IItem>) => {
    createItem(formData);
    handleCloseModal();
  };

  const handleDeleteClick = (item: IItem) => {
    setSelectedItem(item);
    setModalMode('delete');
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedItem) {
      deleteItem(selectedItem.id);
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setModalMode(null);
  };

  return (
    <>
      <PageContainer>
        <h1>Items</h1>
        {isLoading && <p>Loading...</p>}
        <Grid1>
          {items.map((item: IItem) => (
            <div className="card" key={item.id}>
              <h5>{item.name}</h5>
              <img
                style={{ cursor: 'pointer' }}
                src="https://f4.bcbits.com/img/a0775158127_10.jpg"
                alt={item.name}
                onClick={() => handleImageClick(item)}
              />
              <p>Properties</p>
              <button className="btn" onClick={() => handleDeleteClick(item)}>Delete</button>
              <button className="btn" onClick={() => handleEditClick(item)}>Edit</button>
            </div>
          ))}
        </Grid1>
      </PageContainer>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {modalMode === 'details' && selectedItem && (
          <>
            <h2>{selectedItem.name} Details</h2>
            <img className='imageStandard' src="https://f4.bcbits.com/img/a0775158127_10.jpg" alt={selectedItem.name} />
            <p>Properties: {selectedItem.name}</p>
            <button className="btn" onClick={handleCloseModal}>Close</button>
          </>
        )}
        {modalMode === 'edit' && selectedItem && (
          <>
            <h2>Edit {selectedItem.name}</h2>
            <ItemForm item={selectedItem} onSubmit={handleUpdateItem} />
          </>
        )}
        {modalMode === 'create' && (
          <>
            <h2>Create Item</h2>
            <ItemForm onSubmit={handleCreateItem} />
          </>
        )}
        {modalMode === 'delete' && selectedItem && (
          <>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete {selectedItem.name}?</p>
            <button className="btn" onClick={handleConfirmDelete}>Confirm</button>
            <button className="btn" onClick={handleCloseModal}>Cancel</button>
          </>
        )}
      </Modal>
    </>
  );
}

export default ItemComponent;
