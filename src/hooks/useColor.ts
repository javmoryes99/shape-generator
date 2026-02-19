import { useEffect, useState } from "react";

const useColor = (property: string) => {
  const [color, setColor] = useState<string>();

  const root = document.documentElement;
  const styles = getComputedStyle(root);

  const colorBase100 = styles.getPropertyValue(property).trim();

  const temp = document.createElement("div");
  temp.style.color = colorBase100;
  document.body.appendChild(temp);

  const rgb = getComputedStyle(temp).color;
  document.body.removeChild(temp);
  
  useEffect(() => {
    setColor(rgb);
  }, [rgb]);

  return { color };
};

export default useColor;