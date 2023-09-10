//this custom-hook if for providing the user the closing of the modal by clicking iutside of it
import { useEffect, useRef } from "react";

export default function useOutsideClick(handler, listenCapturing = true) {
    const ref = useRef()

    useEffect(
        function () {
            function handleClick(e) {
                if (ref.current && !ref.current.contains(e.target)) {// ref.current is the modal itself(we selected it in the StyledModal).// e.target is the entire-site itself.so if ref.current is true(exists) and if ref.current-element not contains e.target-element the user click is outside the modal so close the modal, but if ref.current-element contains e.target-element the user click is inside the modal so dont close it
                    handler();
                }
            }

            document.addEventListener("click", handleClick, listenCapturing); // we pass true for the 3rd entry of addEventlistener to fix the bubbling issue of the dom element // this true will prevent of the close()-function to run infinity becuse it will bubble up to the dom-tree

            return () => document.removeEventListener("click", handleClick, listenCapturing);
        },
        [handler, listenCapturing]
    );

    return ref
}


