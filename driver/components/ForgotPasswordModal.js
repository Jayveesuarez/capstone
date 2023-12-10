import React, { useState } from 'react';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import tw from "tailwind-styled-components";

const ForgotPasswordModal = ({ closeModal, resetPassword }) => {
  const [email, setEmail] = useState('');

  const handleResetPassword = async (e) => {
    e.preventDefault();

    try {
      await sendPasswordResetEmail(auth, email);
      alert('Password reset email sent. Please check your email.');
      resetPassword();
    } catch (error) {
      alert('An error occurred. Please check your email address.');
    }
  };

  return (
    <ForgotContainer>
      <ForgotForm onSubmit={handleResetPassword}>
        <FormTitle>Forgot Password</FormTitle>
        <FormGroup>
          <FormLabel htmlFor="resetEmail">Email:</FormLabel>
          <FormInput
            type="email"
            id="resetEmail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>
        <FormButton type="submit">Reset Password</FormButton>
        <CloseButton onClick={closeModal}>Cancel</CloseButton>
      </ForgotForm>
    </ForgotContainer>
  );
};

const ForgotContainer = tw.div`
  flex items-center justify-center h-full bg-gray-800
`;

const ForgotForm = tw.form`
   p-4 bg-white rounded-lg shadow-md
`;

const FormTitle = tw.h2`
  text-2xl text-center mb-4 font-semibold
`;

const FormGroup = tw.div`
  mb-4
`;



const FormLabel = tw.label`
  block mb-2
`;

const FormInput = tw.input`
  w-full p-2 border-solid border border-gray-400 rounded
`;

const FormButton = tw.button`
  w-full mt-2 p-2 text-white bg-gray-800 rounded hover:bg-gray-600
`;
const CloseButton = tw.button`
  w-full mt-2 p-2 text-white bg-gray-600 rounded hover:bg-gray-700
`;


export default ForgotPasswordModal;
