/* eslint-disable no-unused-vars */
import { styled } from "styled-components";
import Logo from "./Logo"
import MainNav from "./MainNav"
import Uploader from "../data/Uploader";

const StyledSidebar = styled.aside`
    background-color: var(--color-grey-0);
    padding: 3.2rem 2.4rem;
    border-right: 1px solid var(--color-grey-100);

    grid-row: 1 / -1;
    display: flex;
    flex-direction: column;
    gap: 3.2rem;
`

function Sidebar() {
  return <StyledSidebar>
    <Logo/>
    <MainNav/>

    {/* <Uploader/> */} {/*//this is not part of the application //this component is for uploding the bookings and cabins and ... when there are deleted so use this when ever you like */}
  </StyledSidebar>;
}

export default Sidebar;
