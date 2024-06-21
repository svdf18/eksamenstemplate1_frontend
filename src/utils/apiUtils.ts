import { IClub, IDiscipline, ITrackMeet } from '../types/types';
import { API_URL } from '../settings';
import { HttpException, handleHttpErrors } from './fetchUtils';

const url = `${API_URL}/clubs`;

export const fetchClubs = async (): Promise<IClub[]> => {
  try {
    const response = await fetch(url + '/all');
    const data = await handleHttpErrors(response);
    return data;
  } catch (error) {
    if (error instanceof HttpException) {
      throw new HttpException(error.message, error.status);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

const disciplineUrl = `${API_URL}/disciplines`;

export const fetchDisciplines = async (): Promise<IDiscipline[]> => {
  try {
    const response = await fetch(disciplineUrl + '/all');
    const data = await handleHttpErrors(response);
    return data;
  } catch (error) {
    if (error instanceof HttpException) {
      throw new HttpException(error.message, error.status);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};

const trackMeetUrl = `${API_URL}/trackmeets`

export const fetchTrackMeets = async (): Promise<ITrackMeet[]> => {
  try {
    const response = await fetch(`${trackMeetUrl}/all`);
    const data = await handleHttpErrors(response);
    return data;
  } catch (error) {
    if (error instanceof HttpException) {
      throw new HttpException(error.message, error.status);
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
};