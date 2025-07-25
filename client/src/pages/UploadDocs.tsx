import React, { useRef } from 'react';

interface Props {
  files: File[]; // ✅ Use array instead of FileList
  setFiles: (files: File[]) => void;
}

export const UploadDocs: React.FC<Props> = ({ files =[], setFiles }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles([...files, ...selectedFiles]); // ✅ append files
  };

  const handleRemove = (index: number) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
  };

  return (
    <div className="p-4 border border-dashed border-gray-300 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Upload PDFs</h3>

      <div
        onClick={handleClick}
        className="w-full h-40 border-2 border-dashed border-purple-400 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50 transition"
      >
        <span className="text-purple-600 font-medium">Click to browse or drop PDFs here</span>
        <span className="text-sm text-gray-500 mt-1">Multiple PDF files supported</span>
      </div>

      <input
        type="file"
        accept="application/pdf"
        multiple
        ref={fileInputRef}
        onChange={handleChange}
        className="hidden"
      />

      {files && files.length > 0 && (
        <ul className="mt-4 space-y-2 text-sm text-gray-700">
          {files.map((file, index) => (
            <li key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
              <span>📄 {file.name}</span>
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="text-red-500 text-xs hover:underline"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
