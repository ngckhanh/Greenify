import { GreenActsEvent } from "@/atoms/eventAtoms";
import {
  Stack,
  Flex,
  CardBody,
  Card,
  Text,
  Image,
  Button,
  CardFooter,
  Heading,
  Box,
  VStack,
  Spacer,
} from "@chakra-ui/react";
import { NextRouter } from "next/router";
import React, { useState } from "react";

type EventCardProps = {
  event: GreenActsEvent;
  title: string;
  days: string;
  image: string;
  router?: NextRouter;
  eventIdx?: string;
  onSelectEvent: (event: GreenActsEvent, id: string) => void;
};

const EventCard: React.FC<EventCardProps> = ({
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
      <Card
        direction={{ base: "column", sm: "row" }}
        overflow="hidden"
        variant="outline"
        size="md"
        height="200px" // Fixed height for the card
        p={2}
        justifyContent={"space-between"}
        onClick={() => onSelectEvent && event && onSelectEvent(event, eventIdx!)}
      >
        <Flex 
          direction="row"
          alignItems="center"
        >
            <Box
              width={{ sm: "300px" }} // Fixed width for the image container
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
            
            <VStack p="4" spacing={5} alignItems={"flex-start"}>
              {/* Content area with padding */}
              <Heading size="xl">{title}</Heading>
              <Text py="2">Event date : {days}</Text>
            </VStack>    
        </Flex>

        <Flex alignItems={"flex-end"}>
          <Button
            height="40px"
            display={{ base: "none", sm: "flex" }}
            //variant="outline"
            width={{ base: "70px", md: "110px" }}
            borderRadius="none"
            _hover={{ bg: "#233814" }}
            onClick={() => onSelectEvent && event && onSelectEvent(event, eventIdx!)}
          >
            View
          </Button>
        </Flex>
          
      </Card>
    </>
  );
};
export default EventCard;
