import { useState } from 'react';
import { auth } from '../firebase/firebase';
import { Link, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import {
  Error,
  Form,
  Input,
  Switcher,
  Title,
  Wrapper,
} from '../components/AuthComponent';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState({
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
    if (isLoading || inputValue.email === '' || inputValue.password === '')
      return;
    try {
      setIsLoading(true);
      await signInWithEmailAndPassword(
        auth,
        inputValue.email,
        inputValue.password
      );
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
        Login
        <img
          style={{ width: '70px' }}
          src='https://abs.twimg.com/responsive-web/client-web/icon-default.522d363a.png'
          alt='image'
        />
      </Title>
      <Form onSubmit={handleSubmit}>
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
        <Input type='submit' value={isLoading ? 'Loading...' : 'Log in'} />
      </Form>
      {error !== '' ? <Error>{error}</Error> : null}
      <Switcher>
        Don't have an account?{' '}
        <Link to='/create-account'>Create one &rarr;</Link>
      </Switcher>
    </Wrapper>
  );
}
