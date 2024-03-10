import { EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
  AvatarBadge,
  Center,
  Flex,
  FormControl,
  IconButton,
  Stack,
} from "@chakra-ui/react";
import React from "react";

type UserImageProps = {
  selectedFile?: string;
  onSelectImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedFile: (value: string) => void;
  selectFileRef: React.RefObject<HTMLInputElement>;
};

const UserImage: React.FC<UserImageProps> = ({
  selectedFile,
  onSelectImage,
  setSelectedFile,
  selectFileRef,
}) => {
  return (
    <Flex justify={"center"} align="center" width="100%">
      <FormControl>
        {selectedFile ? (
          <>
            <Stack direction={["column", "row"]} spacing={6}>
              <Center w="full">
                <Avatar size="xl" src={selectedFile as string} bg="green.400">
                  <AvatarBadge
                    as={IconButton}
                    size="sm"
                    rounded="full"
                    top="-1px"
                    right="5px"
                    colorScheme="teal"
                    aria-label="remove Image"
                    variant="solid"
                    onClick={() => setSelectedFile("")}
                    icon={<EditIcon />}
                    _hover={{ bg: "green.200" }}
                  />
                </Avatar>
              </Center>
            </Stack>
          </>
        ) : (
          <Stack direction={["column", "row"]} spacing={6}>
            <Center w="full">
              <Avatar
                size="xl"
                src="https://bit.ly/sage-adebayo"
                bg="green.400"
              >
                <AvatarBadge
                  as={IconButton}
                  size="sm"
                  rounded="full"
                  top="-1px"
                  right="5px"
                  colorScheme="teal"
                  aria-label="remove Image"
                  variant="solid"
                  icon={<EditIcon />}
                  onClick={() => selectFileRef.current?.click()}
                  _hover={{ bg: "green.200" }}
                />
                <input
                  type="file"
                  ref={selectFileRef}
                  accept="image/x-png,image/gif,image/jpeg"
                  onChange={onSelectImage}
                  hidden
                />
              </Avatar>
            </Center>
          </Stack>
        )}
      </FormControl>
    </Flex>
  );
};

export default UserImage;
