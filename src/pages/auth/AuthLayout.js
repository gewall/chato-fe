import { Box, Center, Flex, Image, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "../../libs/hooks";
import { history, onAuth } from "../../libs/services";

const AuthLayout = () => {
  const { currentUser } = useSelector((state) => state);
  const dispatch = useDispatch();
  console.log(currentUser);
  useEffect(() => {
    onAuth((data) => {
      dispatch({ type: "SET_CURRENT_USER", payload: { ...data } });
    });

    return () => currentUser && history.replace("/");
  }, [currentUser, dispatch]);

  return (
    <Center h={"100vh"} p={12}>
      <Flex
        bgColor={"white"}
        flex={1}
        rounded={"xl"}
        border={"1px"}
        borderColor={"gray.200"}
        overflow="hidden"
      >
        <Box flex={1} w={"60%"}>
          <Image
            src={
              "https://meson-digital.com/wp-content/uploads/2021/08/social-media-marketing-1024x683.jpg"
            }
            alt={"Sosmed"}
            objectFit={"cover"}
            h={"md"}
            w={"full"}
          />
        </Box>
        <VStack
          maxW={"xl"}
          w={"md"}
          py={8}
          px={12}
          spacing={4}
          //   h={"full"}
          justifyContent={"center"}
        >
          <Outlet />
        </VStack>
      </Flex>
    </Center>
  );
};

export default AuthLayout;
