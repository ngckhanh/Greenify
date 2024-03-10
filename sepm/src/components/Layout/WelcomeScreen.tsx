import React from 'react';
import { Box, Flex } from "@chakra-ui/react";

type WelcomeScreenProps = {
    maxWidth?: string;
    children?: React.ReactNode;
};

const WelcomeScreen:React.FC<WelcomeScreenProps> = ({
    children,
    maxWidth,
}) => {
    
    return (
        <Flex justify="center" align="center" p="20px 0px" mt="20px">
            <Flex direction="column" width={{ base: "100%", md: "60%" }} maxWidth={maxWidth || "860px"}>
                {children && children[0 as keyof typeof children]}
            </Flex>
        </Flex>
    );
};
export default WelcomeScreen;