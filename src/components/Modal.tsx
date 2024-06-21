import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons';
import '../index.css';

interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

const Modal = ({ children, isOpen, onClose }: ModalProps) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modalOverlay">
      <div className="modal">
        <div className="modalContent">
          <button className="closeButton" onClick={onClose}>
            <FontAwesomeIcon icon={faWindowClose} />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
