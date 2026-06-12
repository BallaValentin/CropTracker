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

export const useDrawer = (): DrawerContextType => {
  const context = useContext(DrawerContext);
  if (context === undefined) {
    throw new Error("useDrawer must be used within a DrawerProvider");
  }
  return context;
};
