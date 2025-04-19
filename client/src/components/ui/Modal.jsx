import { useEffect } from "react"
import "../../styles/components/ui/Modal.css"

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
                    <button className="close-the-modal" onClick={onClose}>✕</button>
                    {children}
                </div>
            </div>
        </>
    )
}

export default Modal