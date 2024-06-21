// ResultsSearch.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { IResultType, IDiscipline } from '../types/types';
import { fetchDisciplines } from '../utils/apiUtils';

interface ResultsSearchProps {
  results: IResultType[];
  onSearch: (searchTerm: string) => void;
  onFilterByDiscipline: (discipline: string) => void;
  onFilterByGender: (gender: string) => void;
}

const ResultsSearch: React.FC<ResultsSearchProps> = ({
  onSearch,
  onFilterByDiscipline,
  onFilterByGender,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>('');
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [disciplines, setDisciplines] = useState<IDiscipline[]>([]);

  useEffect(() => {
    fetchDisciplines()
      .then(data => {
        setDisciplines(data);
      })
      .catch(error => {
        console.error('Error fetching disciplines:', error);
      });
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  };

  const handleDisciplineChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const discipline = event.target.value;
    setSelectedDiscipline(discipline);
    onFilterByDiscipline(discipline);
  };

  const handleGenderChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const gender = event.target.value;
    setSelectedGender(gender);
    onFilterByGender(gender);
  };

  return (
    <SearchContainer>
      <StyledInput
        type="text"
        placeholder="Search by Athlete or Discipline"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      <StyledSelect value={selectedDiscipline} onChange={handleDisciplineChange}>
        <option value="">Filter by Discipline</option>
        {disciplines.map(discipline => (
          <option key={discipline.id} value={discipline.name}>
            {discipline.name}
          </option>
        ))}
      </StyledSelect>
      <StyledSelect value={selectedGender} onChange={handleGenderChange}>
        <option value="">Filter by Gender</option>
        <option value="M">Male</option>
        <option value="F">Female</option>
      </StyledSelect>
    </SearchContainer>
  );
};

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const StyledInput = styled.input`
  background-color: black;
  color: white;
  font-size: 0.6rem;
  width: 100%;
  max-width: 300px;
  padding: 0.5rem;
  margin-right: 1rem; /* Adjust spacing between inputs */
  border: none;
  border-radius: 4px;
  box-sizing: border-box;
`;

const StyledSelect = styled.select`
  background-color: black;
  color: white;
  font-size: 0.6rem;
  padding: 0.5rem;
  margin-right: 1rem; /* Adjust spacing between selects */
  border: none;
  border-radius: 4px;
  box-sizing: border-box;
`;

export default ResultsSearch;
