import { useState, useEffect } from 'react';
import { IResultType } from '../types/types';
import { API_URL } from '../settings';
import { HttpException, handleHttpErrors, makeOptions } from '../utils/fetchUtils';
import toast from 'react-hot-toast';

const useResultTypes = () => {
  const [results, setResults] = useState<IResultType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const url = `${API_URL}/results`;

  const fetchResults = async (): Promise<IResultType[]> => {
    setIsLoading(true);
    try {
      const response = await fetch(url + "/all");
      const data = await response.json();

      if (!response.ok) {
        throw new HttpException(data.message, response.status);
      }

      setResults(data);
      return data;
    } catch (e: unknown) {
      if (e instanceof HttpException) {
        toast.error(e.message);
      } else {
        toast.error("An unexpected error occurred");
      }
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const createResult = async (resultData: Partial<IResultType>): Promise<IResultType | undefined> => {
    try {
      const options = makeOptions('POST', resultData);
      const res = await fetch(url + "/create", options);
      const data = await handleHttpErrors(res);
      setResults([...results, data]);
      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const editResult = async (id: number, resultData: Partial<IResultType>): Promise<IResultType | undefined> => {
    try {
      const options = makeOptions('PATCH', resultData);
      const res = await fetch(url + "/edit/" + id, options);
      const data = await handleHttpErrors(res);
      setResults(prevResults => 
        prevResults.map(result => result.id === id ? data : result)
      );
      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const deleteResult = async (id: number): Promise<void> => {
    try {
      const options = makeOptions('DELETE', null);
      await fetch(url + "/delete/" + id, options);
      setResults(prevResults => prevResults.filter(result => result.id !== id));
    } catch (error) {
      if (error instanceof HttpException) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return { results, isLoading, fetchResults, createResult, editResult, deleteResult };
};

export default useResultTypes;
