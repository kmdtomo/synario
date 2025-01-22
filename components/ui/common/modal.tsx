interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full transform transition-all">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        </div>
        <div className="p-6">
          {children}
        </div>
        <div className="p-6 pt-0">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 font-medium"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
} 