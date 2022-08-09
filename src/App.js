import { ChakraProvider } from "@chakra-ui/react";
import { AppContextProvider } from "./libs/contexts";
import { AppReducer, initialState } from "./libs/contexts/reducers";
import { AppRouter } from "./routers";

function App() {
  return (
    <ChakraProvider>
      <AppContextProvider initialState={initialState} reducer={AppReducer}>
        <div className="App">
          <AppRouter />
        </div>
      </AppContextProvider>
    </ChakraProvider>
  );
}

export default App;

