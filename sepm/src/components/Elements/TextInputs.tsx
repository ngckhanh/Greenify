import React from "react";
import { Stack, Input, Textarea, Flex, Button, FormControl, FormLabel, Select } from "@chakra-ui/react";

type TextInputsProps = {
  textInputs: {
    title: string;
    tag: string;
    body: string;
  };
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
};

const TextInputs: React.FC<TextInputsProps> = ({
  textInputs,
  onChange,
}) => {
  return (
    <Stack spacing={3} width="100%">
      <FormControl isRequired>
      <FormLabel as ="b">Post title</FormLabel>
      <Input
        name="title"
        value={textInputs.title}
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

      <FormControl isRequired>
        <FormLabel> Tag</FormLabel>
        <Select
       _placeholder={{ color: "gray.500" }}
        name="tag" 
        value={textInputs.tag} 
        onChange={onChange}
        >
          <option value="">Select a tag</option>
          <option value="Air Pollution">Air Pollution</option>
          <option value="Water Contamination">Water Contamination</option>
          <option value="Soil Contamination">Soil Contamination</option>
          <option value="Plastic Pollution">Plastic Pollution</option>
        </Select>
      </FormControl>

      <FormControl isRequired>
        <FormLabel> Contents</FormLabel>
        <Textarea
        name="body"
        value={textInputs.body}
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
};
export default TextInputs;