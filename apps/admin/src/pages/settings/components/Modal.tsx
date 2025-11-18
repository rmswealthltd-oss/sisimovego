import React from "react";

type ModalProps = {
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
  width?: string;
};

export default function Modal({ title, children, onClose, width = "w-96" }: ModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className={`${width} bg-white p-6 rounded-xl shadow-xl border relative`}
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h2 className="text-lg font-semibold mb-4">{title}</h2>}
        {children}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
