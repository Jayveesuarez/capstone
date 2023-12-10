import { useRouter } from 'next/router';
import { auth, db } from '../firebase';
import React, { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import tw from 'tailwind-styled-components';

const Register = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthday, setBirthday] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [motorcycleModel, setMotorcycleModel] = useState('');
  const [motorcycleRegNo, setMotorcycleRegNo] = useState(''); 
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role] = useState('driver');

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const today = new Date();
    const birthDate = new Date(birthday);
    const age = today.getFullYear() - birthDate.getFullYear();

    if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      alert("You must be at least 18 years old to register.");
      return;
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userData = {
        firstName,
        lastName,
        birthday,
        phoneNumber,
        motorcycleModel,
        motorcycleRegNo, 
        role,
      };

      const userDocRef = doc(db, 'drivers', userCredential.user.uid);

      await setDoc(userDocRef, userData);
      await sendEmailVerification(userCredential.user);

      alert("You have successfully created an account! Please check your email for verification.");

      router.push('/');
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <RegisterContainer>
      <RegisterForm onSubmit={handleSignUp}>
        <FormTitle>Create an Account</FormTitle>
        <FormName>
          <FormGroup>
            <FormLabel htmlFor="firstName">First Name:</FormLabel>
              <FormInput
                type="text"
                id="firstName"
                value={firstName}
                pattern="^[A-Za-z]+$"
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="lastName">Last Name:</FormLabel>
              <FormInput
                type="text"
                id="lastName"
                value={lastName}
                pattern="^[A-Za-z]+$"
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </FormGroup>
        </FormName>
        <FormGroup>
          <FormLabel htmlFor="email">Email:</FormLabel>
          <FormInput
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="birthday">Birthday:</FormLabel>
          <FormInput
            type="date"
            id="birthday"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="phoneNumber">Phone Number:</FormLabel>
          <FormInput
            type="number"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="motorcycleModel">Motorcycle Model:</FormLabel>
          <FormInput
            type="text"
            id="motorcycleModel"
            value={motorcycleModel}
            onChange={(e) => setMotorcycleModel(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="motorcycleRegNo">Motorcycle Registration No:</FormLabel>
          <FormInput
            type="text"
            id="motorcycleRegNo"
            value={motorcycleRegNo}
            onChange={(e) => setMotorcycleRegNo(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="password">Password:</FormLabel>
          <FormInput
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormGroup>
        <FormGroup>
          <FormLabel htmlFor="confirmPassword">Confirm Password:</FormLabel>
          <FormInput
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </FormGroup>
        <FormButton type='submit'>Register</FormButton>
      </RegisterForm>
    </RegisterContainer>
  );
};

const RegisterContainer = tw.div`
  flex items-center justify-center h-full bg-gray-800
`;

const RegisterForm = tw.form`
   p-4 bg-white rounded-lg shadow-md
`;

const FormTitle = tw.h2`
  text-2xl text-center mb-4 font-semibold
`;

const FormGroup = tw.div`
  mb-4
`;

const FormName = tw.div`
  flex gap-3
`


const FormLabel = tw.label`
  block mb-2
`;

const FormInput = tw.input`
  w-full p-2 border-solid border border-gray-400 rounded
`;

const FormButton = tw.button`
  w-full p-2 text-white bg-gray-800 rounded hover:bg-gray-600
`;

export default Register;
