'use client'

import { useRef, useState, useEffect } from 'react'
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
  const [isImageReady, setIsImageReady] = useState(false)
  const imageRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (imageUrl) {
      setIsImageReady(false)
    } else {
      setIsImageReady(false)
    }
  }, [imageUrl])

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
        cardImage.style.display = 'block'
        cardImage.style.visibility = 'visible'
        cardImage.style.opacity = '1'
        cardImage.style.width = '100%'
        cardImage.style.height = '100%'
        cardImage.style.objectFit = 'cover'
        
        const ensureImageFullyRendered = async (): Promise<void> => {
          return new Promise((resolve) => {
            const checkFullyRendered = () => {
              const isComplete = cardImage.complete
              const hasNaturalSize = cardImage.naturalWidth > 0 && cardImage.naturalHeight > 0
              const hasOffsetSize = cardImage.offsetWidth > 0 && cardImage.offsetHeight > 0
              const rect = cardImage.getBoundingClientRect()
              const hasBoundingRect = rect.width > 0 && rect.height > 0
              const computedStyle = window.getComputedStyle(cardImage)
              const isVisible = computedStyle.display !== 'none' && 
                               computedStyle.visibility !== 'hidden' && 
                               computedStyle.opacity !== '0'
              
              return isComplete && hasNaturalSize && hasOffsetSize && hasBoundingRect && isVisible
            }
            
            const waitForRender = () => {
              let attempts = 0
              const maxAttempts = 50
              
              const checkInterval = setInterval(() => {
                attempts++
                if (checkFullyRendered() || attempts >= maxAttempts) {
                  clearInterval(checkInterval)
                  setTimeout(() => resolve(), 1000)
                }
              }, 100)
            }
            
            if (checkFullyRendered()) {
              setTimeout(() => resolve(), 2000)
              return
            }
            
            let resolved = false
            const cleanup = () => {
              cardImage.removeEventListener('load', onLoad)
              cardImage.removeEventListener('error', onError)
            }
            
            const onLoad = () => {
              if (resolved) return
              setTimeout(() => {
                if (checkFullyRendered()) {
                  resolved = true
                  cleanup()
                  waitForRender()
                } else {
                  waitForRender()
                }
              }, 500)
            }
            
            const onError = () => {
              if (resolved) return
              resolved = true
              cleanup()
              resolve()
            }
            
            cardImage.addEventListener('load', onLoad)
            cardImage.addEventListener('error', onError)
            
            setTimeout(() => {
              if (resolved) return
              resolved = true
              cleanup()
              waitForRender()
            }, 15000)
            
            if (!cardImage.complete) {
              const originalSrc = cardImage.src
              const timestamp = new Date().getTime()
              const separator = originalSrc.includes('?') ? '&' : '?'
              cardImage.src = `${originalSrc}${separator}_t=${timestamp}`
            } else {
              waitForRender()
            }
          })
        }
        
        await ensureImageFullyRendered()
        
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        if (imageSection) {
          imageSection.style.overflow = 'hidden'
        }
      }
      
      const downloadImage = cardRef.current.querySelector('.card-image') as HTMLImageElement
      
      if (downloadImage && downloadImage.src) {
        const img = new Image()
        
        await new Promise<void>((resolve) => {
          img.onload = () => {
            setTimeout(() => resolve(), 1000)
          }
          img.onerror = () => resolve()
          img.src = downloadImage.src
          setTimeout(() => resolve(), 10000)
        })
        
        if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
          const canvas = document.createElement('canvas')
          canvas.width = sizeConfig.width * 2
          canvas.height = sizeConfig.height * 2
          const ctx = canvas.getContext('2d')
          
          if (ctx) {
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            
            const imageHeight = Math.floor(sizeConfig.height * (2/3) * 2)
            const imageWidth = sizeConfig.width * 2
            
            const imgAspect = img.naturalWidth / img.naturalHeight
            const targetAspect = imageWidth / imageHeight
            
            let drawWidth = imageWidth
            let drawHeight = imageHeight
            let drawX = 0
            let drawY = 0
            
            if (imgAspect > targetAspect) {
              drawHeight = imageHeight
              drawWidth = imageHeight * imgAspect
              drawX = (imageWidth - drawWidth) / 2
            } else {
              drawWidth = imageWidth
              drawHeight = imageWidth / imgAspect
              drawY = (imageHeight - drawHeight) / 2
            }
            
            ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)
            
            const textSectionY = imageHeight
            const textSectionHeight = (sizeConfig.height * 2) - imageHeight
            
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(0, textSectionY, canvas.width, textSectionHeight)
            
            const logo = textSection?.querySelector('img') as HTMLImageElement
            const userNameText = textSection?.querySelector('.user-name') as HTMLElement
            
            if (logo && logo.src) {
              const logoImg = new Image()
              await new Promise<void>((resolve) => {
                logoImg.onload = () => {
                  let logoHeight = 24 * 2
                  let paddingTop = 24 * 2
                  if (size === 'instagram-post') {
                    logoHeight = 72 * 2
                    paddingTop = 72 * 2
                  } else if (size === 'instagram-story') {
                    logoHeight = 96 * 2
                    paddingTop = 96 * 2
                  }
                  const logoY = textSectionY + paddingTop
                  const logoWidth = logoHeight * (logoImg.width / logoImg.height)
                  ctx.drawImage(logoImg, 32 * 2, logoY, logoWidth, logoHeight)
                  
                  if (userNameText && userNameText.textContent) {
                    ctx.fillStyle = '#000000'
                    let fontSize = 18 * 2
                    let marginTop = 24 * 2
                    if (size === 'instagram-post') {
                      fontSize = 54 * 2
                      marginTop = 72 * 2
                    } else if (size === 'instagram-story') {
                      fontSize = 72 * 2
                      marginTop = 96 * 2
                    }
                    ctx.font = `normal ${fontSize}px sans-serif`
                    const nameY = logoY + logoHeight + marginTop
                    ctx.fillText(userNameText.textContent, 32 * 2, nameY)
                  }
                  
                  resolve()
                }
                logoImg.onerror = () => resolve()
                logoImg.src = logo.src
                setTimeout(() => resolve(), 5000)
              })
            }
            
            const dataUrl = canvas.toDataURL('image/png', 1.0)
            
            const link = document.createElement('a')
            const sizeName = size === 'normal' ? '' : `-${size.replace('instagram-', '')}`
            link.download = `pantone-card-${userName || 'color'}${sizeName}.png`
            link.href = dataUrl
            link.click()
            
            if (onDownloadSuccess) {
              onDownloadSuccess()
            }
            
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
            
            setIsDownloading(false)
            return
          }
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 2000))
      
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
                ref={imageRef}
                src={imageUrl}
                alt="Pantone card image"
                className={`card-image ${
                  isProcessing ? 'image-opacity-processing' : 'image-opacity-full'
                }`}
                loading="eager"
                onLoad={() => {
                  if (imageRef.current && 
                      imageRef.current.complete && 
                      imageRef.current.naturalWidth > 0 && 
                      imageRef.current.naturalHeight > 0) {
                    setTimeout(() => {
                      setIsImageReady(true)
                    }, 3000)
                  }
                }}
                onError={() => {
                  setIsImageReady(true)
                }}
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

      {imageUrl && !isImageReady && (
        <div className="image-loading-indicator">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p className="loading-text">
              Preparing image for download, please wait...
            </p>
          </div>
        </div>
      )}

      <button
        onClick={() => handleDownload(cardSize)}
        disabled={isProcessing || !imageUrl || isDownloading || !isImageReady}
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

