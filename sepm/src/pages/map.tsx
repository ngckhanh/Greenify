import {
  Box,
  Flex,
  Center,
  Input,
  ButtonGroup,
  Button,
  ListItem,
  List,
  ListIcon,
  Link,
} from "@chakra-ui/react";
import { Component } from "react";
import MapGL, { ViewportProps } from "@goongmaps/goong-map-react";
import { IoLocationSharp } from "react-icons/io5";
import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import SuperClusterAlgorithm from "../utils/superClusterAlgorithm";
import { auth, firestore } from "../firebase/clientApp";
import { useAuthState } from "react-firebase-hooks/auth";
import { doc, getDoc, setDoc, collection, getDocs } from "firebase/firestore";
import { addMarkers } from "./CreateMapPin";

const api = "AIzaSyBwxLljHEtQ9cLzrRDfkTXn2J97cmK6G-c";

export default function map() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: api,
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading...</div>;
  return (
    <>
      <Flex justify="center">
        <Box marginTop="2rem" marginLeft="auto" marginRight="auto">
          <Map />
        </Box>
      </Flex>
    </>
  );
}

function Map() {
  const [user, loading, error] = useAuthState(auth);
  const [inputValue, setInputValue] = useState("");
  const [resultValue, setResultValue] = useState("");
  const [center, setCenter] = useState({
    lat: 0,
    lng: 0,
  });
  const [selected, setSelected] = useState({ lat: 0, lng: 0 });
  const [pins, setPins] = useState([]);
  const mapRef = React.useRef(null);

  const onLoad = useCallback(
    (map) => addMarkers((mapRef.current = map), pins),

    [pins]
  );

  const {
    suggestions: { data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setValue(event.target.value);
  };

  const handleButtonClick = async () => {
    const results = await getGeocode({ address: inputValue });
    setResultValue(
      results[0].address_components[0].long_name +
        " " +
        results[0].address_components[1].long_name +
        " " +
        results[0].address_components[2].long_name +
        " " +
        results[0].address_components[3].long_name
    );
    console.log(
      results[0].address_components[0].long_name +
        " " +
        results[0].address_components[1].long_name +
        " " +
        results[0].address_components[2].long_name +
        " " +
        results[0].address_components[3].long_name
    );
    const { lat, lng } = await getLatLng(results[0]);
    setSelected({ lat, lng });
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(15);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputValue(suggestion.description);
    clearSuggestions();
  };
   const fetchDataFromFirestore = async () => {
     const pinsCollectionRef = collection(firestore, "pins");
     const querySnapshot = await getDocs(pinsCollectionRef);

     const newPins = []; // Create an array to accumulate the new pins

     // querySnapshot.forEach((doc) => {
     //   const createdAtTimestamp = doc.data().createdAt; // Assuming createdAt holds the Firestore timestamp
     //   const createdAtDate = createdAtTimestamp.toDate(); // Convert Firestore Timestamp to JavaScript Date object
     //   newPins.push({
     //     type: doc.data().type,
     //     address: doc.data().address,
     //     lat: doc.data().lat,
     //     lng: doc.data().lng,
     //     desc: doc.data().desc,
     //     createdAt: doc.data().createdAtDate,
     //   });
     // });

     querySnapshot.forEach((doc) => {
       const createdAtTimestamp = doc.data().createdAt; // Assuming createdAt holds the Firestore timestamp

       if (
         createdAtTimestamp &&
         typeof createdAtTimestamp.toDate === "function"
       ) {
         const createdAtDate = createdAtTimestamp.toDate(); // Convert Firestore Timestamp to JavaScript Date object

         // Extract date components
         const year = createdAtDate.getFullYear(); // Get the year (e.g., 2023)
         const month = createdAtDate.getMonth() + 1; // Get the month (0-11), adding 1 to match 1-12
         const day = createdAtDate.getDate(); // Get the day of the month (1-31)

         // Formatting month and day to ensure they have two digits if needed (e.g., 01 instead of 1)
         const formattedMonth = month < 10 ? `0${month}` : `${month}`;
         const formattedDay = day < 10 ? `0${day}` : `${day}`;

         const formattedDate = `${formattedDay}-${formattedMonth}-${year}`; // Date in YYYY-MM-DD format

         newPins.push({
           type: doc.data().type,
           address: doc.data().address,
           lat: doc.data().lat,
           lng: doc.data().lng,
           desc: doc.data().desc,
           createdAt: formattedDate,
           imageURL: doc.data().imageURL, // Store the formatted date in your newPins array or object
         });
       } else {
         console.error("Error converting timestamp to date.");
       }
     });

     // Update the pins state outside the loop with all the collected pins
     setPins([...newPins]);
   };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCenter({ lat: latitude, lng: longitude });
          mapRef.current.panTo({ lat: latitude, lng: longitude }); // Use latitude and longitude here
          mapRef.current.setZoom(15);
        },
        (error) => {
          console.log("Error getting current location:", error);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    fetchDataFromFirestore();
  }, []);
  useEffect(() => {
    if (mapRef.current && pins.length > 0) {
      addMarkers(mapRef.current, pins);
    }
  }, [pins]);

  return (
    <>
      <Flex position="relative" zIndex={2}>
        <Input
          placeholder="Enter address"
          size="sm"
          bg="white"
          width="500px"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
        />

        <Button
          variant="search"
          marginLeft="10px"
          onClick={handleButtonClick}
          id="search_button"
        >
          Search
        </Button>
        {user ? (
          <Link href="/CreateMapPin" ml="auto">
            <Button
              variant="create_pin"
              marginLeft="10px"
              ml="auto"
              width="170px"
            >
              Create new trash pin
            </Button>
          </Link>
        ) : (
          false
        )}
      </Flex>

      {/* Render the suggestions */}
      <Flex
        position="absolute"
        paddingLeft={"5px"}
        top="calc(14% )" // Positions the list below the search bar
        bg="white"
        width="40%"
        zIndex={1} // Adjust z-index to ensure the list is above the map
        borderRadius={"5px"}
      >
        {data && data.length > 0 && (
          <List spacing={3}>
            {data.map((suggestion, index) => (
              <ListItem
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                cursor="pointer"
              >
                <ListIcon
                  as={IoLocationSharp}
                  color="gray.500"
                  marginBottom={"3px"}
                />
                {suggestion.description}
              </ListItem>
            ))}
          </List>
        )}
      </Flex>

      <Flex width={"80vw"} height={"80vh"} marginTop={"15px"}>
        <GoogleMap
          zoom={10}
          center={center}
          mapContainerStyle={{ width: "100%", height: "100%" }}
          onLoad={onLoad}
          options={{
            mapTypeControl: false,
          }}
        >
          {selected.lat !== 0 && <Marker position={selected} />}
        </GoogleMap>
      </Flex>
    </>
  );
}

