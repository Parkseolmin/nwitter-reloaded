import styled from 'styled-components';

export const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
  margin: 10px;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
  @media (max-width: 540px) {
    font-size: 12px;
  }
`;

export const Payload = styled.pre`
  margin: 10px 0px;
  font-size: 18px;
  flex-grow: 1;
  white-space: pre-wrap;
  @media (max-width: 540px) {
    font-size: 15px;
  }
`;

export const Photo = styled.img`
  width: 100%;
  object-fit: cover;
  border-radius: 15px;
  // margint: auto;
`;

export const CrudBox = styled.div`
  display: flex;
  gap: 5px;
`;

export const Button = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 5px;
  text-transform: uppercase;
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  @media (max-width: 540px) {
    font-size: 9px;
    width: 45px;
    padding: 4px 5px;
  }
`;

export const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 80%;
  resize: none;
  font-optical-sizing: auto;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;
