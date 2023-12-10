import React, { useState } from 'react';
import Modal from 'react-modal';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from "next/router";
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import tw from 'tailwind-styled-components';

const Login = () => {
  const customStyles = {
    content: {
      width: 'fit-content', 
      height: 'fit-content', 
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#d3d3d3',
      border: 'none', 
    },
  };
  const router = useRouter()

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const resetPassword = () => {
    closeModal();
  };

  const handleLogin = async (e) => {
    e.preventDefault(); 

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("You have successfully logged in!");
      router.push("/")
    } catch (error) {
      alert("An error occurred during login. Please check your credentials.");
    }
  };


  
  return (
    <LoginContainer>
      <LoginForm >
        <form>
          <FormTitle>Login to continue</FormTitle>
          <FormLabel htmlFor="email">Email:</FormLabel>
          <FormInput
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <FormLabel htmlFor="password">Password:</FormLabel>
          <FormInput
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <FormButton onClick={handleLogin}>Login</FormButton>
        </form>
        <ForgotPasswordButton onClick={openModal}>Forgot Password?</ForgotPasswordButton>

      </LoginForm>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Forgot Password Modal"
        style={customStyles} 
      >
        <ForgotPasswordModal closeModal={closeModal} resetPassword={resetPassword} />
      </Modal>
    </LoginContainer>
  );
};

const LoginContainer = tw.div`
  flex flex-col items-center justify-center h-screen bg-gray-800
`;

const LoginForm = tw.div`
  w-96 p-4 bg-white rounded-lg shadow-md
`;

const FormTitle = tw.h2`
  text-2xl text-center mb-4 font-semibold
`;

const FormLabel = tw.label`
  block mb-2
`;

const FormInput = tw.input`
  w-full p-2 mb-4 border rounded
`;

const FormButton = tw.button`
  w-full p-2 text-white bg-gray-800 rounded hover:bg-gray-600
`;

const ForgotPasswordButton = tw.button`
  mt-2 text-blue-500 text-center
`;

export default Login;
