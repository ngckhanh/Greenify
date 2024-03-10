import { Flex, Icon, Link } from "@chakra-ui/react";
import React from "react";
import { useState, useEffect } from "react";
import NotFound from "../../Elements/NotFound";
import LoadingPage from "../../Elements/LoadingPage";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, firestore } from "../../../firebase/clientApp";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

type LeftContentProps = {};

const LeftContent: React.FC<LeftContentProps> = () => {
     const [user, loading, error] = useAuthState(auth);
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
     };
     useEffect(() => {
       fetchDataFromFirestore();
     }, [user]);
  return (
    <Flex alignItems="center">
      <Flex
        mr={5}
        ml={5}
        padding={1}
        cursor="pointer"
        borderRadius={4}
        _hover={{ bg: "gray.200" }}
      >
        <Link
          margin={1}
          _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
          href="/forum"
          fontWeight={"semi-bold"}
        >
          Forum
        </Link>
      </Flex>
      <Flex
        mr={5}
        ml={5}
        padding={1}
        cursor="pointer"
        borderRadius={4}
        _hover={{ bg: "gray.200" }}
      >
        <Link
          margin={1}
          _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
          href="/map"
          fontWeight={"semi-bold"}
        >
          Map
        </Link>
      </Flex>
      <Flex
        mr={5}
        ml={5}
        padding={1}
        cursor="pointer"
        borderRadius={4}
        _hover={{ bg: "gray.200" }}
      >
        <Link
          margin={1}
          _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
          href="/greenActs"
          fontWeight={"semi-bold"}
        >
          GreenActs
        </Link>
      </Flex>
      {admin == true ? (
          <Flex
            mr={5}
            ml={5}
            padding={1}
            cursor="pointer"
            borderRadius={4}
            _hover={{ bg: "gray.200" }}
          >
            <Link
              margin={1}
              _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
              href="/admin"
              fontWeight={"semi-bold"}
            >
              Admin
            </Link>
          </Flex>
        ) : false}
    </Flex>
  );
};
export default LeftContent;