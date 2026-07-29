import { createContext, useContext, useState, type ReactNode } from "react";

interface SelectionContextType {
  selectedOption: number | null;
  setSelectedOption: (option: number) => void;
}

const SelectionContext = createContext<SelectionContextType | undefined>(
  undefined,
);

export const SelectionProvider = ({ children }: { children: ReactNode }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  return (
    <SelectionContext.Provider value={{ selectedOption, setSelectedOption }}>
      {children}
    </SelectionContext.Provider>
  );
};

export const useSelection = (): SelectionContextType => {
  const context = useContext(SelectionContext);
  if (context === undefined) {
    throw new Error("useSelection must be used within a SelectionProvider");
  }
  return context;
};
