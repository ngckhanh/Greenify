import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Input,
  List,
  ListIcon,
  ListItem,
  Text,
  Textarea,
  VStack
} from "@chakra-ui/react";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import {
  Timestamp,
  collection,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { IoLocationSharp } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import ImageUploadMap from "../components/Elements/ImageUploadMap";
import { auth, firestore, storage } from "../firebase/clientApp";
import SuperClusterAlgorithm from "../utils/superClusterAlgorithm";

const api = "AIzaSyBwxLljHEtQ9cLzrRDfkTXn2J97cmK6G-c";

function Notification() {
  return (
    <>
      <div>You need to login</div>
    </>
  );
}

function Map() {
  const [inputValue, setInputValue] = useState("");
  const [resultValue, setResultValue] = useState("");
  const [center, setCenter] = useState({
    lat: 0,
    lng: 0,
  });
  const [selected, setSelected] = useState({ lat: 0, lng: 0 });
  const [pins, setPins] = useState([]);
  const mapRef = React.useRef(null);
  const [desc, setDesc] = useState("");

  const selectFileRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<string>();

  const onLoad = useCallback(
    (map) => addMarkers((mapRef.current = map), pins),
    [pins]
  );

  const {
    suggestions: { data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete();

  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }
    reader.onload = (e) => {
      setSelectedFile(e.target?.result as string);
    };
  };

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

  const fetchDataFromFirestore = async () => {
    const pinsCollectionRef = collection(firestore, "pins");
    const querySnapshot = await getDocs(pinsCollectionRef);

    const newPins = []; // Create an array to accumulate the new pins

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
    if (mapRef.current && pins.length > 0) {
      addMarkers(mapRef.current, pins);
    }
  }, [pins]);
  useEffect(() => {
    fetchDataFromFirestore();
  }, []);

  const handleCreatePin = async () => {
    try {
      const pinDocRef = doc(firestore, "pins", inputValue);
      const pinDoc = await getDoc(pinDocRef);

      if (pinDoc.exists()) {
        // Handle the case where the pin document already exists
        // For example, set an error or take appropriate action
      } else {
        await setDoc(pinDocRef, {
          type: "Trash",
          address: inputValue,
          lat: selected.lat,
          lng: selected.lng,
          desc: desc,
          createdAt: serverTimestamp() as Timestamp,
        });
        toast.success("New trash pin created successfully!", {
          position: toast.POSITION.TOP_CENTER,
          autoClose: 4000, // Close the notification after 3 seconds (adjust as needed)
        });
      }

      try {
        //Check for selectedFile
        if (selectedFile) {
          //8.
          //store in storage => getDownloadURL(return imageURL)
          const imageRef = ref(storage, `posts/${pinDocRef.id}/image`);
          //This is the reference to the image in the storage
          //postDocRef.id is the id of the post doc in firestore
          //image is the name of the image in the storage
          //This is the path to the image in the storage

          await uploadString(imageRef, selectedFile, "data_url");
          //This uploads the image to the storage
          //selectedFile is the image in base64 format
          //data_url is the format of the image

          const imageURL = await getDownloadURL(imageRef);
          //This gets the downloadURL of the image from the storage

          //8.
          //Update post doc by adding imageURL
          await updateDoc(pinDocRef, { imageURL });
          //This updates the post doc in firestore by adding imageURL
          //postDocRef is the reference to the post doc in firestore
          //imageURL is the downloadURL of the image
        }
      } catch (error: any) {
        console.log("Error creating post", error.message);
        // setError(true);
      }
      await fetchDataFromFirestore();
      setInputValue("");
      setDesc("");
      setSelectedFile("");
    } catch (error) {
      // Handle and display error messages to the user
      console.error("Error creating pin:", error.message);
      toast.error("Failed to create pin. Please try again.", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 3500,
      });
    }
  };
  return (
    <>
      <Flex justify="center" marginTop="30px">
        <Text fontWeight="bold" fontSize="25px">
          Create new trash pin
        </Text>
      </Flex>
      <ToastContainer />

      <VStack spacing="5px">
        <Flex justify="center">
          <Grid templateColumns="2fr 1fr" gap={10} marginTop="1rem">
            <GridItem>
              <Box>
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
                </Flex>

                {/* Render the suggestions */}
                <Flex
                  position="absolute"
                  paddingLeft={"5px"}
                  top="calc(21% )" // Positions the list below the search bar
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

                <Flex width={"53vw"} height={"63vh"} marginTop={"15px"}>
                  <GoogleMap
                    zoom={10}
                    center={center}
                    mapContainerStyle={{ width: "100%", height: "100%" }}
                    onLoad={onLoad}
                    options={{
                      mapTypeControl: false,
                      // Other options you want to set can be included here
                    }}
                  >
                    {selected.lat !== 0 && <Marker position={selected} />}
                  </GoogleMap>
                </Flex>
              </Box>
            </GridItem>
            <GridItem marginTop="13px">
              <Text fontWeight="bold" marginBottom="10px">
                Add Descriptions
              </Text>
              <Textarea
                placeholder="Enter description"
                size="md"
                bg="white"
                width="100%"
                height="300px"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
              {/* <Text fontWeight="bold" marginTop="20px">
              Add Images
            </Text>
            <Input
              type="file"
              multiple
              onChange={handleImageUpload}
              border="none"
              width="300px"
              marginTop="10px"
              padding="1px"
            /> */}
              <ImageUploadMap
                selectedFile={selectedFile}
                onSelectImage={onSelectImage}
                setSelectedFile={setSelectedFile}
                selectFileRef={selectFileRef}
              />
            </GridItem>
          </Grid>
        </Flex>

        <Flex justify="center">
          <Button
            variant="create_pin"
            height="50px"
            width="90px"
            onClick={handleCreatePin}
            mb="10px"
          >
            Create
          </Button>
        </Flex>
      </VStack>
    </>
  );
}

