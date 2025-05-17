import React from "react";
import { Flex, Image, Link } from "@chakra-ui/react";
import RightContent from "./RightContent/RightContent";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../firebase/clientApp";
import LeftContent from "./LeftContent/LeftContent";

// import Directory from "./Directory/Directory";

const Navbar: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  return (
    <Flex
      bg="white"
      height="44px"
      padding="6px 12px"
      justifyContent={"space-between"}
    >
      <Flex align="center" width={{ base: "40px", md: "auto" }} ml={2}>
        <Link href="/forum">
          <Image
            src="sepm/public/images/Greenify_logo.png"
            alt=""
            width={"75px"}
          />
        </Link>
      </Flex>
      <Flex>
        <LeftContent />
      </Flex>
      <Flex>
        <RightContent user={user} />
      </Flex>
    </Flex>
  );
};
export default Navbar;
