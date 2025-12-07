'use client'

import { useState, useRef } from 'react'

interface ImageUploaderProps {
  onImageUpload: (url: string) => void
}

export default function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string>('')
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      console.error('Please select an image file')
      return
    }
    
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      console.error('File size too large. Maximum size is 10MB.')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setPreview(result)
      onImageUpload(result)
    }
    reader.readAsDataURL(file)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFile(file)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  return (
    <div className="section-container">
      <h2 className="section-header">
        Upload Photo
      </h2>
      
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`upload-area ${isDragging ? 'dragging' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        
        {preview ? (
          <div className="space-y-3">
            <img
              src={preview}
              alt="Preview"
              className="preview-image"
            />
            <p className="preview-text">
              Click to upload a new photo
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <svg
              className="upload-icon"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p className="upload-text">
              Drag and drop your photo here or click to browse
            </p>
            <p className="upload-hint">
              PNG, JPG, GIF supported
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

