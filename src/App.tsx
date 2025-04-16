import { FocusProvider } from "./providers/FocusProvider/FocusProvider";
import RadioScreen from "./pages/RadioScreen/RadioScreen";
import { RadioProvider } from "./providers/RadioProvider/RadioProvider";

const App = () => {
  return (
    <RadioProvider>
      <FocusProvider>
        <RadioScreen />
      </FocusProvider>
    </RadioProvider>
  );
};

export default App;
