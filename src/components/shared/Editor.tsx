import type React from "react"

interface EditorProps {
  value: string
  onChange: (value: string) => void
}

const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={10}
      style={{ width: "100%", padding: "10px" }}
    />
  )
}

export default Editor

