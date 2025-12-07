'use client'

import { useRef, useState } from 'react'
import { toPng } from 'html-to-image'

type CardSize = 'normal' | 'instagram-post' | 'instagram-story'

interface ColorCardProps {
  color: string
  userName: string
  imageUrl: string
  isProcessing: boolean
  onDownloadSuccess?: () => void
}

const cardSizes: Record<CardSize, { width: number; height: number; aspectRatio: string }> = {
  'normal': { width: 400, height: 533, aspectRatio: '3/4' },
  'instagram-post': { width: 1080, height: 1350, aspectRatio: '4/5' },
  'instagram-story': { width: 1080, height: 1920, aspectRatio: '9/16' },
}

export default function ColorCard({ color, userName, imageUrl, isProcessing, onDownloadSuccess }: ColorCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [cardSize, setCardSize] = useState<CardSize>('normal')
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async (size: CardSize = cardSize) => {
    if (!cardRef.current || isDownloading) return

    setIsDownloading(true)
    try {
      const sizeConfig = cardSizes[size]
      
      const imageSection = cardRef.current.querySelector('.image-section') as HTMLElement
      const textSection = cardRef.current.querySelector('.text-section') as HTMLElement
      
      const originalCardStyle = {
        width: cardRef.current.style.width || '',
        height: cardRef.current.style.height || '',
        maxWidth: cardRef.current.style.maxWidth || '',
        aspectRatio: cardRef.current.style.aspectRatio || '',
        padding: cardRef.current.style.padding || '',
        borderRadius: cardRef.current.style.borderRadius || '',
        margin: cardRef.current.style.margin || '',
      }
      
      const originalImageStyle = imageSection ? {
        height: imageSection.style.height || '',
        minHeight: imageSection.style.minHeight || '',
      } : null
      
      const originalTextStyle = textSection ? {
        height: textSection.style.height || '',
        minHeight: textSection.style.minHeight || '',
        padding: textSection.style.padding || '',
      } : null
      
      cardRef.current.style.width = `${sizeConfig.width}px`
      cardRef.current.style.height = `${sizeConfig.height}px`
      cardRef.current.style.maxWidth = 'none'
      cardRef.current.style.aspectRatio = 'auto'
      cardRef.current.style.padding = '0'
      cardRef.current.style.borderRadius = '0'
      cardRef.current.style.margin = '0'
      cardRef.current.style.boxSizing = 'border-box'
      
      const imageHeight = Math.floor(sizeConfig.height * (2/3))
      const textHeight = sizeConfig.height - imageHeight
      
      if (imageSection) {
        imageSection.style.height = `${imageHeight}px`
        imageSection.style.minHeight = `${imageHeight}px`
        imageSection.style.flexShrink = '0'
      }
      
      if (textSection) {
        textSection.style.height = `${textHeight}px`
        textSection.style.minHeight = `${textHeight}px`
        textSection.style.flexShrink = '0'
        
        if (size !== 'normal') {
          let paddingVertical: number
          let paddingHorizontal: number
          
          if (size === 'instagram-post') {
            paddingVertical = 72
            paddingHorizontal = 72
          } else {
            paddingVertical = 96
            paddingHorizontal = 96
          }
          
          textSection.style.padding = `${paddingVertical}px ${paddingHorizontal}px`
        }
        textSection.style.boxSizing = 'border-box'
        
        const logo = textSection.querySelector('img') as HTMLElement
        const userNameText = textSection.querySelector('.user-name') as HTMLElement
        const logoContainer = textSection.querySelector('.mb-2') as HTMLElement
        
        if (size !== 'normal') {
          if (logoContainer) {
            if (size === 'instagram-post') {
              logoContainer.style.marginBottom = '24px'
            } else {
              logoContainer.style.marginBottom = '32px'
            }
          }
          
          if (logo) {
            if (size === 'instagram-post') {
              logo.style.height = '72px'
            } else {
              logo.style.height = '96px'
            }
          }
          
          if (userNameText) {
            if (size === 'instagram-post') {
              userNameText.style.fontSize = '54px'
            } else {
              userNameText.style.fontSize = '72px'
            }
          }
        }
      }
      
      const cardImage = cardRef.current.querySelector('.card-image') as HTMLImageElement
      if (cardImage && cardImage.src) {
        await new Promise<void>((resolve) => {
          if (cardImage.complete && cardImage.naturalWidth > 0 && cardImage.naturalHeight > 0) {
            setTimeout(() => resolve(), 500)
            return
          }
          
          let resolved = false
          const onLoad = () => {
            if (resolved) return
            resolved = true
            cardImage.removeEventListener('load', onLoad)
            cardImage.removeEventListener('error', onError)
            setTimeout(() => resolve(), 500)
          }
          const onError = () => {
            if (resolved) return
            resolved = true
            cardImage.removeEventListener('load', onLoad)
            cardImage.removeEventListener('error', onError)
            resolve()
          }
          
          cardImage.addEventListener('load', onLoad, { once: true })
          cardImage.addEventListener('error', onError, { once: true })
          
          setTimeout(() => {
            if (resolved) return
            resolved = true
            cardImage.removeEventListener('load', onLoad)
            cardImage.removeEventListener('error', onError)
            resolve()
          }, 10000)
          
          if (!cardImage.complete) {
            const originalSrc = cardImage.src
            cardImage.src = ''
            cardImage.src = originalSrc
          }
        })
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      if (cardImage && cardImage.src) {
        cardImage.style.display = 'block'
        cardImage.style.visibility = 'visible'
        cardImage.style.opacity = '1'
        const img = new Image()
        img.crossOrigin = 'anonymous'
        await new Promise<void>((resolve) => {
          img.onload = () => {
            cardImage.src = img.src
            setTimeout(() => resolve(), 300)
          }
          img.onerror = () => resolve()
          img.src = cardImage.src
          setTimeout(() => resolve(), 2000)
        })
      }
      
      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        width: sizeConfig.width,
        height: sizeConfig.height,
        backgroundColor: '#FFFFFF',
        cacheBust: true,
        skipAutoScale: false,
      })

      cardRef.current.style.width = originalCardStyle.width
      cardRef.current.style.height = originalCardStyle.height
      cardRef.current.style.maxWidth = originalCardStyle.maxWidth
      cardRef.current.style.aspectRatio = originalCardStyle.aspectRatio
      cardRef.current.style.padding = originalCardStyle.padding
      cardRef.current.style.borderRadius = originalCardStyle.borderRadius
      cardRef.current.style.margin = originalCardStyle.margin
      cardRef.current.style.boxSizing = ''
      
      if (imageSection && originalImageStyle) {
        imageSection.style.height = originalImageStyle.height
        imageSection.style.minHeight = originalImageStyle.minHeight
        imageSection.style.flexShrink = ''
      }
      
      if (textSection && originalTextStyle) {
        textSection.style.height = originalTextStyle.height
        textSection.style.minHeight = originalTextStyle.minHeight
        textSection.style.padding = originalTextStyle.padding
        textSection.style.flexShrink = ''
        textSection.style.boxSizing = ''
        
        const logo = textSection.querySelector('img') as HTMLElement
        const userNameText = textSection.querySelector('.user-name') as HTMLElement
        const colorCodeText = textSection.querySelector('.color-code') as HTMLElement
        
        const logoContainer = textSection.querySelector('.mb-2') as HTMLElement
        if (logoContainer) {
          logoContainer.style.marginBottom = ''
        }
        
        if (logo) {
          logo.style.height = ''
        }
        if (userNameText) {
          userNameText.style.fontSize = ''
        }
      }

      const link = document.createElement('a')
      const sizeName = size === 'normal' ? '' : `-${size.replace('instagram-', '')}`
      link.download = `pantone-card-${userName || 'color'}${sizeName}.png`
      link.href = dataUrl
      link.click()
      
      if (onDownloadSuccess) {
        onDownloadSuccess()
      }
    } catch (error) {
      console.error('Download error:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  const sizeConfig = cardSizes[cardSize]

  return (
    <div className="card-container">
      <div className="size-selector-container">
        <button
          onClick={() => setCardSize('normal')}
          className={`size-button ${cardSize === 'normal' ? 'active' : ''}`}
        >
          Normal
        </button>
        <button
          onClick={() => setCardSize('instagram-post')}
          className={`size-button ${cardSize === 'instagram-post' ? 'active' : ''}`}
        >
          Instagram Post
        </button>
        <button
          onClick={() => setCardSize('instagram-story')}
          className={`size-button ${cardSize === 'instagram-story' ? 'active' : ''}`}
        >
          Instagram Story
        </button>
      </div>

      <div
        ref={cardRef}
        className={`pantone-card animate-fade-in ${
          cardSize === 'normal' 
            ? 'card-aspect-normal' 
            : cardSize === 'instagram-post' 
            ? 'card-aspect-instagram-post' 
            : 'card-aspect-instagram-story'
        }`}
      >
        <div className="card-image-section image-section">
          {imageUrl ? (
            <>
              {isProcessing && (
                <div className="loading-overlay">
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p className="loading-text">Analyzing color...</p>
                  </div>
                </div>
              )}
              <img
                src={imageUrl}
                alt="Pantone card image"
                className={`card-image ${
                  isProcessing ? 'image-opacity-processing' : 'image-opacity-full'
                }`}
                crossOrigin="anonymous"
                loading="eager"
              />
            </>
          ) : (
            <div className="card-placeholder">
              Upload a photo
            </div>
          )}
        </div>

        <div className="card-text-section text-section">
          <div className="card-text-content">
            <div className="logo-container">
              <img
                src="/images/pantonelogo.svg"
                alt="PANTONE"
                className="logo-image"
              />
            </div>
            
            {userName && (
              <p className="user-name">
                {userName}
              </p>
            )}
            {!userName && (
              <p className="empty-name-hint">
                Enter your name above
              </p>
            )}
          </div>
        </div>
      </div>

      <button
        onClick={() => handleDownload(cardSize)}
        disabled={isProcessing || !imageUrl || isDownloading}
        className="download-button"
      >
        {isDownloading ? (
          <span className="download-button-content">
            <svg className="download-spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Downloading...
          </span>
        ) : isProcessing ? (
          'Analyzing color...'
        ) : (
          'Download as PNG'
        )}
      </button>
    </div>
  )
}

