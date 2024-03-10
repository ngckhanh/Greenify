import {
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
} from "@chakra-ui/react";
import React from "react";
import { Image } from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";

type ImageUploadMapProps = {
  selectedFile?: string;
  onSelectImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  setSelectedFile: (value: string) => void;
  selectFileRef: React.RefObject<HTMLInputElement>;
};

const ImageUploadMap: React.FC<ImageUploadMapProps> = ({
  selectedFile,
  onSelectImage,
  setSelectedFile,
  selectFileRef,
}) => {
  return (
    <Flex justify={"center"} align="center" width="100%">
      <FormControl>
        <FormLabel mt="15px"> Add Image</FormLabel>
        {selectedFile ? (
          <>
            <Flex>
              <Image
                src={selectedFile as string}
                width={"100%"}
                height={"100%"}
                maxWidth="500px"
                maxHeight="250px"
              />
              <IconButton
                marginLeft={"10px"}
                colorScheme="white"
                aria-label="Send email"
                icon={<EditIcon />}
                onClick={() => setSelectedFile("")}
                _hover={{ bg: "green.200" }}
              />
            </Flex>
          </>
        ) : (
          <Flex
            justify={"center"}
            align="center"
            p={20}
            border="1px dashed"
            borderColor="gray.400"
            width="100%"
            height={"90%"}
            borderRadius={4}
          >
            <Button
              variant={"outline"}
              onClick={() => selectFileRef.current?.click()}
            >
              Upload
            </Button>
            <input
              type="file"
              ref={selectFileRef}
              accept="image/x-png,image/gif,image/jpeg"
              onChange={onSelectImage}
              hidden
            />
          </Flex>
        )}
      </FormControl>
    </Flex>
  );
};

export default ImageUploadMap;
