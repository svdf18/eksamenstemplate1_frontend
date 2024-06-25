import { useContext, useEffect, useState } from 'react';
import { DataContext } from '../utils/Context';
import useAthletes from '../hooks/useAthletes';
import useSortingTest from '../hooks/useSortingTest';
import { IAthlete } from '../types/types';
import { Grid1, PageContainer } from '../styles/GlobalStyles';
import Modal from '../components/Modal';
import AthleteForm from '../components/AthleteForm';
import styled from 'styled-components';

// Hovedkomponenten der håndterer atleter
function AthleteComponent() {
  // Henter kontekst for atleter og setter fra DataContext
  const { athletes: contextAthletes, setAthletes } = useContext(DataContext);

  // Bruger brugerdefineret hook til at håndtere atleter
  const { athletes, isLoading, fetchAthletes, createAthlete, editAthlete, deleteAthlete } = useAthletes();

  // State til at håndtere modalens åbningsstatus
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State til at holde den aktuelt valgte atlet
  const [selectedAthlete, setSelectedAthlete] = useState<IAthlete | null>(null);

  // State til at holde den aktuelle modal-tilstand (detaljer, sletning, redigering, oprettelse)
  const [modalMode, setModalMode] = useState<'details' | 'delete' | 'edit' | 'create' | null>(null);

  // State til at holde den aktuelle visningstilstand (kort eller tabel)
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  // Bruger brugerdefineret hook til at håndtere sortering af atleter
  const { sortedItems: sortedAthletes, requestSort, getClassNamesFor } = useSortingTest(athletes);

  // useEffect til at hente atleter ved første render
  useEffect(() => {
    if (contextAthletes.length === 0) {
      fetchAthletes().then(fetchedAthletes => {
        setAthletes(fetchedAthletes); // Opdaterer kontekstens atleter med de hentede data
        console.log('Fetched Athletes:', fetchedAthletes); // Logger de hentede atleter
      });
    }
  }, [contextAthletes.length, fetchAthletes, setAthletes]); // Afhængigheder for effekten

  // Håndterer klik på atlets billede (åbner detaljer-modal)
  const handleImageClick = (athlete: IAthlete) => {
    setSelectedAthlete(athlete); // Sætter valgt atlet
    setModalMode('details'); // Sætter modal tilstand til detaljer
    setIsModalOpen(true); // Åbner modal
  };

  // Håndterer klik på rediger-knap (åbner rediger-modal)
  const handleEditClick = (athlete: IAthlete) => {
    setSelectedAthlete(athlete); // Sætter valgt atlet
    setModalMode('edit'); // Sætter modal tilstand til redigering
    setIsModalOpen(true); // Åbner modal
  };

  // Håndterer opdatering af atlet via formular
  const handleUpdateAthlete = (formData: Partial<IAthlete>) => {
    if (selectedAthlete) {
      editAthlete(selectedAthlete.id, formData); // Redigerer atlet med opdaterede data
      handleCloseModal(); // Lukker modal
    }
  };

  // Håndterer oprettelse af ny atlet via formular
  const handleCreateAthlete = (formData: Partial<IAthlete>) => {
    createAthlete(formData); // Opretter ny atlet med formularens data
    console.log('Create Athlete:', formData); // Logger de oprettede data
    handleCloseModal(); // Lukker modal
  };

  // Håndterer klik på slet-knap (åbner slet-modal)
  const handleDeleteClick = (athlete: IAthlete) => {
    setSelectedAthlete(athlete); // Sætter valgt atlet
    setModalMode('delete'); // Sætter modal tilstand til sletning
    setIsModalOpen(true); // Åbner modal
  };

  // Bekræfter og udfører sletning af atlet
  const handleConfirmDelete = () => {
    if (selectedAthlete) {
      deleteAthlete(selectedAthlete.id); // Sletter valgt atlet
      handleCloseModal(); // Lukker modal
    }
  };

  // Lukker modal og nulstiller modal tilstand og valgt atlet
  const handleCloseModal = () => {
    setIsModalOpen(false); // Lukker modal
    setSelectedAthlete(null); // Nulstiller valgt atlet
    setModalMode(null); // Nulstiller modal tilstand
  };

  // Toggler visningstilstand mellem kort og tabel
  const toggleViewMode = () => {
    setViewMode(viewMode === 'card' ? 'table' : 'card'); // Skifter mellem kort- og tabelvisning
  };
  return (
    <>
      <PageContainer>
        <TopGrid>
          <h1>Athletes</h1>
          <button className="btn" onClick={toggleViewMode}>
            {viewMode === 'card' ? 'Switch to Table View' : 'Switch to Card View'}
          </button>
          <button className="btn" onClick={() => { setModalMode('create'); setIsModalOpen(true); }}>Create Athlete</button>
        </TopGrid>
        {viewMode === 'card' ? (
          <Grid1>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              sortedAthletes().map((athlete: IAthlete) => (
                <div className="card" key={athlete.id}>
                  <h5>{athlete.name}</h5>
                  <img
                    style={{ cursor: 'pointer' }}
                    src={athlete.imageUrl || "https://via.placeholder.com/150"}
                    alt={athlete.name}
                    onClick={() => handleImageClick(athlete)}
                  />
                  <p><strong>Age Group: </strong>{athlete.athleteAgeGroupEnum}</p>
                  <p><strong>Gender: </strong>{athlete.gender}</p>
                  <p><strong>Club: </strong>{athlete.club.name}</p>

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
              <th className={getClassNamesFor('athleteAgeGroupEnum')} onClick={() => requestSort('athleteAgeGroupEnum')}>Age Group</th>
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
                  <td>{athlete.athleteAgeGroupEnum}</td>
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
            <h2>{selectedAthlete.name}</h2>
            <img className='imageStandard' src={selectedAthlete.imageUrl || "https://via.placeholder.com/150"} alt={selectedAthlete.name} />
            <DetailsP1><strong>Age: </strong>{selectedAthlete.age}</DetailsP1>
            <DetailsP1><strong>Age Group: </strong>{selectedAthlete.athleteAgeGroupEnum}</DetailsP1>
            <DetailsP1><strong>Gender: </strong>{selectedAthlete.gender}</DetailsP1>
            <DetailsP1><strong>Club: </strong>{selectedAthlete.club.name}</DetailsP1>
            <DetailsP1><strong>Disciplines: </strong>{selectedAthlete.disciplines.map(discipline => discipline.name).join(", ")}</DetailsP1>
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
  width: calc(100% - 2rem); 
  padding: 0 1rem; 
  h1 {
    margin: 0;
  }

  .btn {
    margin-left: 1rem;
  }
`;

const DetailsP1 = styled.p`
  margin: 0.5rem 0;
  font-size: 1.2rem;
  text-align: left  !important;;

`;


export default AthleteComponent;
