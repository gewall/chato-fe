import { createContext, useMemo, useReducer } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children, initialState, reducer }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const data = useMemo(() => {
    return { state, dispatch };
  }, [state]);

  return <AppContext.Provider value={data}>{children}</AppContext.Provider>;
};
