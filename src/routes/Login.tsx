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
} from '../styledComponents/AuthComponent/AuthComponent';
import GithubBtn from '../components/GitHubBtn';
const LOGIN_IMAGE_SRC =
  'https://abs.twimg.com/responsive-web/client-web/icon-default.522d363a.png';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [inputValue, setInputValue] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
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
      if (error instanceof FirebaseError) {
        switch (error.code) {
          case 'auth/invalid-email':
            setError('잘못된 이메일 형식입니다.');
            break;
          case 'auth/user-disabled':
            setError('사용자 계정이 비활성화되었습니다.');
            break;
          case 'auth/user-not-found':
            setError('사용자를 찾을 수 없습니다.');
            break;
          case 'auth/wrong-password':
            setError('잘못된 비밀번호입니다.');
            break;
          default:
            setError('로그인 중 오류가 발생했습니다.');
        }
      } else {
        setError('로그인 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Wrapper>
      <Title>
        Login
        <img style={{ width: '70px' }} src={LOGIN_IMAGE_SRC} alt='image' />
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
        <Input
          type='submit'
          value={isLoading ? 'Loading...' : 'Log in'}
          disabled={isLoading}
        />
      </Form>
      {error !== '' ? <Error>{error}</Error> : null}
      <Switcher>
        Don't have an account?{' '}
        <Link to='/create-account'>Create one &rarr;</Link>
      </Switcher>
      <GithubBtn />
    </Wrapper>
  );
}
