import { Flex } from '@chakra-ui/react';
import React from 'react';

type AdminPageProps = {
    maxWidth?: string;
    children?: React.ReactNode; 
};

const AdminPage:React.FC<AdminPageProps> = ({
    children,
    maxWidth,
}) => {
    
    return (
        <Flex justify="center" p="20px 0px" mt="20px">
            <Flex width="100%" justify="center" maxWidth={maxWidth || "1500px"}>
                <Flex
                direction="column"
                width={{ base: "100%", md: "100%" }}
                mr={{ base: 0, md: 6 }}
                ml={{ base: 0, md: 6 }}
                >
                {children && children[0 as keyof typeof children]}
                </Flex>
            </Flex>
        </Flex>
    )
}
export default AdminPage;