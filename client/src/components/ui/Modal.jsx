import { useEffect } from "react"
import "../../styles/components/ui/Navbar.css"

const Modal = ({ isOpen, onClose, children }) => {

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === "Escape") onClose();
        };
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [onClose]);

    if (!isOpen) return null;

    return(
        <>
            <div className="dimmed-background">
                <div className="modal-container">
                    <button onClick={onClose}>✕</button>
                </div>
                {children}
            </div>
        </>
    )
}

export default Modal