'use client'

import { useState } from 'react'
import ImageUploader from '@/components/ImageUploader'
import UserInput from '@/components/UserInput'
import ColorCard from '@/components/ColorCard'
import Toast from '@/components/Toast'
import { extractDominantColor } from '@/lib/colorUtils'

type ToastType = 'success' | 'error' | 'info'

export default function Home() {
  const [imageUrl, setImageUrl] = useState<string>('')
  const [dominantColor, setDominantColor] = useState<string>('#FFFFFF')
  const [userName, setUserName] = useState<string>('')
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: '',
    type: 'info',
    isVisible: false,
  })

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type, isVisible: true })
  }

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }))
  }

  const handleImageUpload = async (url: string) => {
    setImageUrl(url)
    setIsProcessing(true)
    
    try {
      const color = await extractDominantColor(url)
      setDominantColor(color)
      showToast('Color extracted successfully!', 'success')
    } catch (error) {
      console.error('Color extraction error:', error)
      setDominantColor('#FFFFFF')
      showToast('Failed to extract color. Please try again.', 'error')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleNameChange = (name: string) => {
    setUserName(name)
  }

  const handleDownloadSuccess = () => {
    showToast('Card downloaded successfully!', 'success')
  }

  return (
    <main className="main-container" style={{ backgroundColor: '#191919' }}>
      <div className="main-wrapper">
        <div className="header-section">
          <h1 className="main-title">
            makeyourownpantonecard
          </h1>
          <p className="main-subtitle">
            Extract the dominant color from your photo and create your personal Pantone card
          </p>
        </div>
        
        <div className="content-grid">
          <div className="left-column">
            <ImageUploader onImageUpload={handleImageUpload} />
            <UserInput onNameChange={handleNameChange} />
            
            {/* Renk önizleme kutusu */}
            {dominantColor !== '#FFFFFF' && (
              <div className="color-preview-container animate-fade-in">
                <h3 className="color-preview-label">
                  Dominant Color
                </h3>
                <div className="color-preview-wrapper">
                  <div
                    className="color-preview-box"
                    style={{ backgroundColor: dominantColor }}
                  />
                  <div>
                    <p className="color-code-text">
                      {dominantColor.toUpperCase()}
                    </p>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(dominantColor)
                        showToast('Color code copied!', 'success')
                      }}
                      className="copy-button"
                    >
                      Copy hex code
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="right-column">
            <ColorCard
              color={dominantColor}
              userName={userName}
              imageUrl={imageUrl}
              isProcessing={isProcessing}
              onDownloadSuccess={handleDownloadSuccess}
            />
          </div>
        </div>
      </div>
      
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </main>
  )
}

