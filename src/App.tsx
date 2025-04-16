import { FocusProvider } from "./providers/FocusProvider/FocusProvider";
import RadioScreen from "./pages/RadioScreen/RadioScreen";
import { RadioProvider } from "./providers/RadioProvider/RadioProvider";

const App = () => {
  return (
    <FocusProvider>
      <RadioProvider>
        <RadioScreen />
      </RadioProvider>
    </FocusProvider>
  );
};

export default App;
