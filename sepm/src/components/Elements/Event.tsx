import { auth, firestore, storage } from "@/firebase/clientApp";
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Progress,
  Stack,
  Textarea,
  useToast,
  VStack,
  Grid,
  GridItem,
  ListItem,
  List,
  ListIcon,
  Text,
  Link,
  IconButton,
} from "@chakra-ui/react";

import { getDownloadURL, ref, uploadString } from "firebase/storage";
import React, {
  ChangeEvent,
  SyntheticEvent,
  useEffect,
  useState,
  useCallback,
} from "react";
import { ReactDatePickerProps } from "react-datepicker";
import Calendar from "./Calendar";
import TimePicker from "./TimePicker";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Timestamp,
  doc,
  getDoc,
  setDoc,
  addDoc,
  collection,
  getDocs,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { addMarkers } from "../../pages/CreateMapPin";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { useAuthState } from "react-firebase-hooks/auth";
import { IoLocationSharp } from "react-icons/io5";
import EventFormContent from "../Layout/EventFormContent";
import { ArrowBackIcon } from "@chakra-ui/icons";
import NotFound from "./NotFound";
import LoadingPage from "./LoadingPage";

export interface EventProps {
  title: string;
  description: string;
  image: string;
  days: string;
  time: string;
  location: string;
}

interface Form1Props {
  imageChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  change: (e: ChangeEvent<HTMLInputElement>) => void;
  textAreaChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
}

interface Form2Props {
  startDate: Date | null;
  handleDateChange: (date: Date, event: SyntheticEvent<any, Event>) => void;
}

const Form1: React.FC<Form1Props> = ({
  change,
  textAreaChange,
  imageChange,
}) => {
  return (
    <>
      <Heading textAlign="center" fontWeight="bold" mb="2%">
        Add an Event
      </Heading>

      <Stack spacing={5} mt={3}>
        <FormControl isRequired>
          <FormLabel htmlFor="title" fontWeight="normal">
            Title
          </FormLabel>
          <Input
            name="title"
            id="title"
            placeholder="Enter title"
            onChange={change}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel htmlFor="image" fontWeight="normal">
            Upload Image
          </FormLabel>
          <Flex justifyItems={"center"}>
          <Input type="file" id="image" onChange={imageChange}  justifyItems={"center"}/>
          </Flex>
          
          {/* <Image src="https://i.pinimg.com/736x/f2/2e/8c/f22e8c11146d18d999533f7a37cc13f0.jpg" boxSize="150px" alt="image" /> */}
        </FormControl>
        <FormControl isRequired>
          <FormLabel htmlFor="description" fontWeight="normal">
            Description
          </FormLabel>
          <Textarea
            id="description"
            placeholder="Enter description"
            onChange={textAreaChange}
          />
        </FormControl>
      </Stack>
    </>
  );
};

const Form2: React.FC<Form2Props> = ({ startDate, handleDateChange }) => {
  return (
    <>
      <Heading textAlign="center" fontWeight="bold" mb="2%">
        Event Details
      </Heading>
      <Stack>
        <HStack spacing={14} alignItems={"center"} >
          <Box>
            <FormControl isRequired>
              <FormLabel htmlFor="start-at" fontWeight="normal">
                Select a day
              </FormLabel>
              <Calendar
                startDate={startDate}
                handleDateChange={handleDateChange}
              />
            </FormControl>
          </Box>
          <Box>
            <FormControl isRequired>
              <FormLabel htmlFor="select-day" fontWeight="normal">
                Start at
              </FormLabel>
              <TimePicker
                startDate={startDate}
                handleDateChange={handleDateChange}
              />
            </FormControl>
          </Box>
        </HStack>
      </Stack>
      <FormControl isRequired>
        <FormLabel htmlFor="location" fontWeight="normal">
          Location
        </FormLabel>
        {/* Add the GoogleMap component */}
      </FormControl>
    </>
  );
};


