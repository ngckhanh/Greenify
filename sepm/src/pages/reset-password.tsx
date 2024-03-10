import {
  Box,
  Button,
  Center,
  FormControl,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  Text,
  VStack
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  confirmPasswordReset,
  getAuth,
  verifyPasswordResetCode,
} from "firebase/auth";
import { useRouter } from "next/router";
import { IoLockClosedOutline } from "react-icons/io5";
import withAuth from "@/utils/withAuth";

const ResetPasswordPage: React.FC = () => {
  const [newPassword, setNewPassword] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;
  const router = useRouter();
  const { oobCode, mode } = router.query; // Destructure the oobCode and mode directly from router.query
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  useEffect(() => {
    // This effect will run when the router.query is updated
    if (router.isReady) {
      // Make sure the router is ready and query params are populated
      console.log("oobCode", oobCode);
      console.log("mode", mode);
      // You can set the actionCode state here if needed, or directly use oobCode
    }
  }, [router.isReady, oobCode, mode]); // Add dependencies here to avoid unnecessary re-renders

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);
  // here we use the setShowPassword state to toggle the password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);

  async function handleResetPassword(newPassword: string, actionCode: string) {
    const auth = getAuth();

    try {
      // Verify the password reset code is valid.
      const accountEmail = await verifyPasswordResetCode(auth, actionCode);
      if (user) {
        if (accountEmail === user.email) {
          // Save the new password.
          await confirmPasswordReset(auth, actionCode, newPassword);

          // You can sign in the user with their new password, or redirect them to the login page
          router.push("/"); // Changed to root path, assuming that's the login page
        } else {
          // The provided email doesn't match the one in the password reset request
          console.error(
            "The provided email doesn't match the one in the password reset request."
          );
        }
      }
    } catch (error) {
      // Error occurred during confirmation. The code might have expired or the password is too weak.
      console.error("Error occurred during password reset:", error);
    }
  }

  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long.");
    }
    if (!password.match(/[A-Z]/)) {
      errors.push("Password must contain at least one uppercase letter.");
    }
    if (!password.match(/[a-z]/)) {
      errors.push("Password must contain at least one lowercase letter.");
    }
    if (!password.match(/[0-9]/)) {
      errors.push("Password must contain at least one number.");
    }
    if (!password.match(/[\^$*.\[\]{}()?\-"!@#%&/,><':;|_~`]/)) {
      errors.push("Password must contain at least one special character.");
    }
    return errors;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const passwordValidationErrors = validatePassword(newPassword);
    if (passwordValidationErrors.length > 0) {
      setPasswordError(passwordValidationErrors.join(" "));
      return;
    }
    // Clear any previous password errors
    setPasswordError("");
    // Proceed with password reset if validation passes
    if (typeof oobCode === "string") {
      setLoading(true);
      await handleResetPassword(newPassword, oobCode);
    } else {
      console.error("Invalid action code");
    }
  };

  return (
    <>
      <Center h="100vh">
        <Box bg="white" borderRadius={5}>
          <VStack m="50px 100px 50px 100px" direction="column" spacing={5}>
            <Heading textColor="#0F3320" size="lg">
              Reset Password
            </Heading>

            <Text fontSize="10pt" color="gray.500" width={400} as={Center}>
              Enter a new password for &nbsp;
              <span style={{ color: user?.email ? "blue" : "red" }}>
                {user?.email || "your email address"}
              </span>
              &nbsp;
            </Text>
            <form onSubmit={handleSubmit}>
              <Stack spacing={5}>
                <FormControl mb="-10pt">
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<IoLockClosedOutline />}
                    />

                    <Input
                      required
                      name="password"
                      placeholder="Password"
                      type={showPassword ? "text" : "password"}
                      mb={2}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      fontSize="10pt"
                      _placeholder={{ color: "gray.500" }}
                      _hover={{
                        bg: "white",
                        border: "1px solid",
                        borderColor: "blue.500",
                      }}
                      _focus={{
                        ouline: "none",
                        bg: "white",
                        border: "1px solid",
                        borderColor: "blue.500",
                      }}
                      bg="gray.50"
                    />
                    <InputRightElement
                      width="4.5rem"
                      children={
                        <IconButton
                          icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                          aria-label="show password"
                          _hover={{ bg: "transparent" }}
                          variant={"outline"}
                          borderColor="transparent"
                          onClick={handleShowPassword}
                        />
                      }
                    />
                  </InputGroup>
                  <FormControl></FormControl>
                </FormControl>

                <Text textAlign="center" color="red" fontSize="10pt">
                  {passwordError}
                </Text>

                <Button
                  type="submit"
                  w={"full"}
                  justifyContent={"center"}
                  bg={"green.400"}
                  color={"white"}
                  rounded={"md"}
                  _hover={{
                    //transform: 'translateY(-2px)',
                    boxShadow: "lg",
                  }}
                  isLoading={loading}
                >
                  Reset my password
                </Button>
              </Stack>
            </form>
          </VStack>
        </Box>
      </Center>
    </>
  );
};

export default withAuth(ResetPasswordPage);
