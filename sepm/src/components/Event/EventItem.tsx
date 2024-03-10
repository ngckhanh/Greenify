import React, { useState } from "react";

import { GreenActsEvent } from "@/atoms/eventAtoms";
import {
  Box,
  Flex,
  HStack,
  Heading,
  Image,
  Skeleton,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { NextRouter } from "next/router";

type EventItemProps = {
  event: GreenActsEvent;
  title: string;
  days: string;
  image: string;
  description: string;
  location: string;
  router?: NextRouter;
  eventIdx?: string;
  onSelectEvent: (event: GreenActsEvent, id: string) => void;
};

const EventItem: React.FC<EventItemProps> = ({
  event,
  eventIdx,
  title,
  days,
  image,
  description,
  location,
  onSelectEvent,
}) => {
  const [loadingImage, setLoadingImage] = useState(true);
  return (
    <>
      <Flex
      direction={"column"}
      p={10}
      bg="white"
      borderRadius={4}
      _hover={{ borderColor: "#233814" }}
      cursor="pointer"
      onClick={() =>
          onSelectEvent && event && onSelectEvent(event, eventIdx!)
      }>
        <Stack direction={"row"} spacing={4}>
          {image && (
            <Flex justify="center" align="center">
              {loadingImage && (
                <Skeleton height="200px" width="100%" borderRadius={4} />
              )}
              <Image
                maxHeight="460px"
                src={image}
                // borderRadius={4}
                borderColor={"green.500"}
                display={loadingImage ? "none" : {}}
                onLoad={() => setLoadingImage(false)}
                alt="Post Image"
                border="1px solid"
              />
            </Flex>
          )}

          <VStack justifyContent={"space-between"} alignItems={"flex-start"}>
            <Text py="2">
              Event date : {days}
            </Text>

            <Heading 
              size="lg"> {title} 
            </Heading>
          </VStack>

        </Stack>

        <VStack mt={4} fontSize={18} spacing={5} fontWeight={400} alignItems={"flex-start"}>
          <Flex direction={"column"}>
            <Text fontWeight={600}>
              Description: 
            </Text>
            <Text mt={2}>
              {description}
            </Text>
          </Flex>
        
          <HStack w="full" alignItems="center" justifyContent={"space-between"}>
            <Text fontWeight={600} display="inline"fontSize={18}>
              Event location:
            </Text>
            <Box
              backgroundColor={"#ECF2D9"}
              display="flex"
              justifyContent={"center"}
              alignItems={"center"}
              width={"70%"}
              p={2}
            >
              <Text fontSize={18}>
                {location}
              </Text>
            </Box>
          </HStack>
        </VStack>
      </Flex>
    </>
  );
};
export default EventItem;