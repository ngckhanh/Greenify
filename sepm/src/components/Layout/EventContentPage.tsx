import React from 'react';
import { Box, Flex } from "@chakra-ui/react";

type EventContentPageProps = {
    maxWidth?: string;
    children?: React.ReactNode; 
};

const EventContentPage:React.FC<EventContentPageProps> = ({
    children,
    maxWidth,
}) => {  
    return (
        <Flex justify="center" p="20px 0px" mt="10px">
            <Flex width="100%" justify="center" maxWidth={maxWidth || "1500px"}>
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
export default EventContentPage;