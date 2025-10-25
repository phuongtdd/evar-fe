"use client"

import type React from "react"
import { LinkedinOutlined, TwitterOutlined, GithubOutlined, MailOutlined } from "@ant-design/icons"
import SectionContainer from "./SectionContainer"

const SiteFooter: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      <SectionContainer className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent mb-4">
              Evar
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Empowering education through innovative technology. Virtual classrooms, AI tutoring, and collaborative
              learning.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                <LinkedinOutlined className="text-xl" />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                <TwitterOutlined className="text-xl" />
              </a>
              <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">
                <GithubOutlined className="text-xl" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Tính năng</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  AI OCR Quiz
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Anti-cheat
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Real-time class
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Hỗ trợ</h4>
            <ul className="space-y-3 text-slate-400 text-sm">
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Help center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Contact us
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Liên hệ</h4>
            <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
              <MailOutlined />
              <span>support@evar.com</span>
            </div>
            <p className="text-slate-500 text-xs">© 2025 Evar. All rights reserved.</p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-slate-400 text-sm">
            <p>Made with ❤️ for educators and learners</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-blue-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-blue-400 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </SectionContainer>
    </footer>
  )
}

export default SiteFooter
