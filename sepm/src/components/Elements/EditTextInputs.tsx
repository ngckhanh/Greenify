import React from "react";
import { Stack, Input, Textarea, Flex, Button, FormControl, FormLabel, Select } from "@chakra-ui/react";

type EditTextInputsProps = {
    editTextInputs: {
        title: string;
        tag: string;
        body: string;    
};
    onChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => void;
};

const EditTextInputs:React.FC<EditTextInputsProps> = ({
    editTextInputs,
    onChange,
}) => {
    return (
      <Stack spacing={3} width="100%">
      <FormControl isRequired>
      <FormLabel as ="b">Post title</FormLabel>
      <Input
        name="title"
        value={editTextInputs.title}
        onChange={onChange}
        _placeholder={{ color: "gray.500" }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "black",
        }}
        fontSize="10pt"
        borderRadius={4}
        placeholder="Title"
      />
      </FormControl>

      <FormControl>
        <FormLabel> Tag</FormLabel>
        <Select
       _placeholder={{ color: "gray.500" }}
        name="tag" 
        value={editTextInputs.tag} 
        onChange={onChange}
        >
          <option value="">Select a tag</option>
          <option value="United Arab Emirates">United Arab Emirates</option>
          <option value="Nigeria">Nigeria</option>
        </Select>
      </FormControl>

      <FormControl isRequired>
        <FormLabel> Contents</FormLabel>
        <Textarea
        name="body"
        value={editTextInputs.body}
        onChange={onChange}
        fontSize="10pt"
        placeholder="Text (optional)"
        _placeholder={{ color: "gray.500" }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "black",
        }}
        height="100px"
      />
      </FormControl>
    </Stack>
    );
}
export default EditTextInputs;