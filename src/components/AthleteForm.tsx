import React, { useState, useEffect } from 'react';
import { IAthlete, IClub, IDiscipline } from '../types/types';
import { fetchClubs, fetchDisciplines } from '../utils/apiUtils.ts';
import styled from 'styled-components';

// Definerer props interface for AthleteForm-komponenten
interface AthleteFormProps {
  athlete?: IAthlete; // Valgfri athlete-prop, der kan være undefined
  onSubmit: (formData: Partial<IAthlete>) => void; // Funktion til at håndtere form-indsendelse
}

// AthleteForm-komponenten
const AthleteForm = ({ athlete, onSubmit }: AthleteFormProps) => {
 
  const [formData, setFormData] = useState<Partial<IAthlete>>({  // State til at holde formularens data, initialiseret med athleten hvis tilgængelig
    name: athlete?.name || '', // Athletens navn eller tom streng
    gender: athlete?.gender || '', // Athletens køn eller tom streng
    age: athlete?.age || 0, // Athletens alder eller 0
    imageUrl: athlete?.imageUrl || '', // Billed-URL eller tom streng
    club: athlete?.club || { id: 0, name: '', city: ''}, // Klub eller standard tom klub
    disciplines: athlete?.disciplines || [] // Disciplines eller tom array
  });

  // State til at holde listen af klubber
  const [clubs, setClubs] = useState<IClub[]>([]);
  // State til at holde listen af discipliner
  const [disciplines, setDisciplines] = useState<IDiscipline[]>([]);

  // useEffect til at hente initial data ved komponentens indlæsning
  useEffect(() => {
    // Asynkron funktion til at hente data
    const loadInitialData = async () => {
      const fetchedClubs = await fetchClubs(); // Hent klubber fra API
      console.log('Fetched Clubs:', fetchedClubs); // Log hentede klubber
      const fetchedDisciplines = await fetchDisciplines(); // Hent discipliner fra API
      console.log('Fetched Disciplines:', fetchedDisciplines); // Log hentede discipliner
      setClubs(fetchedClubs); // Opdater state med hentede klubber
      setDisciplines(fetchedDisciplines); // Opdater state med hentede discipliner
    };

    loadInitialData(); // Kald funktionen
  }, []); // Tom array betyder at effekten kun kører ved første render

  // Håndterer ændringer i inputfelter
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target; // Hent feltets navn og værdi
    console.log('handleChange:', name, value); // Log ændringen
    setFormData({ ...formData, [name]: value }); // Opdater formData med den nye værdi
  };

  // Håndterer ændringer i klubvælgeren
  const handleClubChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedClubId = parseInt(e.target.value); // Hent valgt klub ID
    const selectedClub = clubs.find(club => club.id === selectedClubId); // Find valgt klub i listen
    console.log('handleClubChange:', selectedClub); // Log valgt klub
    setFormData({ ...formData, club: selectedClub || { id: 0, name: '', city: '' } }); // Opdater formData med valgt klub
  };

  // Håndterer ændringer i disciplines-vælgeren
  const handleDisciplinesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDisciplineIds = Array.from(e.target.selectedOptions, option => parseInt(option.value)); // Hent valgte discipliner IDer
    const selectedDisciplines = selectedDisciplineIds.map(id => {
      const foundDiscipline = disciplines.find(discipline => discipline.id === id); // Find discipliner i listen
      console.log('handleDisciplinesChange - found discipline:', foundDiscipline); // Log fundne discipliner
      return foundDiscipline || { id: 0, name: '' }; // Returner fundne discipliner eller tom disciplin
    });
    console.log('handleDisciplinesChange - selected disciplines:', selectedDisciplines); // Log valgte discipliner
    // ts-expect-error - disciplines mangler i Partial<IAthlete>
    setFormData({ ...formData, disciplines: selectedDisciplines }); // Opdater formData med valgte discipliner
  };

  // Håndterer form indsendelse
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Forhindrer standard form indsendelse
    console.log('Form submitted - formData:', formData); // Log form data
    onSubmit(formData); // Kald onSubmit med form data
  };

  return (
    // Returnerer formularens JSX
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
        placeholder="Gender M/F"
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