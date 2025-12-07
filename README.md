# makeyourownpantonecard

Create your own Pantone-style personal color card! Upload a photo, extract the dominant color, and generate a professional Pantone card design.

## Features

- 📸 Photo upload with drag & drop support
- 🎨 Automatic dominant color extraction from images
- 🎴 Pantone-style card design with PANTONE logo
- 👤 Customizable name on the card
- 💾 Download as high-quality PNG
- 📱 Multiple size options:
  - Normal (3:4 aspect ratio)
  - Instagram Post (4:5 aspect ratio)
  - Instagram Story (9:16 aspect ratio)
- ⚡ Real-time preview and updates
- 🌙 Dark mode UI
- 📋 Copy hex color code to clipboard
- ✨ Smooth animations and transitions

## Technologies

- **Next.js 15** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **html-to-image** (PNG export)
- **Canvas API** (Color extraction)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd makeyourownpantonecard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Upload a photo**: Drag and drop an image or click to browse
2. **Enter your name**: Type your name in the input field
3. **View your card**: The card will be automatically generated with the dominant color
4. **Choose size**: Select Normal, Instagram Post, or Instagram Story
5. **Download**: Click "Download as PNG" to save your card

## Project Structure

```
makeyourownpantonecard/
├── app/
│   ├── components.css      # Component styles
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main page
├── components/
│   ├── ColorCard.tsx       # Pantone card component
│   ├── Header.tsx          # Header with social links
│   ├── ImageUploader.tsx   # Photo upload component
│   ├── Toast.tsx           # Toast notifications
│   └── UserInput.tsx       # Name input component
├── lib/
│   └── colorUtils.ts       # Color extraction utilities
├── public/
│   └── images/
│       └── pantonelogo.svg # PANTONE logo
└── package.json
```

## Build for Production

```bash
npm run build
npm start
```

## License

MIT

## Author

Created with ❤️
