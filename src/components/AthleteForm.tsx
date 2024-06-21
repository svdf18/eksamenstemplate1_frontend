import React, { useState, useEffect } from 'react';
import { IAthlete, IClub, IDiscipline } from '../types/types';
import { fetchClubs, fetchDisciplines } from '../utils/apiUtils.ts';
import styled from 'styled-components';

interface AthleteFormProps {
  athlete?: IAthlete; 
  onSubmit: (formData: Partial<IAthlete>) => void;
}


const AthleteForm: React.FC<AthleteFormProps> = ({ athlete, onSubmit }) => {
  const [formData, setFormData] = useState<Partial<IAthlete>>({
    name: athlete?.name || '',
    gender: athlete?.gender || '',
    age: athlete?.age || 0,
    imageUrl: athlete?.imageUrl || '',
    club: athlete?.club || { id: 0, name: '', city: ''},
    disciplines: athlete?.disciplines || []
  });

  const [clubs, setClubs] = useState<IClub[]>([]);
  const [disciplines, setDisciplines] = useState<IDiscipline[]>([]);

  useEffect(() => {
    const loadInitialData = async () => {
      const fetchedClubs = await fetchClubs();
      console.log('Fetched Clubs:', fetchedClubs);
      const fetchedDisciplines = await fetchDisciplines();
      console.log('Fetched Disciplines:', fetchedDisciplines);
      setClubs(fetchedClubs);
      setDisciplines(fetchedDisciplines);
    };

    loadInitialData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log('handleChange:', name, value);
    setFormData({ ...formData, [name]: value });
  };

  const handleClubChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClubId = parseInt(e.target.value);
    const selectedClub = clubs.find(club => club.id === selectedClubId);
    console.log('handleClubChange:', selectedClub);
    setFormData({ ...formData, club: selectedClub || { id: 0, name: '', city: '' } });
  };

  const handleDisciplinesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDisciplineIds = Array.from(e.target.selectedOptions, option => parseInt(option.value));
    const selectedDisciplines = selectedDisciplineIds.map(id => {
      const foundDiscipline = disciplines.find(discipline => discipline.id === id);
      console.log('handleDisciplinesChange - found discipline:', foundDiscipline);
      return foundDiscipline || { id: 0, name: '' };
    });
    console.log('handleDisciplinesChange - selected disciplines:', selectedDisciplines);
    setFormData({ ...formData, disciplines: selectedDisciplines });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted - formData:', formData);
    onSubmit(formData);
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <StyledInput
        type="text"
        name="name"
        value={formData.name || ''}
        onChange={handleChange}
        placeholder="Name"
        required
      />
      <StyledInput
        type="text"
        name="gender"
        value={formData.gender || ''}
        onChange={handleChange}
        placeholder="Gender"
        required
      />
      <StyledInput
        type="number"
        name="age"
        value={formData.age || ''}
        onChange={handleChange}
        placeholder="Age"
        required
      />
      <StyledInput
        type="text"
        name="imageUrl"
        value={formData.imageUrl || ''}
        onChange={handleChange}
        placeholder="Image URL"
      />
      <StyledSelect
        name="club"
        value={formData.club?.id || ''}
        onChange={handleClubChange}
        required
      >
        <option value="" disabled>Select Club</option>
        {clubs.map((club) => (
          <option key={club.id} value={club.id}>
            {club.name}
          </option>
        ))}
      </StyledSelect>
      <StyledSelect
        multiple
        name="disciplines"
        value={formData.disciplines?.map((discipline) => discipline.id.toString()) || []}
        onChange={handleDisciplinesChange}
        required
      >
        {disciplines.map((discipline) => (
          <option key={discipline.id} value={discipline.id}>
            {discipline.name}
          </option>
        ))}
      </StyledSelect>
      <StyledButton type="submit">Submit</StyledButton>
    </FormContainer>
  );
};

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledInput = styled.input`
  background-color: black;
  color: white;
  font-size: 1.2rem;
  width: 100%;
  max-width: 300px;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 4px;
  box-sizing: border-box;
  text-align: center;
`;

const StyledSelect = styled.select`
  background-color: black;
  color: white;
  font-size: 1.2rem;
  width: 100%;
  max-width: 300px;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: none;
  border-radius: 4px;
  box-sizing: border-box;
`;

const StyledButton = styled.button`
  background-color: black;
  color: white;
  font-size: 1.2rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export default AthleteForm;