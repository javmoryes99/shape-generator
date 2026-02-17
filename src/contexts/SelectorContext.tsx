import { createContext } from "react";

export interface SelectorState {
  sides: number;
  diameter: number;
  type: string;
}

export interface SelectorContextType {
  selector: SelectorState;
  setSelector: React.Dispatch<React.SetStateAction<SelectorState>>;
}

const SelectorContext = createContext<SelectorContextType | null>(null);

export default SelectorContext;