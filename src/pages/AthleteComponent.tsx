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
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card'); // State for view mode
  const [sortConfig, setSortConfig] = useState<{ key: keyof IAthlete, direction: 'ascending' | 'descending' | null }>({ key: 'name', direction: 'ascending' });

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

  const toggleViewMode = () => {
    setViewMode(viewMode === 'card' ? 'table' : 'card');
  };

  const getClassNamesFor = (name: keyof IAthlete) => {
    if (sortConfig && sortConfig.key === name) {
      return sortConfig.direction === 'ascending' ? 'sorted-asc' : 'sorted-desc';
    }
    return '';
  };

  const requestSort = (key: keyof IAthlete) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedAthletes = () => {
    const sortableAthletes = [...athletes];
    if (sortConfig !== null) {
      sortableAthletes.sort((a: IAthlete, b: IAthlete) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableAthletes;
  };

  return (
    <>
      <PageContainer>
        <TopGrid>
          <h1>Athletes</h1>
          <button className="btn" onClick={toggleViewMode}>
            {viewMode === 'card' ? 'Switch to Table View' : 'Switch to Card View'}
          </button>
          <button className="btn" onClick={() => { handleCreateAthlete({}); setModalMode('create'); setIsModalOpen(true); }}>Create Athlete</button>
        </TopGrid>
        {viewMode === 'card' ? (
          <Grid1>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              athletes.map((athlete: IAthlete) => (
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
              ))
            )}
          </Grid1>
        ) : (
          <table>
            <thead>
              <tr>
                <th className={getClassNamesFor('name')} onClick={() => requestSort('name')}>Name</th>
                <th className={getClassNamesFor('age')} onClick={() => requestSort('age')}>Age</th>
                <th className={getClassNamesFor('gender')} onClick={() => requestSort('gender')}>Gender</th>
                <th className={getClassNamesFor('club.name')} onClick={() => requestSort('club.name')}>Club</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedAthletes().map((athlete: IAthlete) => (
                <tr key={athlete.id}>
                  <td>{athlete.name}</td>
                  <td>{athlete.age}</td>
                  <td>{athlete.gender}</td>
                  <td>{athlete.club.name}</td>
                  <td>
                    <button className="btn" onClick={() => handleDeleteClick(athlete)}>Delete</button>
                    <button className="btn" onClick={() => handleEditClick(athlete)}>Edit</button>
                    <button className="btn" onClick={() => handleImageClick(athlete)}>Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
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
    margin-left: 1rem; /* Adjust margin as needed */
  }
`;

export default AthleteComponent;
