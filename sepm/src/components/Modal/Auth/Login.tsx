import React, { useState } from "react";
import { Input, Button, Flex, Text, FormControl, IconButton, InputGroup, InputLeftElement, InputRightElement } from "@chakra-ui/react";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../../atoms/authModalAtoms";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "../../../firebase/clientApp";
import { FIREBASE_ERRORS } from "../../../firebase/error";
import { useEffect } from "react";
import { ViewOffIcon, ViewIcon } from "@chakra-ui/icons";
import { IoLockClosedOutline } from "react-icons/io5";
import PasswordStrengthBar from "react-password-strength-bar";
type LoginProps = {};

const Login: React.FC<LoginProps> = () => {
  const [signInWithEmailAndPassword, user, loading, authError] =
    useSignInWithEmailAndPassword(auth);
  const setAuthModalState = useSetRecoilState(authModalState);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  
  // Firebase logic
  const [error, setError] = useState("");
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
     await signInWithEmailAndPassword(loginForm.email, loginForm.password);
    } catch (error) {
      console.log(error);
    }
    console.log('Auth Error:', authError);
if (authError) {
  console.log('Error Code:', authError.code);
  console.log('Error Message:', FIREBASE_ERRORS[authError.code as keyof typeof FIREBASE_ERRORS]);
}
   
  };
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);
  // here we use the setShowPassword state to toggle the password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //update form state
    setLoginForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };
  useEffect(() => {
    console.log('Auth Error:', authError);
    if (authError) {
      console.log('Error Message:',  FIREBASE_ERRORS[authError?.message as keyof typeof FIREBASE_ERRORS]);
    }
  }, [authError]);

  return (
    <form onSubmit={onSubmit}>
      <Input
        required
        name="email"
        placeholder="email"
        type="email"
        mb={2}
        onChange={onChange}
        fontSize="10pt"
        _placeholder={{ color: "gray.500" }}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500  ",
        }}
        _focus={{
          ouline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        bg="gray.50"
      />
          <FormControl>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<IoLockClosedOutline />}
          />

          <Input
            required
            name="password"
            placeholder="password"
            type={showPassword ? "text" : "password"}
            mb={2}
            onChange={onChange}
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
      </FormControl>
      

      {authError && (
  <Text textAlign="center" color="red" fontSize="10pt">
    {FIREBASE_ERRORS[authError.message as keyof typeof FIREBASE_ERRORS] || authError.message}
  </Text>
)}
      <Button
        width="100%"
        height="36px"
        mt={2}
        mb={2}
        type="submit"
        isLoading={loading}
      >
        Log In
      </Button>
      <Flex justifyContent="center" mb={2}>
        <Text fontSize="9pt" mr={1}>
          Forgot your password?
        </Text>
        <Text
          fontSize="9pt"
          color="blue.500"
          cursor="pointer"
          onClick={() =>
            setAuthModalState((prev) => ({
              ...prev,
              view: "resetPassword",
            }))
          }
        >
          Reset
        </Text>
      </Flex>

      <Flex fontSize="9pt" justifyContent="center">
        <Text mr={1}>New here ?</Text>
        <Text
          color="blue.500"
          fontWeight={700}
          cursor="pointer"
          onClick={() =>
            setAuthModalState((prev) => ({
              ...prev,
              view: "signup",
            }))
          }
        >
          SIGN UP
        </Text>
      </Flex>
    </form>
  );
};
export default Login;
