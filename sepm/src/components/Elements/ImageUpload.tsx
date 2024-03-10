import { Button, Center, Flex, FormControl, FormLabel, IconButton } from '@chakra-ui/react'
import React from 'react'
import { Image } from '@chakra-ui/react'
import { EditIcon} from '@chakra-ui/icons';

type ImageUploadProps = {
    selectedFile?: string;
    onSelectImage: (event: React.ChangeEvent<HTMLInputElement>) => void;
    setSelectedFile: (value: string) => void;
    selectFileRef: React.RefObject<HTMLInputElement>;
}

const ImageUpload:React.FC<ImageUploadProps> = ({selectedFile, 
onSelectImage, 
setSelectedFile, 
selectFileRef}) => {

  return (
    <Flex justify={'center'} align='center' width="100%">
         <FormControl>
        <FormLabel mt="15px"> Image</FormLabel>
    {selectedFile ? (
        <>
        <Center width="full" >
          <Image
            src={selectedFile as string}
            maxWidth="400px"
            maxHeight="400px"
          />
          <IconButton
             mt="-140px"
             ml={-12}
              colorScheme='white'
              aria-label='Send email'
              icon={<EditIcon />}
              onClick={() => setSelectedFile("")}
              _hover={{bg: 'green.200'}}
              />
          </Center>
        </>
      ) : ( 

        <Flex 
    justify={'center'}
    align="center"
    p={20}
    border="1px dashed"
    borderColor="gray.200"
    width="100%"
    borderRadius={4}>
    <Button 
    variant={'outline'} 
    onClick={()=> selectFileRef.current?.click()}
    >
        Upload
    </Button>
    <input type="file" 
    ref={selectFileRef} 
    accept="image/x-png,image/gif,image/jpeg"
    onChange={onSelectImage} 
    hidden
    />
    </Flex>
        )}
        </FormControl>
    </Flex>
  )
}

export default ImageUpload