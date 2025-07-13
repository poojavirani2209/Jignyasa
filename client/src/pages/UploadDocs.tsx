import React, { useState } from "react";
import api from "../services/api";

interface Props {
  files: FileList | null;
  setFiles: (files: FileList | null) => void;
}
export const UploadDocs: React.FC<Props> = ({ files, setFiles }) => {
  return (
    <div className="p-4 border rounded shadow-md">
      <h3 className="text-lg font-semibold mb-2">Upload PDFs</h3>
      <input
        type="file"
        accept="application/pdf"
        multiple
        onChange={(e) => setFiles(e.target.files)}
        className="mb-3"
      />
    </div>
  );
};
