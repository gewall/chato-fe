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

const Register = () => {
  const [password, setPassword] = useState(true);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleRegister = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const nama = e.target.nama.value;
    try {
      const resp = await instance.post("/auth/register", {
        nama,
        email,
        password,
      });
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
        <Heading fontWeight={"light"}>Daftar</Heading>
      </Box>
      <Divider />
      <VStack as={"form"} w={"full"} onSubmit={handleRegister} method={"POST"}>
        <FormControl>
          <FormLabel htmlFor="nama" fontWeight={"normal"}>
            Nama
          </FormLabel>
          <Input name={"nama"} type={"nama"} placeholder={"Masukkan Nama..."} />
        </FormControl>
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
            //   onClick={() => navigate("/auth/register")}
            type={"submit"}
          >
            Daftar
          </Button>
        </ButtonGroup>
      </VStack>
    </>
  );
};

export default Register;
