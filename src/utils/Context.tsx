import { createContext, Dispatch, SetStateAction, useState } from "react";
import { IItem, IAthlete, IResultType } from "../types/types";

interface IContext {
  items: IItem[];
  athletes: IAthlete[];
  resultTypes: IResultType[];
  setItems: Dispatch<SetStateAction<IItem[]>>;
  setAthletes: Dispatch<SetStateAction<IAthlete[]>>;
  setResultTypes: Dispatch<SetStateAction<IResultType[]>>;
}

export const DataContext = createContext<IContext>({
  items: [],
  setItems: () => {},
  athletes: [],
  setAthletes: () => {},
  resultTypes: [],
  setResultTypes: () => {},
});

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<IItem[]>([]);
  const [athletes, setAthletes] = useState<IAthlete[]>([]);
  const [resultTypes, setResultTypes] = useState<IResultType[]>([]);

  return (
    <DataContext.Provider value={{ items, setItems, athletes, setAthletes, resultTypes, setResultTypes }}>
      {children}
    </DataContext.Provider>
  );
}