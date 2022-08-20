import cookieParser from "./cookieParser";
import instance from "./instance";

const onAuth = async (data) => {
  const accessToken = cookieParser("access-token");

  const checkuser = await instance.post("/auth", { accessToken });

  const datas = checkuser.data;

  return data(datas);
};

export default onAuth;
