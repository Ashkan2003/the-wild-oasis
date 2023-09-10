/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { cloneElement, createContext, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import styled from "styled-components";
import useOutsideClick from "../hooks/useOutsideClick";

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    /* Sometimes we need both */
    /* fill: var(--color-grey-500);
    stroke: var(--color-grey-500); */
    color: var(--color-grey-500);
  }
`;
// creating compound-component-pattern

// 1. create a new context
const ModalContext = createContext();

// 2.create the parent-component
function Modal({ children }) {
  // we used a trick to open and close the modal.in the AddCabin.jsx-file we pass "opens" and "name" prop to the Open and Window component.when ever these to are the same then open the modal but if thre are not the same then close the modal
  const [openName, setOpenName] = useState("");

  const close = () => setOpenName("");
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ children, opens: opensWindowName }) {
  const { open } = useContext(ModalContext);
  return cloneElement(children, { onClick: () => open(opensWindowName) }); //cloneElement: pass a onClick-event to what-ever  elemnt the user pass the children(like a self-created-Button-element)
}

function Window({ children, name }) {
  const { openName, close } = useContext(ModalContext);

  const ref = useOutsideClick(close); //this custom-hook if for providing the user the closing of the modal by clicking outside of it

  // when ever the name and openName are the same open the modal
  // when ever the name and openName are not the same, modal atomaticly closed
  if (name !== openName) return null;

  return createPortal(
    // createPortal accepts two value. first: the jsx-code, second: where this jsx-code should render on dom-tree.why are we useing createPortal in the Modal-component: becuse the Modal-component is a reuseble-component but it might br confilict with css-overflow-hidden so we use createPortal to put this component on the top of the Dom so the overflow-hidden dont confilict with it
    <Overlay>
      <StyledModal ref={ref}>
        {" "}
        {/*the ref is the modal itself */}
        <Button onClick={close}>
          <HiXMark />
        </Button>
        <div>{cloneElement(children, { onCloseModal: close })}</div>
      </StyledModal>
    </Overlay>,
    document.body
  );
}

Modal.Open = Open;
Modal.Window = Window;

export default Modal;
