import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  FormControl,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import React from "react";
import { BsEmojiSunglasses, BsEnvelope } from "react-icons/bs";
import {
  IoAlertCircleSharp,
  IoCheckmarkDoneCircleOutline,
  IoCheckmarkDoneCircleSharp,
  IoLockClosedOutline,
} from "react-icons/io5";
import PasswordStrengthBar from "react-password-strength-bar";

type FormSubmitProps = {
  textInputs: {
    displayName: string;
    email: string;
    password: string;
    confirmPassword: string;
    showPassword: boolean;
    showConfirmPassword: boolean;
  };
  handleShowPassword: () => void;
  handleShowConfirmPassword: () => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
const FormSubmit: React.FC<FormSubmitProps> = ({
  textInputs,
  onChange,
  handleShowPassword,
  handleShowConfirmPassword,
}) => {
  return (
    <div>
      <FormControl>
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={<BsEmojiSunglasses color="gray.300" />}
          />
          <Input
            required
            name="displayName"
            placeholder="username"
            type="text"
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
        </InputGroup>
      </FormControl>

      <FormControl>
        <InputGroup>
          <InputLeftElement pointerEvents="none" children={<BsEnvelope />} />
          <Input
            required
            name="email"
            placeholder="email address"
            type="email"
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
        </InputGroup>
      </FormControl>

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
            type={textInputs.showPassword ? "text" : "password"}
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
                icon={textInputs.showPassword ? <ViewOffIcon /> : <ViewIcon />}
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
      <PasswordStrengthBar
        password={textInputs.password}
        barColors={["#FF3C00", "#ECF2D9", "#596642", "#BCCC71", "#0F3220"]} // Repeated the last color for the fifth level
        scoreWords={["very weak", "weak", "fair", "good", "very strong"]}
        minLength={8}
        onChangeScore={(score, feedback) => {
          // Handle the score change here
          console.log(`Password score is ${score}: ${feedback}`);
        }}
      />

      <FormControl pt="5px">
        <InputGroup>
          <InputLeftElement
            pointerEvents="none"
            children={
              textInputs.password !== "" &&
              textInputs.confirmPassword !== "" ? (
                textInputs.password === textInputs.confirmPassword ? (
                  <IoCheckmarkDoneCircleSharp />
                ) : (
                  <IoAlertCircleSharp />
                )
              ) : (
                <IoCheckmarkDoneCircleOutline />
              )
            }
          />

          <Input
            required
            name="confirmPassword"
            placeholder="confirm password"
            type={textInputs.showConfirmPassword ? "text" : "password"}
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
          <InputRightElement width="4.5rem">
            <IconButton
              icon={
                textInputs.showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />
              }
              aria-label="show password"
              _hover={{ bg: "transparent" }}
              variant={"outline"}
              borderColor="transparent"
              onClick={handleShowConfirmPassword}
            />
          </InputRightElement>
        </InputGroup>
      </FormControl>
    </div>
  );
};

export default FormSubmit;