export function addMarkers(map, pins) {
  const infoWindow = new google.maps.InfoWindow();

  const trashIcon = {
    url: "https://media.discordapp.net/attachments/736546473805742201/1181515748506607648/Group_380.png?ex=65815749&is=656ee249&hm=8e5ada39ec51de0e1fb2c136c4f5ec6ab03d65603465d7229d61a700ba47b2e6&=&format=webp&quality=lossless&width=110&height=124", // Replace with the URL of your custom icon image
    scaledSize: new google.maps.Size(50, 50), // Adjust the size as needed
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(20, 40), // Adjust anchor point if needed
  };

  const eventIcon = {
    url: "https://cdn.discordapp.com/attachments/736546473805742201/1181530996747800606/Group_379.png?ex=6581657d&is=656ef07d&hm=975d98c82eeeb7f1a600fc0227b9897f8d6060681f542e2beb5db59958383621&", // Replace with the URL of your custom icon image
    scaledSize: new google.maps.Size(50, 50), // Adjust the size as needed
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(20, 40), // Adjust anchor point if needed
  };

  const markers = pins.map((pin) => {
    const { type, address, lat, lng, desc, imageURL, createdAt } = pin;

    const marker = new google.maps.Marker({
      position: { lat, lng },
      icon: type === "Trash" ? trashIcon : eventIcon,
      map: map,
    });

    marker.addListener("click", () => {
      infoWindow.setPosition({ lat, lng });
      infoWindow.setContent(`
        <div class="info-window" style="width: 400px; height: 350px; ">
          <h2 style="padding-bottom: 10px; font-weight: bold" >Address: ${address}</h2>
          <h3 style="font-weight: bold" >Description: ${desc}</h3>
          <br>
          <h4 style="font-weight: bold" >Date: ${createdAt}</h4>
          <!-- Add any additional content you want to display in the info window -->
          <br>
          <img src=${imageURL} alt="" style="width: 400px; height: 300px; "/>
        </div>
      `);
      infoWindow.open({ map });
    });

    return marker;
  });

  new MarkerClusterer({
    markers,
    map,
    algorithm: new SuperClusterAlgorithm({ radius: 100 }),
  });
}

const createMapPin = () => {
  const [user, loading, error] = useAuthState(auth);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: api,
    libraries: ["places"],
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <>{user ? <Map /> : <Notification />}</>;
};
export default createMapPin;
