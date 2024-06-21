import { useEffect, useState } from "react";
import { IItem } from "../types/types";
import { API_URL } from "../settings";
import { HttpException, handleHttpErrors, makeOptions } from "../utils/fetchUtils";
import toast from "react-hot-toast";

function useItem() {
  const [items, setItems] = useState<IItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const url = `${API_URL}/items`;

  const fetchItems = async (): Promise<IItem[]> => {
    setIsLoading(true);
    try {
      const response = await fetch(url + "/all");
      const data = await response.json();
      
      if (!response.ok) {
        throw new HttpException(data.message, response.status);
      }

      setItems(data);
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
    setIsLoading(true);
    fetchItems().then(() => setIsLoading(false));
  }, []);

  const fetchItemsById = async (id: number) => {
    try {
      const res = await fetch(url + '/id/' + id);
      const data = await res.json();
      setItems(data);
    } catch (error) {
      if (error instanceof HttpException) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }

  const createItem = async (item: Partial<IItem>) => {
    try {
      const options = makeOptions("POST", item);
      const res = await fetch(url + "/create", options);
      const data = await handleHttpErrors(res);
      setItems([...items, data]);
      return data;
    } catch (error) {
      if (error instanceof HttpException) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }

  const editItem = async (id: number, item: Partial<IItem>) => {
    try {
      const options = makeOptions("PATCH", item);
      const res = await fetch(url + "/edit/" + id, options);
      const data = await handleHttpErrors(res);
      setItems(prev => 
        prev.map(item => item.id === id ? data : item)
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

  const deleteItem = async (id: number) => {
    try {
      const options = makeOptions("DELETE", null);
      await fetch(url + "/delete/" + id, options);
      setItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      if (error instanceof HttpException) {
        toast.error(error.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  }

  return { items, isLoading, fetchItems, fetchItemsById, createItem, editItem, deleteItem };
}

export default useItem;
