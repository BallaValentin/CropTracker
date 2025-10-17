import { createContext, useContext, useState, type ReactNode } from "react";

interface DrawerContextType {
  isDrawerExpanded: boolean;
  toggleDrawer: () => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export const DrawerProvider = ({ children }: { children: ReactNode }) => {
  const [isDrawerExpanded, setIsDrawerExpanded] = useState<boolean>(true);

  const toggleDrawer = () => {
    setIsDrawerExpanded((prev) => !prev);
  };

  return (
    <DrawerContext.Provider value={{ isDrawerExpanded, toggleDrawer }}>
      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawer = () => {
  const context = useContext(DrawerContext);
  if (!context) throw new Error("useDrawer must be used within DrawerProvider");
  return context;
};
