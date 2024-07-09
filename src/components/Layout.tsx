import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from './Navbar';

const Wrapper = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 5fr;
  padding: 50px 0px;
  width: 100%;
  height: 100%;
  max-width: 860px;
  margin: 20px;
  @media (max-width: 540px) {
    grid-template-columns: 1fr;
  }
`;

export default function Layout() {
  return (
    <Wrapper>
      <Navbar />
      <Outlet />
    </Wrapper>
  );
}
