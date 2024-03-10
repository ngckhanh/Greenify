import React from "react";
import { Spinner } from "@chakra-ui/react";

type LoadingPageProps = {};

const LoadingPage: React.FC<LoadingPageProps> = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Spinner size="xl" color="black.500" />
    </div>
  );
};
export default LoadingPage;
