import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  maxSize?: number;
  isUploading?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  accept = 'image/*',
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024, // 5MB
  isUploading = false,
}) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = [...uploadedFiles, ...acceptedFiles].slice(0, maxFiles);
      setUploadedFiles(newFiles);
      onFilesSelected(newFiles);
    },
    [uploadedFiles, maxFiles, onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept.split(',').reduce((acc, type) => ({ ...acc, [type.trim()]: [] }), {}),
    maxFiles,
    maxSize,
  });

  const removeFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    onFilesSelected(newFiles);
  };

  return (
    <div className="w-full">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p className="text-blue-500">Drop the files here...</p>
        ) : (
          <p className="text-gray-600">
            Drag 'n' drop some files here, or click to select files
          </p>
        )}
      </div>

      {uploadedFiles.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-medium mb-2">Uploaded Files:</h4>
          <ul className="space-y-2">
            {uploadedFiles.map((file, index) => (
              <li key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <div className="flex items-center">
                  {file.type.startsWith('image/') ? (
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="w-10 h-10 object-cover rounded mr-3"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded mr-3 flex items-center justify-center">
                      📄
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isUploading && (
        <div className="mt-4">
          <div className="bg-blue-100 border border-blue-300 rounded p-3">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
              <span className="text-blue-700">Uploading...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;