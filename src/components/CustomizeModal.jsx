import React from "react";

const CustomizeModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
  danger = false,
}) => {
  if (!isOpen) return null; // modal hidden if not open

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4 sm:px-0">
      <div className="bg-gray-100 border border-gray-300 shadow-2xl rounded-xl w-full max-w-sm sm:max-w-md p-5 sm:p-6 transition-all duration-300">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
          {title}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-6">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-md border border-gray-400 text-gray-800 hover:bg-gray-200 transition"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`w-full sm:w-auto px-4 py-2 rounded-md text-white transition ${danger
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gray-700 hover:bg-gray-800"
              } ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomizeModal;
