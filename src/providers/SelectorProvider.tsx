import { useState } from "react";
import SelectorContext from "../contexts/SelectorContext";
import type { SelectorState } from "../contexts/SelectorContext";

const SelectorProvider = ({ children }: { children: React.ReactNode }) => {
  const [selector, setSelector] = useState<SelectorState>({
    sides: 6,
    diameter: 17,
    type: "circle",
    mode: "thin"
  });

  return (
    <SelectorContext.Provider value={{ selector, setSelector }}>
      {children}
    </SelectorContext.Provider>
  );
};

export default SelectorProvider;