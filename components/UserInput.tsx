'use client'

import { useState } from 'react'

interface UserInputProps {
  onNameChange: (name: string) => void
}

export default function UserInput({ onNameChange }: UserInputProps) {
  const [name, setName] = useState<string>('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setName(value)
    onNameChange(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    }
  }

  return (
    <div className="section-container">
      <h2 className="section-header">
        Your Name
      </h2>
      
      <input
        type="text"
        value={name}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Enter your name"
        className="text-input"
      />
      
      <p className="help-text">
        Your name will appear at the bottom of the card
      </p>
    </div>
  )
}

