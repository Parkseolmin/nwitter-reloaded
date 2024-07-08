import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useState } from 'react';
import { auth } from '../firebase/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import {
  Error,
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
} from '../components/AuthComponent';
import GithubBtn from '../components/GitHubBtn';

export default function CreateAccount() {
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValue((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (
      isLoading ||
      inputValue.name === '' ||
      inputValue.email === '' ||
      inputValue.password === ''
    )
      return;
    try {
      setIsLoading(true);
      const credentials = await createUserWithEmailAndPassword(
        auth,
        inputValue.email,
        inputValue.password
      );
      await updateProfile(credentials.user, {
        displayName: inputValue.name,
      });
      console.log('업데이트프로필', credentials.user);
      navigate('/');
    } catch (error) {
      // setError
      if (error instanceof FirebaseError) {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Wrapper>
      <Title>
        Join
        <img
          style={{ width: '70px' }}
          src='https://abs.twimg.com/responsive-web/client-web/icon-default.522d363a.png'
          alt='image'
        />
      </Title>
      <Form onSubmit={handleSubmit}>
        <Input
          name='name'
          placeholder='Name'
          value={inputValue.name}
          type='text'
          required
          onChange={handleChange}
        />
        <Input
          name='email'
          placeholder='Email'
          value={inputValue.email}
          type='email'
          required
          onChange={handleChange}
        />
        <Input
          name='password'
          placeholder='Password'
          value={inputValue.password}
          type='password'
          required
          onChange={handleChange}
        />
        <Input
          type='submit'
          value={isLoading ? 'Loading...' : 'Create Account'}
        />
      </Form>
      {error !== '' ? <Error>{error}</Error> : null}
      <Switcher>
        Already have an account? <Link to='/login'>Login &rarr;</Link>
      </Switcher>
      <GithubBtn />
    </Wrapper>
  );
}
