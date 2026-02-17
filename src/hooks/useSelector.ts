import { useContext } from "react";
import SelectorContext from "../contexts/SelectorContext";
import type { SelectorContextType } from "../contexts/SelectorContext";

const useSelector = (): SelectorContextType => {
  const context = useContext(SelectorContext);
  if (!context) throw new Error("useSelector debe usarse dentro de <SelectorProvider>");
  return context;
};

export default useSelector;