import { Box, Flex } from "@chakra-ui/react";

type ForumContentProps = {
    maxWidth?: string;
    children?: React.ReactNode; 
};

const ForumContent:React.FC<ForumContentProps> = ({
    children,
    maxWidth,
}) => {
    return (<Flex justify="center" p="20px 0px" mt="20px">
    <Flex width="95%" justify="center" maxWidth={maxWidth || "860px"}>
    <Flex
      direction="column"
      width={{ base: "100%", md: "80%" }}
      mr={{ base: 0, md: 6 }}
      ml={{ base: 0, md: 6 }}
    >
      {children && children[0 as keyof typeof children]}
    </Flex>
  </Flex>
</Flex>
);
};
export default ForumContent;