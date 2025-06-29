"use client";

import { createContext, useEffect, useState } from "react";

interface DataContextType {
  data: any; // Permanece flexível, mas ainda garante que `data` existe
}

export const DataContext = createContext<DataContextType | null>(null);

interface DataContextProviderProps {
  data: any; // Permite qualquer tipo, mas ainda passamos como `data`
  children: React.ReactNode;
}

export function DataContextProvider({ data, children }: DataContextProviderProps) {
  const [dataState, setDataState] = useState(() => {
    if (data && !Array.isArray(data)) return data;
    return null;
  });

  useEffect(() => {
    setDataState(data);
  }, [data]);

  return (
    <DataContext.Provider value={{ data: dataState }}>
      {children}
    </DataContext.Provider>
  );
}