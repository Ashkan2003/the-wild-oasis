/* eslint-disable no-unused-vars */
import styled from "styled-components";
import { useUser } from "./useUser";

const StyledUserAvatar = styled.div`
  display: flex;
  gap: 1.2rem;
  align-items: center;
  font-weight: 500;
  font-size: 1.4rem;
  color: var(--color-grey-600);
`;

const Avatar = styled.img`
  display: block;
  width: 4rem;
  width: 3.6rem;
  aspect-ratio: 1;
  object-fit: cover;
  object-position: center;
  border-radius: 50%;
  outline: 2px solid var(--color-grey-100);
`;

function UserAvatar() {
  const { user } = useUser(); // the user is the current-logred-in-user in the app 
  const { fullName, avatar } = user.user_metadata; // the "fullName" and "avatar" is stored in user_metadata

  return (
    <StyledUserAvatar>
      <Avatar
        src={avatar || "default-user.jpg"} // if the user doesing have a avatar, use defualt-avatar
        alt={`Avatar of ${fullName}`}
      />
      <span>{fullName}</span>
    </StyledUserAvatar>
  );
}

export default UserAvatar;
