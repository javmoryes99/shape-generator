import Grid from "../components/Grid";
import Selector from "../components/Selector";
import SelectorProvider from "../providers/SelectorProvider";

function Main() {
  return (
    <SelectorProvider>
      <Selector />
      <Grid />
    </SelectorProvider>
  );
}

export default Main;
