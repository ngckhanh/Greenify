import React from 'react';
import { Box, Flex } from "@chakra-ui/react";

type EventFormContentProps = {
    maxWidth?: string;
    children?: React.ReactNode; 
};

const EventFormContent:React.FC<EventFormContentProps> = ({
    children,
    maxWidth,
}) => {
    return (
        <Flex justify="center" p="20px 0px" mt="20px">
            <Flex width="100%" justify="center" maxWidth={maxWidth || "900px"}>
                <Flex
                direction="column"
                width={{ base: "100%", md: "75%" }}
                mr={{ base: 0, md: 6 }}
                ml={{ base: 0, md: 6 }}
                >
                {children && children[0 as keyof typeof children]}
                </Flex>
            </Flex>
        </Flex>
    );
};
export default EventFormContent;


