"use client"

import { useState } from "react"
import { Button, Space, Tooltip, Divider, ColorPicker, Select, Popover } from "antd"
import {
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  StrikethroughOutlined,
  AlignLeftOutlined,
  AlignCenterOutlined,
  AlignRightOutlined,
  UnorderedListOutlined,
  OrderedListOutlined,
  LinkOutlined,
  ClearOutlined,
} from "@ant-design/icons"

interface NotePageProps {
  type?: "material" | "quiz" | "flashcard"
}

export default function NotePage({ type = "material" }: NotePageProps) {
  const [content, setContent] = useState("")
  const [fontSize, setFontSize] = useState("16")
  const [fontFamily, setFontFamily] = useState("Arial")
  const [textColor, setTextColor] = useState("#000000")
  const [backgroundColor, setBackgroundColor] = useState("#ffffff")

  const fontSizes = [
    { label: "12px", value: "12" },
    { label: "14px", value: "14" },
    { label: "16px", value: "16" },
    { label: "18px", value: "18" },
    { label: "20px", value: "20" },
    { label: "24px", value: "24" },
    { label: "28px", value: "28" },
    { label: "32px", value: "32" },
  ]

  const fontFamilies = [
    { label: "Arial", value: "Arial" },
    { label: "Times New Roman", value: "Times New Roman" },
    { label: "Courier New", value: "Courier New" },
    { label: "Georgia", value: "Georgia" },
    { label: "Verdana", value: "Verdana" },
    { label: "Comic Sans MS", value: "Comic Sans MS" },
  ]

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all notes?")) {
      setContent("")
    }
  }

  const handleExport = () => {
    const element = document.createElement("a")
    const file = new Blob([content], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = `notes-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="!flex !flex-col !h-full !bg-white">
      {/* Header */}
      <div className="!flex !items-center !justify-between !px-4 !py-3 !border-b !border-gray-200 !bg-white">
        <h3 className="!text-gray-900 !font-semibold">Notes</h3>
        <div className="!text-sm !text-gray-600">{content.length} characters</div>
      </div>

      <div className="!px-4 !py-3 !border-b !border-gray-200 !bg-gray-50 !overflow-x-auto">
        <Space wrap size="small">
          <Tooltip title="Font Family">
            <Select value={fontFamily} onChange={setFontFamily} options={fontFamilies} className="!w-32" size="small" />
          </Tooltip>

          <Divider type="vertical" className="!h-6" />

          <Tooltip title="Font Size">
            <Select value={fontSize} onChange={setFontSize} options={fontSizes} className="!w-20" size="small" />
          </Tooltip>

          <Divider type="vertical" className="!h-6" />

          <Tooltip title="Text Color">
            <Popover
              content={
                <ColorPicker value={textColor} onChange={(color) => setTextColor(color.toHexString())} showText />
              }
              trigger="click"
              placement="bottomLeft"
            >
              <Button size="small" className="!text-gray-600" style={{ borderColor: textColor }}>
                A
              </Button>
            </Popover>
          </Tooltip>

          <Tooltip title="Highlight Color">
            <Popover
              content={
                <ColorPicker
                  value={backgroundColor}
                  onChange={(color) => setBackgroundColor(color.toHexString())}
                  showText
                />
              }
              trigger="click"
              placement="bottomLeft"
            >
              <Button size="small" className="!text-gray-600" style={{ backgroundColor }}>
                ◼
              </Button>
            </Popover>
          </Tooltip>

          <Divider type="vertical" className="!h-6" />

          <Tooltip title="Bold (Ctrl+B)">
            <Button icon={<BoldOutlined />} size="small" className="!text-gray-600" />
          </Tooltip>

          <Tooltip title="Italic (Ctrl+I)">
            <Button icon={<ItalicOutlined />} size="small" className="!text-gray-600" />
          </Tooltip>

          <Tooltip title="Underline (Ctrl+U)">
            <Button icon={<UnderlineOutlined />} size="small" className="!text-gray-600" />
          </Tooltip>

          <Tooltip title="Strikethrough">
            <Button icon={<StrikethroughOutlined />} size="small" className="!text-gray-600" />
          </Tooltip>

          <Divider type="vertical" className="!h-6" />

          <Tooltip title="Align Left">
            <Button icon={<AlignLeftOutlined />} size="small" className="!text-gray-600" />
          </Tooltip>

          <Tooltip title="Align Center">
            <Button icon={<AlignCenterOutlined />} size="small" className="!text-gray-600" />
          </Tooltip>

          <Tooltip title="Align Right">
            <Button icon={<AlignRightOutlined />} size="small" className="!text-gray-600" />
          </Tooltip>

          <Divider type="vertical" className="!h-6" />

          <Tooltip title="Bullet List">
            <Button icon={<UnorderedListOutlined />} size="small" className="!text-gray-600" />
          </Tooltip>

          <Tooltip title="Numbered List">
            <Button icon={<OrderedListOutlined />} size="small" className="!text-gray-600" />
          </Tooltip>

          <Divider type="vertical" className="!h-6" />

          <Tooltip title="Insert Link">
            <Button icon={<LinkOutlined />} size="small" className="!text-gray-600" />
          </Tooltip>

          <Divider type="vertical" className="!h-6" />

          <Tooltip title="Clear All">
            <Button icon={<ClearOutlined />} size="small" onClick={handleClear} className="!text-gray-600" />
          </Tooltip>

          <Button size="small" onClick={handleExport} className="!text-gray-600">
            Export
          </Button>
        </Space>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing your notes here... You can use the toolbar above to format your text."
        className="!flex-1 !p-4 !border-0 !outline-none !resize-none !font-sans"
        style={{
          fontFamily,
          fontSize: `${fontSize}px`,
          color: textColor,
          backgroundColor,
        }}
      />

      <div className="!flex !items-center !justify-between !px-4 !py-3 !border-t !border-gray-200 !bg-gray-50 !text-xs !text-gray-500">
        <div>Words: {content.split(/\s+/).filter((w) => w.length > 0).length}</div>
        <div>Last saved: {new Date().toLocaleTimeString()}</div>
      </div>
    </div>
  )
}
