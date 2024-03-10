import {
  Box,
  Flex,
  Center,
  Input,
  ButtonGroup,
  Textarea,
  Grid,
  GridItem,
  Text,
  Divider,
  ListItem,
  List,
  ListIcon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  chakra,
  Link,
  IconButton,
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
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ArrowBackIcon } from "@chakra-ui/icons";
import NotFound from "../components/Elements/NotFound";
import LoadingPage from "../components/Elements/LoadingPage";
import withAuth from "@/utils/withAuth";

type deletePinsProps = {};

const deletePins: React.FC<deletePinsProps> = () => {
  const [user, loading, error] = useAuthState(auth);
  const [pins, setPins] = useState([]);
  const [admin, setAdmin] = useState(false);
  const [checkRole, setCheckRole] = useState(false);
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
      newPins.push({
        type: doc.data().type,
        address: doc.data().address,
        lat: doc.data().lat,
        lng: doc.data().lng,
        desc: doc.data().desc,
      });
    });

    // Update the pins state outside the loop with all the collected pins
    setPins([...newPins]);
    await setCheckRole(true);
  };
  useEffect(() => {
    fetchDataFromFirestore();
  }, [user]);
  useEffect(() => {
    console.log(pins);
  }, [pins]);
  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(firestore, "pins", id));
      // After deletion, fetch updated data
      fetchDataFromFirestore();
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };
  if (checkRole == true) {
    return (
      <>
        {admin == true ? (
          <>
            <Flex justifyContent="center" direction={"column"} m={5}>
              <Flex direction={"row"} alignItems={"center"}>
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

              <Flex justifyContent={"center"}>
                <Text fontWeight="bold" fontSize="25px" marginTop="0px">
                  Delete Pins
                </Text>
              </Flex>
            </Flex>
            <Flex margin="15px">
              <Table
                variant="striped"
                colorScheme="teal"
                borderWidth="2px"
                borderColor="black"
              >
                <Thead>
                  <Tr borderBottom="2px" borderBottomColor="black.100">
                    <Th>Type of pins</Th>
                    <Th>Address</Th>
                    <Th>Action</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {pins.map((pin) => (
                    <Tr
                      key={pin.address}
                      borderBottom="2px"
                      borderBottomColor="black.100"
                      // Remove border from last row
                    >
                      <Td>{pin.type}</Td>
                      <Td>{pin.address}</Td>
                      <Td>
                        <chakra.div display="flex" alignItems="center">
                          <Button
                            colorScheme="red"
                            size="sm"
                            onClick={() => handleDelete(pin.address)}
                          >
                            Delete
                          </Button>
                        </chakra.div>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Flex>
          </>
        ) : (
          <NotFound />
        )}
      </>
    );
  } else {
    return <LoadingPage />;
  }
};
export default deletePins;
