import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../utils/Context';
import { PageContainer } from '../styles/GlobalStyles';
import { IResultType, IResultTime, IResultDistance, IResultPoints } from '../types/types';
import useResultTypes from '../hooks/useResultTypes';
import styled from 'styled-components';
import Modal from '../components/Modal';
import ResultsForm from '../components/ResultsForm';
import ResultsSearch from '../components/ResultsSearch';

const ResultsTableComponent = () => {
  const { resultTypes: contextResultTypes, setResultTypes } = useContext(DataContext);
  const { results: allResults, isLoading, fetchResults, createResult, editResult, deleteResult } = useResultTypes();
  const [selectedResultType, setSelectedResultType] = useState<IResultType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'delete' | 'edit' | 'create' | null>(null);
  const [filteredResults, setFilteredResults] = useState<IResultType[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<string>('');

  useEffect(() => {
    if (contextResultTypes.length === 0) {
      fetchResults().then(fetchedResults => {
        setResultTypes(fetchedResults);
      });
    }
  }, [contextResultTypes.length, fetchResults, setResultTypes]);

  useEffect(() => {
    setFilteredResults(allResults);
  }, [allResults]);

  const handleCreateClick = () => {
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditClick = (resultType: IResultType) => {
    setSelectedResultType(resultType);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (formData: Partial<IResultType>) => {
    if (modalMode === 'create') {
      await createResult(formData);
    } else if (modalMode === 'edit' && selectedResultType) {
      await editResult(selectedResultType.id, formData);
    }
    fetchResults().then(fetchedResults => {
      setResultTypes(fetchedResults);
    });
    handleCloseModal();
  };

  const handleDeleteClick = (resultType: IResultType) => {
    setSelectedResultType(resultType);
    setModalMode('delete');
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedResultType) {
      await deleteResult(selectedResultType.id);
      fetchResults().then(fetchedResults => {
        setResultTypes(fetchedResults);
      });
      handleCloseModal();
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedResultType(null);
    setModalMode(null);
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm.toLowerCase());
    filterResults(searchTerm.toLowerCase(), selectedDiscipline, selectedGender);
  };

  const handleFilterByDiscipline = (discipline: string) => {
    setSelectedDiscipline(discipline);
    filterResults(searchTerm, discipline, selectedGender);
  };

  const handleFilterByGender = (gender: string) => {
    setSelectedGender(gender);
    filterResults(searchTerm, selectedDiscipline, gender);
  };

  const filterResults = (search: string, discipline: string, gender: string) => {
    let filtered = allResults.filter(result => {
      const athleteName = result.athlete.name.toLowerCase();
      const disciplineName = result.discipline.name.toLowerCase();

      const matchesSearch = athleteName.includes(search) || disciplineName.includes(search);
      const matchesDiscipline = discipline === '' || result.discipline.name === discipline;
      const matchesGender = gender === '' || result.athlete.gender === gender;

      return matchesSearch && matchesDiscipline && matchesGender;
    });

    setFilteredResults(filtered);
  };

  return (
    <>
      <PageContainer>
        <TopGrid>
          <h1>Results</h1>
          <button className="btn" onClick={handleCreateClick}>Create Result</button>
        </TopGrid>
        <ResultsSearch
          onSearch={handleSearch}
          onFilterByDiscipline={handleFilterByDiscipline}
          onFilterByGender={handleFilterByGender}
        />
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <ResultsTable
            results={filteredResults}
            onEditClick={handleEditClick}
            onDeleteClick={handleDeleteClick}
          />
        )}
      </PageContainer>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {modalMode === 'create' && (
          <>
            <h2>Create Result</h2>
            <ResultsForm onSubmit={handleFormSubmit} />
          </>
        )}
        {modalMode === 'edit' && selectedResultType && (
          <>
            <h2>Edit Result</h2>
            <ResultsForm resultType={selectedResultType} onSubmit={handleFormSubmit} />
          </>
        )}
        {modalMode === 'delete' && selectedResultType && (
          <>
            <h2>Delete {selectedResultType.resultType}</h2>
            <p>Are you sure you want to delete this result?</p>
            <button className="btn" onClick={handleCloseModal}>Cancel</button>
            <button className="btn" onClick={handleConfirmDelete}>Delete</button>
          </>
        )}
      </Modal>
    </>
  );
};

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
    margin-left: auto;
  }
`;

interface ResultsTableProps {
  results: IResultType[];
  onEditClick: (resultType: IResultType) => void;
  onDeleteClick: (resultType: IResultType) => void;
}

const ResultsTable = ({ results, onEditClick, onDeleteClick } : ResultsTableProps) => (
  <table className="table">
    <thead>
      <tr>
        <th>Track Meet</th>
        <th>Date</th>
        <th>Athlete</th>
        <th>Discipline</th>
        <th>Result Type</th>
        <th>Result</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {results.map((resultType: IResultType) => (
        <tr key={resultType.id}>
          <td>{resultType.trackMeet.name}</td>
          <td>{new Date(resultType.date).toLocaleDateString()}</td>
          <td>{resultType.athlete.name}</td>
          <td>{resultType.discipline.name}</td>
          <td>{resultType.resultType}</td>
          <td>
            {resultType.resultType === 'TIME' && (resultType as IResultTime).time}
            {resultType.resultType === 'DISTANCE' && (resultType as IResultDistance).distance}
            {resultType.resultType === 'POINTS' && (resultType as IResultPoints).points}
          </td>
          <td>
            <button className="btn" onClick={() => onEditClick(resultType)}>Edit</button>
            <button className="btn" onClick={() => onDeleteClick(resultType)}>Delete</button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default ResultsTableComponent;
