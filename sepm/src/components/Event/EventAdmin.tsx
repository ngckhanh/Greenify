import { GreenActsEvent } from "@/atoms/eventAtoms";
import {
  Box,
  Card,
  Flex,
  Heading,
  Image,
  Spacer,
  Text,
  VStack
} from "@chakra-ui/react";
import { NextRouter } from "next/router";
import React, { useState } from "react";

type EventAdminProps = {
  event: GreenActsEvent;
  title: string;
  days: string;
  image: string;
  router?: NextRouter;
  eventIdx?: string;
  onSelectEvent: (event: GreenActsEvent, id: string) => void;
};

const EventAdmin: React.FC<EventAdminProps> = ({
  event,
  eventIdx,
  title,
  days,
  image,
  onSelectEvent,
}) => {
  const [loadingImage, setLoadingImage] = useState(true);
  return (
    <>
      <Flex alignItems={"center"} w="full">
        <Card
          direction={{ base: "column", sm: "row" }}
          overflow="hidden"
          size="md"
          height="150px"
          w="full"
          //marginLeft="30px"
          //marginRight={"30px"}
          p={2}
          m={2}
          justifyContent={"space-between"}
          onClick={() =>
            onSelectEvent && event && onSelectEvent(event, eventIdx!)
          }
        >
          <Flex
            direction="row"
            alignItems="center"
            w="100vh"
            justifyContent={"space-between"}
          >
            <VStack p="4" spacing={2} alignItems={"flex-start"}>
              {/* Content area with padding */}
              <Heading size="lg">{title}</Heading>
              <Text>Event date : {days}</Text>
            </VStack>

            <Spacer />
            <Spacer />
            <Spacer />

            <Box
              width={{ sm: "250px" }} // Fixed width for the image container
              height="100%"
              position="relative" // Position relative for the image
            >
              <Image
                objectFit="cover"
                width="100%"
                height="100%"
                src={image}
                display={loadingImage ? "none" : "block"}
                position="absolute" // Absolute position to fill the container
                top="0"
                right="0"
                onLoad={() => setLoadingImage(false)}
                alt="event image"
              />
            </Box>
          </Flex>
        </Card>
      </Flex>
    </>
  );
};
export default EventAdmin;
