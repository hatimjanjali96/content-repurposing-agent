'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Link2, Upload, Download, FileText, X, CheckCircle, AlertCircle } from 'lucide-react';

export default function InputSection({ onGenerate, isGenerating }) {
  const [url, setUrl] = useState('');
  const [file, setFile] = useState(null);
  const [urlError, setUrlError] = useState('');
  const [urlTouched, setUrlTouched] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
    disabled: isGenerating
  });

  const validateUrl = (value) => {
    if (!value) {
      return 'URL is required';
    }
    try {
      const parsed = new URL(value);
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return 'URL must start with http:// or https://';
      }
      return '';
    } catch {
      return 'Please enter a valid URL';
    }
  };

  const handleUrlChange = (e) => {
    const value = e.target.value;
    setUrl(value);
    if (urlTouched) {
      setUrlError(validateUrl(value));
    }
  };

  const handleUrlBlur = () => {
    setUrlTouched(true);
    setUrlError(validateUrl(url));
  };

  const handleDownloadTemplate = () => {
    const link = document.createElement('a');
    link.href = '/Brand-Language-Guide-Template.txt';
    link.download = 'Brand-Language-Guide-Template.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = () => {
    const error = validateUrl(url);
    if (error) {
      setUrlError(error);
      setUrlTouched(true);
      return;
    }
    onGenerate({ url, file });
  };

  const removeFile = (e) => {
    e.stopPropagation();
    setFile(null);
  };

  const isValid = url && !validateUrl(url);

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Your Content Package</h2>

      {/* URL Input */}
      <div className="mb-6">
        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
          <Link2 className="w-4 h-4" />
          Blog Article URL
          <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="url"
            value={url}
            onChange={handleUrlChange}
            onBlur={handleUrlBlur}
            placeholder="https://example.com/blog/your-article"
            disabled={isGenerating}
            className={`w-full px-4 py-4 rounded-xl border-2 transition-all duration-200 outline-none
              ${urlError && urlTouched
                ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                : isValid
                  ? 'border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                  : 'border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'}
              ${isGenerating ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
            `}
          />
          {isValid && (
            <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
          )}
          {urlError && urlTouched && (
            <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-500" />
          )}
        </div>
        {urlError && urlTouched && (
          <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="w-4 h-4" />
            {urlError}
          </p>
        )}
      </div>

      {/* File Upload */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <FileText className="w-4 h-4" />
            Brand Language Guidelines
            <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <button
            onClick={handleDownloadTemplate}
            className="text-sm text-blue-600 hover:text-blue-700 hover:underline
                       flex items-center gap-1.5 transition-colors duration-200"
          >
            <Download className="w-4 h-4" />
            Download Template
          </button>
        </div>

        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer
            transition-all duration-200
            ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}
            ${isDragActive
              ? 'border-blue-500 bg-blue-50 scale-[1.02]'
              : file
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50/50'}
          `}
        >
          <input {...getInputProps()} />

          {file ? (
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
              <button
                onClick={removeFile}
                className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700 hover:underline"
              >
                <X className="w-4 h-4" />
                Remove file
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                <Upload className="w-6 h-6 text-gray-400" />
              </div>
              <div>
                <p className="text-gray-700">
                  {isDragActive ? 'Drop to upload' : 'Drop your file here, or click to browse'}
                </p>
                <p className="text-sm text-gray-500 mt-1">.pdf, .docx, .txt (Max 10MB)</p>
              </div>
            </div>
          )}
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Brand guidelines help ensure all content matches your voice and style
        </p>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleSubmit}
        disabled={!isValid || isGenerating}
        className={`w-full py-4 rounded-xl font-semibold text-white text-lg
          transition-all duration-200 shadow-lg flex items-center justify-center gap-2
          ${isValid && !isGenerating
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0'
            : 'bg-gray-400 cursor-not-allowed'}
        `}
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Generating...
          </>
        ) : (
          'Generate Content Package'
        )}
      </button>
    </div>
  );
}
