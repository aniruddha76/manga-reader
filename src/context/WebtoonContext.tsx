"use client"

import React, { createContext, useState, useContext } from "react";

interface WebtoonContextProps {
  chapters: string[];
  setChapters: (chapters: string[]) => void;
}

const WebtoonContext = createContext<WebtoonContextProps | undefined>(undefined);

export const WebtoonProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chapters, setChapters] = useState<string[]>([]);

  return (
    <WebtoonContext.Provider value={{ chapters, setChapters }}>
      {children}
    </WebtoonContext.Provider>
  );
};

export const useWebtoon = () => {
  const context = useContext(WebtoonContext);
  if (!context) {
    throw new Error("useWebtoon must be used within a WebtoonProvider");
  }
  return context;
};
