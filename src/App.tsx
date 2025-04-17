// Import the FocusProvider to manage focus navigation across the app
import { FocusProvider } from "./providers/FocusProvider/FocusProvider";

// Import the main screen component for the radio app
import RadioScreen from "./pages/RadioScreen/RadioScreen";

// Import the RadioProvider to manage radio-related state and logic
import { RadioProvider } from "./providers/RadioProvider/RadioProvider";

const App = () => {
  return (
    // Provide the radio-related state and logic to the entire app
    <RadioProvider>
      {/* Provide focus management for keyboard/remote navigation */}
      <FocusProvider>
        {/* Render the main radio screen */}
        <RadioScreen />
      </FocusProvider>
    </RadioProvider>
  );
};

export default App;
