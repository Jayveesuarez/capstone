import Image from "next/image";
import tw from "tailwind-styled-components";
import { useEffect } from "react";
import { auth } from "../firebase";
import { useRouter } from "next/router";
import { onAuthStateChanged } from "firebase/auth";

const LandingPage = () => {
  const router = useRouter();

  useEffect(() => {
    return onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/");
      }
    });
  }, []);

  return (
    <Wrapper>
        <Title>Angkas</Title>
      <ImageContainer>
        <Image src="/assets/angkas.png" alt="background"  width={300} height={300} /> 
      </ImageContainer>
      <LoginButton onClick={() => router.push("/login")}>
        Login
      </LoginButton>
      <RegisterButton onClick={() => router.push("/register")}>
        Register
      </RegisterButton>
    </Wrapper>
  );
};

const Wrapper = tw.div`
    p-4 flex flex-col h-screen w-full bg-gray-800
`;
const LoginButton = tw.button`
w-full py-4 px-6 text-blue-100 
transition-colors duration-150 bg-gray-900
rounded-lg focus:shadow-outline hover:bg-gray-700
`;
const RegisterButton = tw.button`
w-full py-4 px-6 my-4 text-blue-100 
transition-colors duration-150 bg-gray-500 
rounded-lg focus:shadow-outline hover:bg-gray-600
`;
const Title = tw.div`
    text-5xl pt-4 text-gray-500 font-semibold
`;
const ImageContainer = tw.div`
    flex justify-center items-center
`
export default LandingPage;
