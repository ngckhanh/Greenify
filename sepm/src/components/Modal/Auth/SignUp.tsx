import FormSubmit from "@/components/Elements/FormSubmit";
import { Button, Flex, FormControl, Link, Stack, Text } from "@chakra-ui/react";
import { sendEmailVerification, updateProfile } from "firebase/auth";
import { collection, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useSetRecoilState } from "recoil";
import { authModalState } from "../../../atoms/authModalAtoms";
import { auth, firestore, storage } from "../../../firebase/clientApp";
import { FIREBASE_ERRORS } from "../../../firebase/error";
import UserImage from "../../Elements/UserImage";
const SignUp = () => {
  const router = useRouter();
  const setAuthModalState = useSetRecoilState(authModalState);
  const [success, setSuccess] = useState(false);
  //  1. Implementing the user image upload
  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    if (event.target.files?.[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }
    reader.onload = (e) => {
      setSelectedFile(e.target?.result as string);
    };
  };
  //On selecting an image, we convert it to base64 format and store it in selectedFile state
  const selectFileRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<string>();
  //  2. Implementing the user sign up
  const [signUpForm, setSignUpForm] = useState({
    displayName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => setShowPassword(!showPassword);
  // here we use the setShowPassword state to toggle the password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleShowConfirmPassword = () =>
    setShowConfirmPassword(!showConfirmPassword);
  const [error, setError] = useState("");
  // const [loading, setLoading] = useState(false);
  const [createUserWithEmailAndPassword, _, loading, authError] =
    useCreateUserWithEmailAndPassword(auth);

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

  const verifyEmail = async (userCred: any) => {
    if (userCred.user) {
      try {
        await sendEmailVerification(userCred.user);
      
        await userCred.user.reload().then(() => {
          //Check if email is verified
          console.log("email verifies?:", userCred.user.emailVerified);
        });
      } catch (error: any) {
        console.log("Error sending email verification", error.message);
        console.log("verify email run:", userCred.user.emailVerified);
      }
    }
  };
  const validateAndCreateUser = async () => {
    if (error) setError("");
    if (!signUpForm.email.includes("@")) {
      return setError("Please enter a valid email");
    }
    if (signUpForm.password !== signUpForm.confirmPassword) {
      return setError("Passwords do not match");
    }
    const passwordValidationErrors = validatePassword(signUpForm.password);
    if (passwordValidationErrors.length > 0) {
      setError(passwordValidationErrors.join(" "));
      return;
    }
     setError("");
  

    const userCred = await createUserWithEmailAndPassword(
      signUpForm.email,
      signUpForm.password
    )
    if (userCred) {
      // signOut(auth);
       verifyEmail(userCred);
       updateProfile(userCred!.user, {
        displayName: signUpForm.displayName,
      });
      
      router.push("/confirm-email");
        if (userCred!.user.emailVerified) {
          router.push("/profile");
        }
      };
    //if verified then update the profile
    return userCred;
  };

  const updateUserProfileAndDocument = async (userCred: any) => {
    let imageURL = userCred.user.photoURL; // default to the current photoURL

    if (selectedFile) {
      const imageRef = ref(storage, `users/${userCred.user.uid}`);
      await uploadString(imageRef, selectedFile, "data_url");
      imageURL = await getDownloadURL(imageRef);
      await updateProfile(userCred.user, { photoURL: imageURL });
    }
    await setDoc(doc(collection(firestore, "users"), userCred.user.uid), {
      email: userCred.user.email,
      displayName: userCred.user.displayName,
      role: "user", // default to "user
      providerData: userCred.user.providerData,
      createdAt: new Date(),
      lastSeen: new Date(),
      photoURL: imageURL,
      uid: userCred.user.uid,
    });
    console.log("User document created with ID:", userCred.user.uid);
    console.log("email verifies?:", userCred.user.emailVerified);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const userCred = await validateAndCreateUser();

      if (userCred) {
        await updateUserProfileAndDocument(userCred);
        setSuccess(true);
        console.log("email verifies?:", userCred.user.emailVerified);
      }
    } catch (error: any) {
      console.log("Error creating user", error.message);
      console.log('Error Message:',  FIREBASE_ERRORS[authError?.message as keyof typeof FIREBASE_ERRORS]);
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //update form state
    setSignUpForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <form onSubmit={onSubmit}>
      
          <FormControl id="userName">
            <UserImage
              selectedFile={selectedFile}
              onSelectImage={onSelectImage}
              setSelectedFile={setSelectedFile}
              selectFileRef={selectFileRef}
            />
          </FormControl>

          <Stack spacing={2} mt="20px">
            <FormSubmit
              textInputs={{
                displayName: signUpForm.displayName,
                email: signUpForm.email,
                password: signUpForm.password,
                confirmPassword: signUpForm.confirmPassword,
                showPassword: showPassword,
                showConfirmPassword: showConfirmPassword,
              }}
              onChange={onChange}
              handleShowPassword={handleShowPassword}
              handleShowConfirmPassword={handleShowConfirmPassword}
            />
          </Stack>

          <Text textAlign="center" color="red" fontSize="10pt">
            {error ||
              FIREBASE_ERRORS[
                authError?.message as keyof typeof FIREBASE_ERRORS
              ]}
          </Text>

          <Text textAlign="center" fontSize="10pt">
            By creating an account, you agree to our{" "}
            <Link color="teal.500" href="./policies/privacy">
              Privacy Policy
            </Link>{" "}
            and have read the Greenify{" "}
            <Link color="teal.500" href="./policies/terms-of-service">
              Terms
            </Link>{" "}
            of Use.
          </Text>
          <Text textAlign="center" fontSize="10pt"></Text>
          <Button
            width="100%"
            height="36px"
            mt={2}
            mb={2}
            type="submit"
            isLoading={loading}
          >
            Sign Up
          </Button>
          <Flex fontSize="9pt" justifyContent="center">
            <Text mr={1}>Already a greenify user?</Text>
            <Text
              color="blue.500"
              fontWeight={700}
              cursor="pointer"
              onClick={() =>
                setAuthModalState((prev) => ({
                  ...prev,
                  view: "login",
                }))
              }
            >
              LOG IN
            </Text>
          </Flex>
    </form>
  );
};

export default SignUp;
