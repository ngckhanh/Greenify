import React, { ReactElement, ReactNode, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon
} from "@chakra-ui/react";
import { Search2Icon } from "@chakra-ui/icons";
import { useRouter } from "next/router";

type SearchInputProps = {
  onSearch: (title: string) => void;
};

const SearchInput: React.FC<SearchInputProps> = ({onSearch}) => {
  const [searchTitle, setSearchTitle] = useState('');
  
  const handleSearch = () => {
    // Call the onSearch function with the searchTitle value
    onSearch(searchTitle);
  };

  return (
      <Flex flexGrow={1} >
        <InputGroup borderRadius={90} alignItems="center" size="sm" bg="#F5F5F5">
        <InputLeftElement
          pointerEvents="none"
          children={<Search2Icon color="gray.600" />}
          m={1}
        />      
          <Input 
            height="40px" 
            type="text" 
            variant="filled" 
            placeholder="Type to search... "  
            value={searchTitle}
            onChange={e => setSearchTitle(e.target.value)}
            />
          <InputRightAddon
            height="auto"
            width="auto"
            p={0}
            border="none"
        >
          <Button 
          height="40px" 

          borderLeftRadius={0} 
          borderRightRadius={3.3} 
          border="1px solid #949494"
          _hover={{
            //transform: 'translateY(-2px)',
            boxShadow: 'lg',
          }}
          onClick={handleSearch}
          >
            Search
          </Button>
          </InputRightAddon>
      </InputGroup>

      </Flex>
      

  
      
  );
};

export default SearchInput;
