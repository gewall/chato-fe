import { useContext } from "react";
import { AppContext } from "../contexts";

const useDispatch = () => {
  const { dispatch } = useContext(AppContext);

  return dispatch;
};

export default useDispatch;
