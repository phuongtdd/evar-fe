"use client"

import { ReactNode, useState } from "react"
import { Button, Input, Avatar } from "antd"
import { SendOutlined, SmileOutlined, LinkOutlined, PaperClipOutlined, CameraOutlined } from "@ant-design/icons"


interface TutorChatPanelProps {
  onPageJump?: (page: number) => void
}

function renderMessageWithPageLinks(content: string, onPageJump?: (page: number) => void): ReactNode {
  if (!onPageJump) return content

  const pageRegex = /$$(?:Nguồn|Source):\s*(?:Trang|Page)\s*(\d+)$$/g
  const parts: (string | ReactNode)[] = []
  let lastIndex = 0
  let match

  while ((match = pageRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.substring(lastIndex, match.index))
    }

    const pageNum = Number.parseInt(match[1], 10)
    parts.push(
      <button
        key={`page-${pageNum}-${match.index}`}
        onClick={() => onPageJump(pageNum)}
        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors text-sm font-medium"
      >
        {match[0]}
      </button>,
    )

    lastIndex = match.index + match[0].length
  }

  if (lastIndex < content.length) {
    parts.push(content.substring(lastIndex))
  }

  return parts.length > 0 ? parts : content
}

export default function TutorChatPanel({onPageJump} : TutorChatPanelProps) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "user",
      content: "tell me about reverse engineering",
    },
    {
      id: 2,
      type: "assistant",
      content: `Reverse engineering is the process of analyzing an existing system to understand its design, functionality, or underlying principles.

Based on my expertise as sai, reverse engineering is a really interesting field that involves taking something apart, whether it is software, hardware, or even a process, to figure out how it works. It is like being a detective for technology!

• Definition and Scope
  ○ Reverse engineering is all about deconstructing something to understand its inner workings. It is used across different areas:
    • Software reverse engineering involves analyzing programs to understand their code, algorithms, and data structures.
    • Hardware reverse engineering focuses on examining physical components, circuit boards, and integrated circuits to deduce their design and function.
    • Forensic reverse engineering helps in investigating digital crimes by reconstructing events from digital artifacts or analyzing malware.

• Goals of Reverse Engineering
  ○ The main purpose of reverse engineering can vary a lot, but some common goals include:
    • Understanding how a system works, especially when documentation is missing or incomplete.
    • Identifying vulnerabilities or security flaws in software or hardware.
    • Interoperating with other systems by understanding their communication protocols or data formats.
    • Recovering lost source code or design specifications.
    • Analyzing malware to understand its behavior and develop countermeasures.
    • Improving or redesigning existing products.

• Key Methodologies
  ○ There are generally two main approaches to reverse engineering:
    • Black-box analysis is when you analyze a system without any prior knowledge or documentation.`,
    },
  ])
  const [inputValue, setInputValue] = useState("")

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([
        ...messages,
        {
          id: messages.length + 1,
          type: "user",
          content: inputValue,
        },
      ])
      setInputValue("")
    }
  }

  return (
    <div className="!flex !flex-col !h-full !bg-white">
      <div className="!px-4 !py-3 !border-b !border-gray-200 !flex !items-center !justify-between">
        <h3 className="!text-sm !font-semibold !text-gray-900">AI Tutor</h3>
        <div className="!flex !gap-2">
          <Button type="text" size="small" className="!text-gray-400 !hover:text-gray-600">
            ⚙️
          </Button>
        </div>
      </div>

      <div className="!flex-1 !overflow-y-auto !p-4 !space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`!flex !gap-3 ${message.type === "user" ? "!justify-end" : "!justify-start"}`}
          >
            {message.type === "assistant" && (
              <Avatar
                size={32}
                className="!bg-orange-500 !flex !items-center !justify-center !text-white !font-bold !flex-shrink-0"
              >
                B
              </Avatar>
            )}
            <div
              className={`!max-w-xs !rounded-lg !p-3 !text-sm !leading-relaxed ${
                message.type === "user" ? "!bg-blue-600 !text-white" : "!bg-gray-100 !text-gray-900"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>

      <div className="!border-t !border-gray-200 !p-4 !space-y-3">
        <div className="!flex !gap-2">
          <Input
            placeholder="reply to Reverse Engineering sai..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onPressEnter={handleSendMessage}
            className="!rounded-lg !border-gray-300 [&.ant-input]:!bg-gray-50 [&.ant-input]:!text-gray-900 [&.ant-input::placeholder]:!text-gray-400"
          />
          <Button
            type="primary"
            icon={<SendOutlined />}
            onClick={handleSendMessage}
            className="!bg-blue-600 !border-0 !rounded-lg !h-10 !px-4 hover:!bg-blue-700"
          />
        </div>

        <div className="!flex !gap-2 !justify-center">
          <Button type="text" size="small" icon={<SmileOutlined />} className="!text-gray-400 !hover:text-gray-600" />
          <Button type="text" size="small" icon={<LinkOutlined />} className="!text-gray-400 !hover:text-gray-600" />
          <Button
            type="text"
            size="small"
            icon={<PaperClipOutlined />}
            className="!text-gray-400 !hover:text-gray-600"
          />
          <Button type="text" size="small" icon={<CameraOutlined />} className="!text-gray-400 !hover:text-gray-600" />
        </div>

        <div className="!text-center !text-xs !text-gray-400">Powered by Google</div>
      </div>
    </div>
  )
}
