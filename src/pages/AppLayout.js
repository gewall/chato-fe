import {
  Avatar,
  Box,
  Button,
  Center,
  Container,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Icon,
  IconButton,
  Input,
  LinkBox,
  LinkOverlay,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  BiMenu,
  BiCircle,
  BiSearch,
  BiAddToQueue,
  BiBookAdd,
} from "react-icons/bi";
import React, { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { history, instance, socket } from "../libs/services";
import { useSelector } from "../libs/hooks";

const AppLayout = () => {
  const { currentUser } = useSelector((state) => state);

  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(false);
  const [searchedUser, setSearchedUser] = useState([]);
  const io = useRef();

  const [userio, setUserio] = useState([]);

  const tambahKontak = async (id) => {
    try {
      const resp = await instance.post("/kontak/add", {
        fromId: currentUser?.id,
        toId: id,
      });

      console.log(resp);
      setModal(false);
      io.current.on("receive_users", (data) => {
        setUserio(data);
      });
    } catch (error) {
      console.log(error);
    }
  };

  const searchSubmit = async (e) => {
    e.preventDefault();

    try {
      const { cari_kontak } = e.target.elements;
      const resp = await instance.get(`/user/?nama=${cari_kontak.value}`);
      const data = resp.data.data;

      setSearchedUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    io.current = socket();

    io.current.on("connect", () => {
      console.log(io.current.id);
      if (currentUser)
        io.current.emit("join", {
          id: currentUser?.id,
          ioToken: io.current.id,
        });
    });
  }, [currentUser]);

  useEffect(() => {
    io.current.on("receive_users", (data) => {
      setUserio(data);
      console.log(data);
    });
  }, [io]);

  useEffect(() => {
    !currentUser && history.replace("/auth");

    (async (id) => {
      try {
        const resp = await instance.post("/kontak", {
          id: currentUser?.id,
        });
        const _id = resp.data.data.map((_) => _.toId);

        let users = [];
        const _resp = await instance.post("/kontak/detail", {
          id: _id,
        });

        const data = _resp.data.data;

        // userio.map((item) => {
        //   const _item = data.find((_) => _.id === item.id);
        //   if (!_item)
        //     return users.push({ ...currentUser, ioToken: item.token });
        //   users.push({ ..._item, ioToken: item.token });
        // });

        data.map((item) => {
          const _item = userio.find((_) => _.id === item.id);
          if (_item) {
            users.push({ ...item, status: true });
          } else {
            users.push(item);
          }
        });

        const _users = users.filter((item) => item.id !== currentUser?.id);
        setUsers(_users);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [userio]);
  // console.log(users);

  // console.log(users);
  return (
    <Box>
      <Flex height={"100vh"}>
        <VStack
          flex={{ md: 1, base: "unset" }}
          maxW={"96"}
          borderRight={"1px"}
          borderColor={"gray.200"}
        >
          <Box w={"full"} borderBottom={"1px"} borderColor={"gray.200"}>
            <Container maxW={{ md: "container.xl", base: "md" }}>
              <HStack h={14} w={"full"}>
                <HStack>
                  <Avatar size={"sm"} />
                  <Text>{currentUser?.nama}</Text>
                </HStack>
                <Spacer display={{ md: "flex", base: "none" }} />
                <HStack display={{ md: "flex", base: "none" }}>
                  <IconButton
                    icon={<Icon as={BiSearch} fontSize={"xl"} />}
                    rounded={"full"}
                    bgColor={"transparent"}
                    onClick={() => setModal(true)}
                  />
                  <IconButton
                    icon={<Icon as={BiCircle} fontSize={"xl"} />}
                    rounded={"full"}
                    bgColor={"transparent"}
                  />
                  <IconButton
                    icon={<Icon as={BiMenu} fontSize={"xl"} />}
                    rounded={"full"}
                    bgColor={"transparent"}
                  />
                </HStack>
              </HStack>
            </Container>
          </Box>

          <VStack alignItems={"flex-start"} w={"full"}>
            {users.length === 0 && (
              <Center w={"full"}>
                <Text>Anda belum mempunyai kontak.</Text>
              </Center>
            )}
            {users.map((item) => (
              <LinkBox w={"full"}>
                <LinkOverlay
                  as={NavLink}
                  to={`chat/${item.id}`}
                  _activeLink={{ bgColor: "gray.200", rounded: "lg" }}
                  alignItems={"center"}
                  display={"flex"}
                  borderBottom={"1px"}
                  borderColor={"gray.200"}
                  _hover={{ bgColor: "gray.100 " }}
                  h={14}
                  w={"full"}
                  end
                >
                  <Container>
                    <HStack key={item.id}>
                      <Avatar size={"sm"} />
                      <Text display={{ base: "none", md: "block" }}>
                        {item.nama}
                      </Text>
                      <Spacer />
                      {item.status && (
                        <Box
                          w={"5px"}
                          h={"5px"}
                          rounded={"full"}
                          bgColor={"green.400"}
                        />
                      )}
                    </HStack>
                  </Container>
                </LinkOverlay>
              </LinkBox>
            ))}
          </VStack>
        </VStack>

        <Modal isOpen={modal} onClose={() => setModal(false)}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Cari Kontak</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Box as={"form"} onSubmit={searchSubmit}>
                <FormControl>
                  <Input placeholder="Cari Kontak..." name="cari_kontak" />
                </FormControl>
              </Box>
              <VStack my={4} overflowY={"auto"} spacing={2}>
                {searchedUser.map((item) => (
                  <HStack
                    w={"full"}
                    borderBottom={"1px"}
                    borderColor={"gray.200"}
                    py={4}
                  >
                    <Avatar size={"sm"} />
                    <Text>{item.nama}</Text>
                    <Spacer />
                    {!users.find((_item) => _item.id === item.id) &&
                      item.id !== currentUser?.id && (
                        <IconButton
                          // colorScheme={"whatsapp"}
                          icon={<Icon as={BiBookAdd} fontSize={"xl"} />}
                          rounded={"full"}
                          bgColor={"transparent"}
                          onClick={() => tambahKontak(item.id)}
                        />
                      )}
                  </HStack>
                ))}
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button colorScheme="blue" mr={3} onClick={() => setModal(false)}>
                Tutup
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <VStack flex={{ md: 1, base: 1 }} spacing={0}>
          <Outlet />
        </VStack>
      </Flex>
    </Box>
  );
};

export default AppLayout;
