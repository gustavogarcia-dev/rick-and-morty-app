import { useState, useEffect } from 'react';
import { ModalProps } from '../utils/types';


const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  const [show, setShow] = useState(isOpen);

  useEffect(() => {
    setShow(isOpen);
  }, [isOpen]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => onClose(), 300); // Delay to allow transition to finish
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-6">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75"
          onClick={handleClose}
        />
        <div
          className="bg-white rounded-lg shadow-xl transform transition-all sm:max-w-lg sm:w-full"
          style={{ transition: 'transform 0.3s ease-out, opacity 0.3s ease-out' }}
        >
          <div className="p-6">
            <h2 className="text-xl mb-4">{title}</h2>
            {children}
          </div>
          <div className="p-4 border-t border-gray-200">
            <button
              type="button"
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
