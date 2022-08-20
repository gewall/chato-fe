import {
  Avatar,
  Box,
  Container,
  Flex,
  FormControl,
  HStack,
  Icon,
  IconButton,
  Input,
  Spacer,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { BiSearch, BiMenu, BiSend } from "react-icons/bi";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { instance, socket } from "../../libs/services";
import { useSelector } from "../../libs/hooks";

const data = [
  {
    id: "2",
    name: "AlgiN",
    message: "Halloasdasd asdasdas da asd asd ad asd asdasdasd ",
  },
  {
    id: "1",
    name: "Jut",
    message: "ebuset dah gitu amat lo blokadas dasdasdadasd asdasdasd",
  },
];

const Chat = () => {
  const { currentUser } = useSelector((state) => state);
  const { id } = useParams();
  const [user, setUser] = useState({});
  const io = useRef();

  const chatBox = useRef(null);

  const [chats, setChats] = useState([]);

  const handleSubmit = async (e) => {
    const data = {};
    data.chat = e.target.pesan.value;
    data.fromId = currentUser?.id;
    data.toId = user.id;
    // console.log(io.current.id);
    io.current?.emit("sendMessage", { data });

    e.target.pesan.value = "";
  };

  useEffect(() => {
    io.current = socket();

    io.current.on("connect", () => {
      // console.log(io.current.id);
      if (currentUser)
        io.current.emit("join", {
          id: currentUser?.id,
          ioToken: io.current.id,
        });
    });

    (async () => {
      try {
        const resp = await instance.get(`/user/${id}`);

        const chats = await instance.post(`/chat/${id}`, {
          fromId: currentUser?.id || "",
        });

        // console.log(chats);
        setUser(resp.data.data);
        setChats(chats.data.chat);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [currentUser, currentUser?.id, id]);

  useEffect(() => {
    io.current?.on("newMessage", async (data) => {
      console.log(data.chat[0].fromId);
      if (
        data.chat[0].fromId.toString() === id ||
        data.chat[0].fromId === currentUser?.id
      )
        setChats([...chats, ...data.chat]);
    });
    chatBox.current?.scrollIntoView({ behavior: "smooth" });
    return () => {
      io.current.off("newMessage", (data) => {
        console.log(data);
      });
    };
  }, [chats, io]);

  // console.log(chats);
  return (
    <>
      <Box w={"full"} borderBottom={"1px"} borderColor={"gray.200"}>
        <Container maxW={{ md: "container.xl", base: "md" }}>
          <HStack height={14}>
            <HStack>
              <Avatar size={"sm"} />
              <Text>{user.nama}</Text>
            </HStack>
            <Spacer />
            <HStack>
              <IconButton
                icon={<Icon as={BiSearch} fontSize={"xl"} />}
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
      <Box bgColor={"gray.50"} flex={1} w={"full"} overflowY={"auto"}>
        <Container maxW={{ md: "container.xl", base: "md" }}>
          <Flex flexDir={"column"}>
            {chats
              ?.sort((a, b) => a.id - b.id)
              .map((_, i) => (
                <Box
                  my={2}
                  maxW={"2xs"}
                  w={"max"}
                  shadow={"md"}
                  rounded={"md"}
                  key={_.id}
                  ml={_.fromId === currentUser?.id ? "auto" : "unset"}
                  mr={_.fromId !== currentUser?.id ? "auto" : "unset"}
                  p={2}
                  bgColor={"white"}
                  position="relative"
                  // zIndex={3}
                  _before={{
                    position: "absolute",
                    content: '""',
                    top: 0,
                    right: _.fromId === currentUser?.id && -2,
                    left: _.fromId !== currentUser?.id && -2,
                    //   shadow: "md",
                    borderLeft:
                      _.fromId !== currentUser?.id && "15px solid transparent",
                    borderRight:
                      _.fromId === currentUser?.id && "15px solid transparent",
                    borderTop: "15px solid white",
                    //   zIndex: -1,
                  }}
                >
                  <VStack alignItems={"flex-start"}>
                    <Text as={"article"}>{_.chat}</Text>
                  </VStack>
                </Box>
              ))}
            <Box ref={chatBox} />
          </Flex>
        </Container>
      </Box>

      <Container maxW={{ md: "container.xl", base: "md" }}>
        <HStack
          borderTop={"1px"}
          borderColor={"gray.200"}
          bgColor={"white"}
          h={14}
          w={"full"}
          flex={1}
        >
          <HStack
            as={"form"}
            display={"flex"}
            w={"full"}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            <FormControl>
              <Input type={"text"} placeholder="Kirim Pesan..." name="pesan" />
            </FormControl>
            <IconButton icon={<Icon as={BiSend} />} type="submit" />
          </HStack>
        </HStack>
      </Container>
    </>
  );
};

export default Chat;
