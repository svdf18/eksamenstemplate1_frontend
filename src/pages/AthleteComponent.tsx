import { useContext, useEffect, useState } from 'react';
import { DataContext } from '../utils/Context';
import useAthletes from '../hooks/useAthletes';
import { IAthlete } from '../types/types';
import { Grid1, PageContainer } from '../styles/GlobalStyles';
import Modal from '../components/Modal';
import AthleteForm from '../components/AthleteForm';
import styled from 'styled-components';

function AthleteComponent() {
  const { athletes: contextAthletes, setAthletes } = useContext(DataContext);
  const { athletes, isLoading, fetchAthletes, createAthlete, editAthlete, deleteAthlete } = useAthletes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState<IAthlete | null>(null);
  const [modalMode, setModalMode] = useState<'details' | 'delete' | 'edit' | 'create' | null>(null);

  useEffect(() => {
    if (contextAthletes.length === 0) {
      fetchAthletes().then(fetchedAthletes => {
        setAthletes(fetchedAthletes);
      });
    }
  }, [contextAthletes.length, fetchAthletes, setAthletes]);

  const handleImageClick = (athlete: IAthlete) => {
    setSelectedAthlete(athlete);
    setModalMode('details');
    setIsModalOpen(true);
  };

  const handleEditClick = (athlete: IAthlete) => {
    setSelectedAthlete(athlete);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleUpdateAthlete = (formData: Partial<IAthlete>) => {
    if (selectedAthlete) {
      editAthlete(selectedAthlete.id, formData);
      handleCloseModal();
    }
  };

  const handleCreateAthlete = (formData: Partial<IAthlete>) => {
    createAthlete(formData);
    handleCloseModal();
  };

  const handleDeleteClick = (athlete: IAthlete) => {
    setSelectedAthlete(athlete);
    setModalMode('delete');
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedAthlete) {
      deleteAthlete(selectedAthlete.id);
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAthlete(null);
    setModalMode(null);
  };

  return (
    <>
      <PageContainer>
        <TopGrid>
        <h1>Athletes</h1>
        <button className="btn" onClick={() => { handleCreateAthlete({}); setModalMode('create'); setIsModalOpen(true); }}>Create Athlete</button>
        </TopGrid>
        <Grid1>
        {isLoading && <p>Loading...</p>}
          {athletes.map((athlete: IAthlete) => (
            <div className="card" key={athlete.id}>
              <h5>{athlete.name}</h5>
              <img
                style={{ cursor: 'pointer' }}
                src={athlete.imageUrl || "https://via.placeholder.com/150"}
                alt={athlete.name}
                onClick={() => handleImageClick(athlete)}
              />
              <p>Age: {athlete.age}</p>
              <p>Gender: {athlete.gender}</p>
              <button className="btn" onClick={() => handleDeleteClick(athlete)}>Delete</button>
              <button className="btn" onClick={() => handleEditClick(athlete)}>Edit</button>
            </div>
          ))}
        </Grid1>
      </PageContainer>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {modalMode === 'details' && selectedAthlete && (
          <>
            <h2>{selectedAthlete.name} Details</h2>
            <img className='imageStandard' src={selectedAthlete.imageUrl || "https://via.placeholder.com/150"} alt={selectedAthlete.name} />
            <p>Age: {selectedAthlete.age}</p>
            <p>Gender: {selectedAthlete.gender}</p>
            <p>Club: {selectedAthlete.club.name}</p>
            <p>Disciplines: {selectedAthlete.disciplines.map(discipline => discipline.name).join(", ")}</p>
            <button className="btn" onClick={handleCloseModal}>Close</button>
          </>
        )}
        {modalMode === 'edit' && selectedAthlete && (
          <>
            <h2>Edit {selectedAthlete.name}</h2>
            <AthleteForm athlete={selectedAthlete} onSubmit={handleUpdateAthlete} />
          </>
        )}
        {modalMode === 'create' && (
          <>
            <h2>Create Athlete</h2>
            <AthleteForm onSubmit={handleCreateAthlete} />
          </>
        )}
        {modalMode === 'delete' && selectedAthlete && (
          <>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete {selectedAthlete.name}?</p>
            <button className="btn" onClick={handleConfirmDelete}>Confirm</button>
            <button className="btn" onClick={handleCloseModal}>Cancel</button>
          </>
        )}
      </Modal>
    </>
  );
}

const TopGrid = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  width: calc(100% - 2rem); /* Adjust this value based on your page layout and margin/padding considerations */
  padding: 0 1rem; /* Adjust padding as needed */

  h1 {
    margin: 0; /* Remove default margin for h1 */
  }

  .btn {
    margin-left: auto; /* Push the button to the right */
  }
`;

export default AthleteComponent;