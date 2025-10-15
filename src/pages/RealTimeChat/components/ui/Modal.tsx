import { CloseCircleOutlined } from '@ant-design/icons'; 

interface OptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode; 
}

const Modal: React.FC<OptionsModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-gray-900/40 flex items-center justify-center"
        onClick={onClose}
      >
        <div
          className="relative bg-white rounded-2xl shadow-2xl p-8 w-96"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-red-500 hover:bg-red-50"
          >
            <CloseCircleOutlined className="text-lg" />
          </button>

          <h4 className="pb-12 text-center text-xl font-bold text-gray-900">{title}</h4>

          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;