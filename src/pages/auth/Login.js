import {
  Box,
  Button,
  ButtonGroup,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Icon,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BiHide, BiShowAlt } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "../../libs/hooks";
import { history, instance } from "../../libs/services";

const Login = () => {
  const [password, setPassword] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      const resp = await instance.post("/auth/login", { email, password });
      const data = resp.data;
      dispatch({ type: "SET_CURRENT_USER", payload: { ...data } });

      history.replace("/");
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Box>
        <Heading fontWeight={"light"}>Masuk</Heading>
      </Box>
      <Divider />
      <VStack as={"form"} w={"full"} onSubmit={handleLogin} method={"POST"}>
        <FormControl>
          <FormLabel htmlFor="email" fontWeight={"normal"}>
            Email
          </FormLabel>
          <Input
            name={"email"}
            type={"email"}
            placeholder={"Masukkan Email..."}
          />
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="password" fontWeight={"normal"}>
            Password
          </FormLabel>
          <InputGroup>
            <Input
              name={"password"}
              type={password ? "password" : "text"}
              placeholder={"Masukkan Password..."}
            />
            <InputRightElement
              children={
                !password ? <Icon as={BiHide} /> : <Icon as={BiShowAlt} />
              }
              onClick={() => setPassword(!password)}
              cursor={"pointer"}
            />
          </InputGroup>
        </FormControl>
        {/* <Box py={8} /> */}
        <ButtonGroup py={4}>
          <Button
            colorScheme={"twitter"}
            onClick={() => navigate("/auth/register")}
          >
            Daftar
          </Button>
          <Button colorScheme={"whatsapp"} type={"submit"}>
            Masuk
          </Button>
        </ButtonGroup>
      </VStack>
    </>
  );
};

export default Login;
