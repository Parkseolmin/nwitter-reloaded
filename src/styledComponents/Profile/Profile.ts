import styled from 'styled-components';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;

export const AvatarUpload = styled.label`
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 50px;
  }
`;

export const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
`;

export const AvatarInput = styled.input`
  display: none;
`;

export const Name = styled.span`
  font-size: 20px;
  white-space: nowrap;
`;

export const Tweets = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

export const ProfileName = styled.div`
  display: flex;
  gap: 8px;

  svg {
    width: 20px;
    cursor: pointer;
  }
`;