export default function Event() {
  const api = "AIzaSyBwxLljHEtQ9cLzrRDfkTXn2J97cmK6G-c";
  // const {
  //   suggestions: { data },
  //   setValue,
  //   clearSuggestions,
  // } = usePlacesAutocomplete();

  const [user, loading, error] = useAuthState(auth);
  const [admin, setAdmin] = useState(false);
  const [checkRole, setCheckRole] = useState(false);
  
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: api,
    libraries: ["places"],
  });
  const [loadingPage, setLoadingPage] = useState(false);
  const [image, setImage] = useState("");
  const [step, setStep] = useState(1);
  const [progress, setProgress] = useState(50);
  const [dataForm, setDataForm] = useState<EventProps>({
    title: "",
    description: "",
    image: "",
    days: "",
    time: "",
    location: "",
  });
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const toast = useToast();

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

  // // See the data in the console
  // useEffect(() => {
  //   // console.clear();
  //   console.table(dataForm);
  // }, [dataForm]);

  function handleTextArea(e: React.ChangeEvent<HTMLTextAreaElement>) {
    // console.log(e.target.value);
    setDataForm({
      ...dataForm,
      description: e.target.value,
    });
  }

  // Convert image to data_url
  async function ImageToURL(e: React.ChangeEvent<HTMLInputElement>) {
    e.stopPropagation();
    console.log(
      "%c Entering the handleImage function 🚀",
      "color: orange; font-weight: bold; background-color: black; padding: 5px; border-radius: 5px;"
    );

    const reader = new FileReader();
    reader.readAsDataURL(e.target.files![0]);

    reader.onload = (e) => {
      console.assert(e.target?.result, "No image found");
      setImage(e.target?.result as string);
    };
  }

  async function uploadImageAndRetrieveURL() {
    setLoadingPage(true);
    const imageFile = ref(storage, "GreenActsImg/" + dataForm.title);

    // Upload image to Firebase Storage qq
    await uploadString(imageFile, image, "data_url")
      .then((snapshot) => {
        console.log("Uploaded a data_url string!");
      })
      .catch((error) => {
        console.error("Error uploading data_url string: ", error);
      });

    // get the url -> data
    await getDownloadURL(imageFile).then((url) => {
      console.log(url);
      setDataForm({
        ...dataForm,
        image: url,
      });
    });
    setLoadingPage(false);
  }

  const handleDateChange: ReactDatePickerProps["onChange"] = (date, event) => {
    setStartDate(date);
    const realDate = date?.toLocaleDateString() as string;
    const finalTime = date?.toLocaleTimeString() as string;

    setDataForm({
      ...dataForm,
      days: realDate,
      time: finalTime,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.name, e.target.value);
    setDataForm({
      ...dataForm,
      [e.target.name]: e.target.value,
    });
  };

  async function FirebaseSubmit(
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) {
    event?.stopPropagation();
    console.log("submitting and setting data");

    // get the data
    // const { title } = data;
    console.log(inputValue);
    const time = startDate?.toLocaleTimeString() as string;

    const eventRef = collection(firestore, "GreenActs");

    console.log(
      "%c Before adding doc",
      "color: orange; font-weight: bold; size: 2rem;"
    );
    console.table(dataForm);
    // add doc
    await addDoc(eventRef, dataForm)
      // Console log if successful
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
        console.log("%c Event created. 🌈", "color: green; font-weight: bold;");
        toast({
          title: "Event created.",
          description: "Your event has been successfully created.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch((error) => {
        // Console log if error
        console.error("Error adding document: ", error);
      });

      
        const pinDocRef = doc(firestore, "pins", inputValue);
        const pinDoc = await getDoc(pinDocRef);

        if (pinDoc.exists()) {
          // Handle the case where the pin document already exists
          // For example, set an error or take appropriate action
        } else {
          await setDoc(pinDocRef, {
            type: "Event",
            address: inputValue,
            lat: selected.lat,
            lng: selected.lng,
            desc: dataForm.description,
            imageURL: dataForm.image,
            createdAt: serverTimestamp() as Timestamp,
          });
          
        }

        await fetchDataFromFirestore();
      
  }
  //Map


   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
     setInputValue(event.target.value);
     setDataForm({
      ...dataForm,
      location: inputValue,
    });
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
          //  if (mapRef.current) {
          //    mapRef.current.panTo({ lat: latitude, lng: longitude });
          //  } 
           mapRef.current?.panTo({ lat: latitude, lng: longitude });
           mapRef.current?.setZoom(15);
         },
         (error) => {
           console.log("Error getting current location:", error);
         }
       );
     } else {
       console.log("Geolocation is not supported by this browser.");
     }
   }, [step]);

   const fetchDataFromFirestore = async () => {
    const usersCollectionRef = collection(firestore, "users");

    const querySnapshotUsers = await getDocs(usersCollectionRef);
  
    await querySnapshotUsers.forEach((doc) => {
      if (doc.data().role == "admin" && doc.data().uid == user?.uid) {
        setAdmin(true);
      }
    });
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
     await setCheckRole(true);
   };

   useEffect(() => {
     if (mapRef.current && pins.length > 0) {
       addMarkers(mapRef.current, pins);
     }
   }, [pins]);
   useEffect(() => {
     fetchDataFromFirestore();
   }, [user]);

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

       await fetchDataFromFirestore();
     } catch (error) {
       // Handle and display error messages to the user
       console.error("Error creating pin:", error.message);
       toast.error("Failed to create pin. Please try again.", {
         position: toast.POSITION.TOP_CENTER,
         autoClose: 3500,
       });
     }
   };
  if (!isLoaded) return <div>Loading...</div>;
  if (checkRole == true){
  return (
    <>
      {admin == true ? (
        <EventFormContent>
          <>
            <Flex direction={"row"} alignItems={"center"} m="2">
              <Link href="/admin">
                <IconButton
                  aria-label="Return page"
                  variant="outline"
                  colorScheme="teal"
                  _hover={{ bg: "#0F3320", color: "white" }}
                  icon={<ArrowBackIcon />}
                  mr="7px"
                  w={8}
                  h={8}
                />
              </Link>

              <Text fontSize="sm">Return back to admin dashboard</Text>
            </Flex>
            <Flex alignItems={"center"}>
              <Box
                p="20px 40px 20px 40px"
                borderBottom="1px solid"
                bg="white"
                borderRadius={4}
                width="full"
                as="form"
              >
                <Progress
                  hasStripe
                  value={progress}
                  mb="5%"
                  mx="5%"
                  isAnimated
                ></Progress>
                {step === 1 ? (
                  <>
                    <Form1
                      change={handleChange}
                      textAreaChange={handleTextArea}
                      imageChange={ImageToURL}
                    />
                  </>
                ) : (
                  <>
                    <Form2
                      startDate={startDate}
                      handleDateChange={handleDateChange}
                    />
                    <Flex direction={"column"}>
                      <Flex>
                        <Input
                          placeholder="Enter address"
                          size="sm"
                          bg="white"
                          type="text"
                          value={inputValue}
                          onChange={handleInputChange}
                        />

                        <Button
                          variant="search"
                          marginLeft="10px"
                          onClick={handleButtonClick}
                          id="search_button"
                          bg="#0F3320"
                          color="white"
                          _hover={{ bg: "#233814", color: "white" }}
                        >
                          Search
                        </Button>
                      </Flex>

                      <Flex
                        width={"100%"}
                        height={"70vh"}
                        marginTop={"15px"}
                        justify="center"
                        bg="red"
                        alignItems={"center"}
                      >
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
                    </Flex>
                  </>
                )}
                <ButtonGroup mt="5%" w="100%">
                  <Flex w="100%" justifyContent="space-between">
                    <Flex>
                      <Button
                        onClick={() => {
                          setStep(1);
                          setProgress(50);
                        }}
                        isDisabled={step === 1}
                        colorScheme="teal"
                        variant="solid"
                        w="7rem"
                        mr="5%"
                        _hover={{ bg: "#233814" }}
                      >
                        {" "}
                        Back{" "}
                      </Button>
                      <Button
                        w="7rem"
                        isDisabled={step === 2}
                        onClick={async () => {
                          await uploadImageAndRetrieveURL();
                          setStep(2);
                          setProgress(100);
                        }}
                        isLoading={loading}
                        colorScheme="teal"
                        variant="outline"
                        _hover={{ bg: "#ECF2D9" }}
                      >
                        {" "}
                        Next{" "}
                      </Button>
                    </Flex>
                    {step === 2 ? (
                      <Button
                        w="7rem"
                        colorScheme="red"
                        variant="solid"
                        onClick={FirebaseSubmit}
                        _hover={{ bg: "#233814" }}
                      >
                        {" "}
                        Submit{" "}
                      </Button>
                    ) : null}
                  </Flex>
                </ButtonGroup>
              </Box>
            </Flex>
          </>
          <Box />
        </EventFormContent>
      ) : (
        <NotFound />
      )}
    </>
  );} else {
    return <LoadingPage />;
  }
}
