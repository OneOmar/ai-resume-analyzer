import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { formatSize } from '../lib/utils'

interface FileUploaderProps {
  onFileSelect?: (file: File | null) => void
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
  const MAX_SIZE = 20 * 1024 * 1024 // 20MB limit

  // Handle file drop/selection
  const handleDrop = useCallback(
    (accepted: File[]) => onFileSelect?.(accepted[0] || null),
    [onFileSelect]
  )

  // Remove selected file
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    onFileSelect?.(null)
  }

  // Dropzone setup
  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    onDrop: handleDrop,
    multiple: false,
    accept: { 'application/pdf': ['.pdf'] },
    maxSize: MAX_SIZE,
  })

  const selectedFile = acceptedFiles[0]

  return (
    <div className="w-full gradient-border">
      <div {...getRootProps()} className="cursor-pointer">
        <input {...getInputProps()} />

        {selectedFile ? (
          // File preview
          <div className="uploader-selected-file" onClick={(e) => e.stopPropagation()}>
            <img src="/images/pdf.png" alt="PDF" className="size-10" />
            <div>
              <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                {selectedFile.name}
              </p>
              <p className="text-sm text-gray-500">{formatSize(selectedFile.size)}</p>
            </div>
            <button className="p-2 cursor-pointer" onClick={handleRemove}>
              <img src="/icons/cross.svg" alt="Remove" className="w-4 h-4" />
            </button>
          </div>
        ) : (
          // Upload prompt
          <div className="text-center">
            <img src="/icons/info.svg" alt="Upload" className="size-20 mx-auto mb-2" />
            <p className="text-lg text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-lg text-gray-500">PDF (max {formatSize(MAX_SIZE)})</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FileUploader