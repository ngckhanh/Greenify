import { BsArrowDown, BsArrowUp, BsFillReplyFill } from "react-icons/bs";

import {
    Box,
    Button,
    Container,
    IconButton,
    Image,
    Stack,
    Text
} from "@chakra-ui/react";
import React from "react";

type DetailPostProps = {};

const DetailPost: React.FC<DetailPostProps> = () => {
  return (
    <>
      <Container
        maxW="1340px" //width of the container
        bg={"rgb(236 242 217) 100%"}
        //alignItems="center"
        //justifyContent="center"
      >
        <Container
          //justifyContent="center"
          //alignItems="center"
          //mt={2}
          mb={3}
          bg={"white"}
          height={"-moz-min-content"}
          //maxW="840px"
          //height={600}
        >
          <Stack
            id="vote_content"
            mt={2}
            direction={"row"}
            as={Box}
            justifyContent="center"
            textAlign={"center"}
          >
            <Stack
              id="left column"
              mt={3}
              //ml={3}
              alignItems="center"
              direction={"column"}
            >
              <IconButton
                id="upvoteBtn"
                bg={"0%"}
                icon={<BsArrowUp />}
                aria-label={""}
              ></IconButton>
              <Text //as={'span'}
                color={"black"}
                fontWeight={"bold"}
                alignContent={"center"}
              >
                7
              </Text>
              <IconButton
                id="downvoteBtn"
                bg={"0%"}
                icon={<BsArrowDown />}
                aria-label={""}
              ></IconButton>
            </Stack>

            <Stack
              id="right column"
              mt={3}
              //ml={3}
              alignItems={"flex-start"}
              justifyContent={"left"}
              direction={"column"}
            >
              <Stack
                id="Post_title"
                direction={"column"}
                //alignItems="flex-start"
              >
                <Text fontSize={"md"} fontWeight={"bold"} textAlign={"left"}>
                  The US map ranking countries to travel based on safeness. It's
                  refreshing to see Vietnam being considered even safer than
                  Sweden, France, Germany, Italy and Spain.
                </Text>

                <Stack direction={"row"}>
                  <Text fontSize={"sm"} fontWeight={"semibold"}>
                    {" "}
                    Person K{" "}
                  </Text>
                  <Text fontSize={"sm"} fontWeight={"semibold"}>
                    {" "}
                    Wed Oct 11 2023
                  </Text>
                </Stack>
              </Stack>

              <Container bg={"rgb(217 217 217 / 70%)"}>
                <Box m={2} alignItems="flex" bg={"white"} color={"black"}>
                  <Image
                    src="https://i.redd.it/onk58e43s3xb1.png"
                    //width={500}
                    //height={500}
                    alt="post_example"
                  />
                </Box>
              </Container>

              <Container mt={2} color={"black"}>
                <Text textAlign={"left"}>
                  Recently, I broached the issue. We agreed to go to a
                  restaurant, but I would meet her at her place before doing so
                  (in the past, we have usually just met directly at the place
                  or met at her's and gone around there). Since I don't have a
                  motorbike (I don't trust my driving skills in this traffic),
                  that meant GrabCar. When she asked if we could meet at her's
                  and go together, I said sure, we could get a GrabCar and split
                  the cost (I pay the way there, she pays the way back - she
                  lives near me).
                </Text>
              </Container>

              <Container id="comment_container">
                <Text textAlign={"left"}>Comments:</Text>
                <Container
                  mt={2}
                  mb={1}
                  id="first_comment"
                  alignContent={"center"}
                >
                  <Box
                    //maxW="1340px"
                    bg={"rgb(217 217 217 / 70%)"}
                    color={"black"}
                  >
                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Text> Puc </Text>
                      <Text> Wed Oct 11 2023 </Text>
                    </Stack>

                    <Box
                      ml={2}
                      mt={2}
                      alignContent={"center"}
                      justifyContent={"left"}
                    >
                      <Text m={2} textAlign={"left"}>
                        {" "}
                        Japan is the same way.. and I don’t understand how these
                        passport bros want Asian women but then expect western
                        standards of dating lolol. If you are trying to find an
                        Asian or latina in their home countries expect to pay up
                      </Text>
                    </Box>
                    <Stack mt={2} direction={"row"} alignItems={"center"}>
                      <IconButton
                        id="upvoteBtn"
                        bg={"0%"}
                        icon={<BsArrowUp />}
                        aria-label={""}
                      ></IconButton>

                      <Text //as={'span'}
                        color={"black"}
                        fontWeight={"bold"}
                      >
                        7
                      </Text>

                      <IconButton
                        id="downvoteBtn"
                        bg={"0%"}
                        icon={<BsArrowDown />}
                        aria-label={""}
                      ></IconButton>

                      <Button bg={"0%"} leftIcon={<BsFillReplyFill />}>
                        Reply
                      </Button>
                    </Stack>
                  </Box>
                </Container>

                <Container
                  mt={2}
                  mb={1}
                  id="second_comment"
                  alignContent={"center"}
                >
                  <Box
                    //maxW="1340px"
                    bg={"rgb(217 217 217 / 70%)"}
                    color={"black"}
                  >
                    <Stack direction={"row"} justifyContent={"space-between"}>
                      <Text> Kanh </Text>
                      <Text> Wed Oct 11 2023 </Text>
                    </Stack>

                    <Box
                      ml={2}
                      mt={2}
                      alignContent={"center"}
                      justifyContent={"left"}
                    >
                      <Text m={2} textAlign={"left"}>
                        {" "}
                        If you are trying to find an Asian or latina in their
                        home countries expect to pay up
                      </Text>
                    </Box>
                    <Stack mt={2} direction={"row"} alignItems={"center"}>
                      <IconButton
                        id="upvoteBtn"
                        bg={"0%"}
                        icon={<BsArrowUp />}
                        aria-label={""}
                      ></IconButton>

                      <Text //as={'span'}
                        color={"black"}
                        fontWeight={"bold"}
                      >
                        6
                      </Text>

                      <IconButton
                        id="downvoteBtn"
                        bg={"0%"}
                        icon={<BsArrowDown />}
                        aria-label={""}
                      ></IconButton>

                      <Button bg={"0%"} leftIcon={<BsFillReplyFill />}>
                        Reply
                      </Button>
                    </Stack>
                  </Box>

                  <Container
                    mt={2}
                    mb={1}
                    id="reply_second_comment"
                    alignContent={"center"}
                  >
                    <Box
                      //maxW="1340px"
                      //m={5}
                      bg={"rgb(217 217 217 / 70%)"}
                      color={"black"}
                    >
                      <Stack direction={"row"} justifyContent={"space-between"}>
                        <Text> Bim </Text>
                        <Text> Thurs Oct 12 2023 </Text>
                      </Stack>

                      <Box
                        id="Box_text"
                        ml={2}
                        mt={2}
                        alignContent={"center"}
                        justifyContent={"left"}
                      >
                        <Text m={2} textAlign={"left"}>
                          {" "}
                          Say that again if ever you get married :
                        </Text>
                      </Box>
                      <Stack mt={2} direction={"row"} alignItems={"center"}>
                        <IconButton
                          id="upvoteBtn"
                          bg={"0%"}
                          icon={<BsArrowUp />}
                          aria-label={""}
                        ></IconButton>

                        <Text //as={'span'}
                          color={"black"}
                          fontWeight={"bold"}
                        >
                          1
                        </Text>

                        <IconButton
                          id="downvoteBtn"
                          bg={"0%"}
                          icon={<BsArrowDown />}
                          aria-label={""}
                        ></IconButton>

                        <Button bg={"0%"} leftIcon={<BsFillReplyFill />}>
                          Reply
                        </Button>
                      </Stack>
                    </Box>
                  </Container>
                </Container>
              </Container>
            </Stack>
          </Stack>
        </Container>

        <Stack
          direction={"row"}
          justifyContent={"space-around"}
          alignItems={"center"}
        >
          <Text>Write a comment</Text>
          <Button
            id="AddCommentBtn"
            width={150}
            fontSize={"sm"}
            //rounded={'full'}
            color={"white"} //color of the font
            bg={"black"} //color of the background
          >
            Add Comment
          </Button>
        </Stack>
      </Container>
    </>
  );
};
export default DetailPost;
