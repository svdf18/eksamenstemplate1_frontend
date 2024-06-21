import { useEffect, useState } from "react";
import { IAthlete } from "../types/types";
import { API_URL } from "../settings";
import { HttpException, handleHttpErrors, makeOptions } from "../utils/fetchUtils";
import toast from "react-hot-toast";

function useAthletes() {
  const [athletes, setAthletes] = useState<IAthlete[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const url = `${API_URL}/athletes`;

  const fetchAthletes = async (): Promise<IAthlete[]> => {
    setIsLoading(true);
    try {
      const response = await fetch(url + "/all");
      const data = await response.json();
      
      if (!response.ok) {
        throw new HttpException(data.message, response.status);
      }

      setAthletes(data);
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
    fetchAthletes();
  }, []);

  const fetchAthleteById = async (id: number) => {
    try {
      const res = await fetch(url + '/id/' + id);
      const data = await res.json();
      if (!res.ok) {
        throw new HttpException(data.message, res.status);
      }
      setAthletes([data]);
    } catch (error) {
      if (error instanceof HttpException) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }

  const createAthlete = async (athlete: Partial<IAthlete>) => {
    try {
      const options = makeOptions("POST", athlete);
      const res = await fetch(url + "/create", options);
      const data = await handleHttpErrors(res);
      setAthletes([...athletes, data]);
      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }

  const editAthlete = async (id: number, athlete: Partial<IAthlete>) => {
    try {
      console.log('editAthlete:', id, athlete);
      const options = makeOptions("PATCH", athlete);
      console.log('Edit URL:', url + "/edit/" + id);
      console.log('Edit Options:', options);
      const res = await fetch(url + "/edit/" + id, options);
      const data = await handleHttpErrors(res);
      setAthletes(prev => 
        prev.map(a => a.id === id ? data : a)
      );
      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }

  const deleteAthlete = async (id: number) => {
    try {
      const options = makeOptions("DELETE", null);
      await fetch(url + "/delete/" + id, options);
      setAthletes(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      if (error instanceof HttpException) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }

  return { athletes, isLoading, fetchAthletes, fetchAthleteById, createAthlete, editAthlete, deleteAthlete };
}

export default useAthletes;