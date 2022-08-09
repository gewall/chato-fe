import { useContext } from "react";
import { AppContext } from "../contexts";

const useSelector = (data) => {
  const { state } = useContext(AppContext);

  return data({ ...state });
};

export default useSelector;
