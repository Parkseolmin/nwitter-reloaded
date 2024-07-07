import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';

export default function Home() {
  const navigate = useNavigate();
  const logOut = async () => {
    await auth.signOut();
    navigate('/');
  };
  return (
    <h1>
      <button onClick={logOut}>Log Out</button>
    </h1>
  );
}
