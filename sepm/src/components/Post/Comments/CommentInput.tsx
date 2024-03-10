import React, { MouseEventHandler, useState } from "react";
import { Flex, Textarea, Button, Text } from "@chakra-ui/react";
import { User } from "firebase/auth";
import AuthButtons from "../../Navbar/RightContent/AuthButtons";

type  CommentInputProps = {
    commentText: string;
    setCommentText: (value: string) => void;
    createLoading: boolean;
    user: User;
    onCreateComment: (commentText: string) => void;
};

const  CommentInput:React.FC< CommentInputProps> = ({
    commentText,
    setCommentText,
    createLoading,
    user,
    onCreateComment,
}) => {
    
    return (
        <Flex direction="column" position="relative" mt="7px" >
      {user ? (
        <>
          <Text mb="5px">
            Comment as{" "}
            <span style={{ color: "#3182CE" }}>
              {user?.email?.split("@")[0]} {/*Display as email*/}
              {/*user?.displayName/*}{/*Display as name*/}
            </span>
          </Text>
          <Flex direction="row" position="relative" alignItems="center">
              <Textarea
                bg = {"white"}
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder="Write a comment: "
                fontSize="10pt"
                borderRadius={5}
                minHeight="50px"
                pb={10}
                _placeholder={{ color: "gray.500" }}
                _focus={{
                  outline: "none",
                  bg: "white",
                  border: "1px solid black",
                }}
              />
      
                <Button
                  m ={2}
                  height="30px"
                  justifyContent={'center'}
                  bg={'green.400'}
                  color={'white'}
                  rounded={'md'}
                  _hover={{
                    //transform: 'translateY(-2px)',
                    boxShadow: 'lg',
                  }}
                  disabled={!commentText.length}
                  isLoading={createLoading}
                  onClick={() => onCreateComment(commentText)}
                >
                  Add Comment
                </Button>
              </Flex>
        </>
      ) : (
        <Flex
          align="center"
          justify="space-between"
          borderRadius={2}
          border="1px solid"
          borderColor="gray.100"
          p={4}
        >
          <Text fontWeight={600}>Log in or sign up to leave a comment</Text>
          <AuthButtons />
        </Flex>
      )}
    </Flex>
  );
};
export default  CommentInput;