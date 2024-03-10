import React from "react";
import { Button, Flex, Image } from "@chakra-ui/react";
import { signOut, User } from "firebase/auth";
import AuthButton from "./AuthButtons";
import AuthModal from "../../Modal/Auth/AuthModal";
import { auth } from "../../../firebase/clientApp";
import Icons from "./Icons";
import UserMenu from "./UserMenu";

type RightContentProps = {
  user?: User | null;
};

const RightContent: React.FC<RightContentProps> = ({ user }) => {
  return (
    <>
      <AuthModal />
      <Flex align="center">
        {user ? <Icons /> : <AuthButton />}
        <UserMenu user={user} />
      </Flex>
    </>
  );
};
export default RightContent;
