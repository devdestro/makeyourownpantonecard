export const extractDominantColor = async (imageUrl: string): Promise<string> => {
  return extractSimpleColor(imageUrl)
}

const extractSimpleColor = (imageUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    
    img.onload = () => {
      try {
        if (img.width === 0 || img.height === 0 || !img.complete) {
          reject(new Error('Image not loaded or dimensions are invalid'))
          return
        }
        
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }
        
        const maxSize = 200
        const scale = Math.min(maxSize / img.width, maxSize / img.height, 1)
        const width = Math.max(1, Math.floor(img.width * scale))
        const height = Math.max(1, Math.floor(img.height * scale))
        
        canvas.width = width
        canvas.height = height
        
        ctx.drawImage(img, 0, 0, width, height)
        
        const imageData = ctx.getImageData(0, 0, width, height)
        const data = imageData.data
        
        const colorMap = new Map<string, number>()
        
        for (let i = 0; i < data.length; i += 40) {
          const r = data[i]
          const g = data[i + 1]
          const b = data[i + 2]
          
          const qr = Math.floor(r / 16) * 16
          const qg = Math.floor(g / 16) * 16
          const qb = Math.floor(b / 16) * 16
          
          const key = `${qr},${qg},${qb}`
          colorMap.set(key, (colorMap.get(key) || 0) + 1)
        }
        
        let maxCount = 0
        let dominantColor = [255, 255, 255]
        
        colorMap.forEach((count, key) => {
          if (count > maxCount) {
            maxCount = count
            const [r, g, b] = key.split(',').map(Number)
            dominantColor = [r, g, b]
          }
        })
        
        const hex = rgbToHex(dominantColor[0], dominantColor[1], dominantColor[2])
        resolve(hex)
      } catch (error) {
        reject(error)
      }
    }
    
    img.onerror = () => {
      reject(new Error('Image could not be loaded'))
    }
    
    img.src = imageUrl
  })
}

const rgbToHex = (r: number, g: number, b: number): string => {
  return '#' + [r, g, b].map(x => {
    const hex = x.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }).join('')
}

