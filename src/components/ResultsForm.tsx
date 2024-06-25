import React, { useState, useEffect, useContext } from 'react';
import { IResultType, ITrackMeet, IDiscipline } from '../types/types';
import { fetchTrackMeets, fetchDisciplines } from '../utils/apiUtils';
import styled from 'styled-components';
import { DataContext } from '../utils/Context';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface ResultsFormProps {
  resultType?: IResultType;
  onSubmit: (formData: Partial<IResultType>) => void;
}

const ResultsForm = ({ resultType, onSubmit }: ResultsFormProps) => {
  const { athletes: contextAthletes } = useContext(DataContext);

  const [formData, setFormData] = useState<Partial<IResultType>>({
    trackMeet: resultType?.trackMeet || { id: 0, name: '' },
    date: resultType?.date || '',
    athlete: resultType?.athlete || { id: 0, name: '', imageUrl: '', gender: '', age: 0, club: { id: 0, name: '', city: '' }, disciplines: [] },
    discipline: resultType?.discipline || { id: 0, name: '', gender: 'MIXED', resultType: 'TIME' },
    resultType: resultType?.resultType || 'TIME',
    time: resultType?.time || "",
    distance: resultType?.distance || 0,
    points: resultType?.points || 0,
  });

  const [trackMeets, setTrackMeets] = useState<ITrackMeet[]>([]);
  const [disciplines, setDisciplines] = useState<IDiscipline[]>([]);
  const [selectedAthleteId, setSelectedAthleteId] = useState<number | undefined>(formData.athlete?.id);
  const [selectedAthleteDisciplines, setSelectedAthleteDisciplines] = useState<IDiscipline[]>([]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const fetchedTrackMeets = await fetchTrackMeets();
        const fetchedDisciplines = await fetchDisciplines();
        setTrackMeets(fetchedTrackMeets);
        setDisciplines(fetchedDisciplines);

        if (resultType?.athlete) {
          const athlete = contextAthletes.find(athlete => athlete.id === resultType.athlete?.id);
          if (athlete) {
            setSelectedAthleteDisciplines(athlete.disciplines);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    loadInitialData();
  }, [contextAthletes, resultType]);

  const handleTrackMeetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTrackMeetId = parseInt(e.target.value);
    const selectedTrackMeet = trackMeets.find(meet => meet.id === selectedTrackMeetId);
    setFormData({ ...formData, trackMeet: selectedTrackMeet || { id: 0, name: '' } });
  };

  const handleAthleteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedAthleteId = parseInt(e.target.value);
    const selectedAthlete = contextAthletes.find(athlete => athlete.id === selectedAthleteId);
    const athleteDisciplines = selectedAthlete?.disciplines || [];
    setSelectedAthleteDisciplines(athleteDisciplines);
    setFormData({ ...formData, athlete: selectedAthlete || { id: 0, name: '', imageUrl: '', gender: '', age: 0, club: { id: 0, name: '', city: '' }, disciplines: athleteDisciplines } });
    setSelectedAthleteId(selectedAthleteId);
  };

  const handleDateChange = (date: Date) => {
    setFormData({ ...formData, date: date.toISOString() });
  };

  const handleDisciplineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedDisciplineId = parseInt(e.target.value);
    const selectedDiscipline = selectedAthleteDisciplines.find(discipline => discipline.id === selectedDisciplineId);
    setFormData({
      ...formData,
      discipline: selectedDiscipline || { id: 0, name: '', gender: "MIXED", resultType: 'TIME' },
      resultType: selectedDiscipline?.resultType || 'TIME',
      time: "",
      distance: 0,
      points: 0,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted - formData:', formData);
    onSubmit(formData);
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <StyledSelect
        name="trackMeet"
        value={formData.trackMeet?.id || ''}
        onChange={handleTrackMeetChange}
        required
      >
        <option value="" disabled>Select Track Meet</option>
        {trackMeets.map((meet) => (
          <option key={meet.id} value={meet.id}>
            {meet.name}
          </option>
        ))}
      </StyledSelect>
      
      <StyledDatePicker
        selected={formData.date ? new Date(formData.date) : null}
        onChange={date => handleDateChange(date as Date)}
        dateFormat="yyyy-MM-dd"
        placeholderText="Select Date"
        required
      />
      
      <StyledSelect
        name="athlete"
        value={selectedAthleteId || ''}
        onChange={handleAthleteChange}
        required
      >
        <option value="" disabled>Select Athlete</option>
        {contextAthletes.map((athlete) => (
          <option key={athlete.id} value={athlete.id}>
            {athlete.name}
          </option>
        ))}
      </StyledSelect>
      
      {selectedAthleteId && (
        <StyledSelect
          name="discipline"
          value={formData.discipline?.id || ''}
          onChange={handleDisciplineChange}
          required
        >
          <option value="" disabled>Select Discipline</option>
          {selectedAthleteDisciplines.map((discipline) => (
            <option key={discipline.id} value={discipline.id}>
              {discipline.name}
            </option>
          ))}
        </StyledSelect>
      )}

      {formData.resultType && (
        <div>
          <StyledSelect
            name="resultType"
            value={formData.resultType}
            disabled
          >
            <option value="TIME">Time</option>
            <option value="DISTANCE">Distance</option>
            <option value="POINTS">Points</option>
          </StyledSelect>
          
          {formData.resultType === "TIME" && (
            <StyledInput
              type="string"
              name="time"
              value={formData.time || ''}
              onChange={handleInputChange}
              placeholder="Enter Time: hh:mm:ss.SS"
              required
            />
          )}

          {formData.resultType === "DISTANCE" && (
            <StyledInput
              type="number"
              name="distance"
              value={formData.distance || ''}
              onChange={handleInputChange}
              placeholder="Enter Distance"
              required
            />
          )}

          {formData.resultType === "POINTS" && (
            <StyledInput
              type="number"
              name="points"
              value={formData.points || ''}
              onChange={handleInputChange}
              placeholder="Enter Points"
              required
            />
          )}
        </div>
      )}

      <StyledButton type="submit">Submit</StyledButton>
    </FormContainer>
  );
};

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
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

const StyledDatePicker = styled(DatePicker)`
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



export default ResultsForm;
