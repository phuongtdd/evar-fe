"use client";

import { useState, useEffect } from "react";
import { Card, Tabs, Input, Button, message, Spin, Alert } from "antd";
import { SaveOutlined, FileTextOutlined, BookOutlined, EditOutlined, ReloadOutlined } from "@ant-design/icons";
import { KnowledgeBase, KeyNotesResponse } from "../../types";
import { knowledgeBaseService } from "../../hooks/evarTutorHooks";

const { TextArea } = Input;

interface StudyingGuidanceProps {
  knowledgeBaseId: number;
  knowledgeBase?: KnowledgeBase;
}

export default function StudyingGuidance({ knowledgeBaseId, knowledgeBase }: StudyingGuidanceProps) {
  const [activeTab, setActiveTab] = useState("studyGuide");
  const [studyGuide, setStudyGuide] = useState("");
  const [keyNotes, setKeyNotes] = useState("");
  const [userNote, setUserNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [regenerating, setRegenerating] = useState<{ guide: boolean; notes: boolean }>({ guide: false, notes: false });
  const [parsedKeyNotes, setParsedKeyNotes] = useState<KeyNotesResponse | null>(null);

  useEffect(() => {
    if (knowledgeBase) {
      setStudyGuide(knowledgeBase.studyGuide || "");
      setKeyNotes(knowledgeBase.keyNotes || "");
      setUserNote(knowledgeBase.userNote || "");
    }
  }, [knowledgeBase]);

  const refreshDetail = async () => {
    try {
      setLoading(true);
      const detail = await knowledgeBaseService.getKnowledgeBaseDetail(knowledgeBaseId);
      setStudyGuide(detail.studyGuide || "");
      setKeyNotes(detail.keyNotes || "");
      setUserNote(detail.userNote || "");
      try {
        const kn = await knowledgeBaseService.getKeyNotes(knowledgeBaseId);
        setParsedKeyNotes(kn);
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [knowledgeBaseId]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await knowledgeBaseService.updateUserNote(knowledgeBaseId, userNote);
      message.success("Saved successfully!");
    } catch (error) {
      message.error("Failed to save");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleRegenerateStudyGuide = async () => {
    setRegenerating(prev => ({ ...prev, guide: true }));
    try {
      const guide = await knowledgeBaseService.regenerateStudyGuide(knowledgeBaseId);
      setStudyGuide(guide || "");
      message.success("Study guide regenerated");
    } catch (e) {
      message.error("Failed to regenerate study guide");
    } finally {
      setRegenerating(prev => ({ ...prev, guide: false }));
    }
  };

  const handleRegenerateKeyNotes = async () => {
    setRegenerating(prev => ({ ...prev, notes: true }));
    try {
      const notes = await knowledgeBaseService.regenerateKeyNotes(knowledgeBaseId);
      setKeyNotes(notes || "");
      const kn = await knowledgeBaseService.getKeyNotes(knowledgeBaseId);
      setParsedKeyNotes(kn);
      message.success("Key notes regenerated");
    } catch (e) {
      message.error("Failed to regenerate key notes");
    } finally {
      setRegenerating(prev => ({ ...prev, notes: false }));
    }
  };

  const handleStudyGuideChange = (value: string) => {
    setStudyGuide(value);
  };

  const handleKeyNotesChange = (value: string) => {
    setKeyNotes(value);
  };

  const handleUserNoteChange = (value: string) => {
    setUserNote(value);
  };

  return (
    <div className="!flex !flex-col !h-full !bg-gray-50 !p-4">
      <div className="!mb-4">
        <h3 className="!text-lg !font-semibold !text-gray-900">Studying Guidance</h3>
        <p className="!text-sm !text-gray-600">Manage your study guide, key notes, and personal notes</p>
      </div>

      <Alert
        message="📖 Keynotes are automatically generated from your uploaded PDF"
        description="When you upload a PDF in the chatbot section, the system automatically extracts key information and generates study guides and keynotes for you."
        type="info"
        showIcon
        closable
        className="!mb-4"
      />

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        className="!bg-white !rounded-lg"
        items={[
          {
            key: "studyGuide",
            label: (
              <span className="!flex !items-center !gap-2">
                <BookOutlined />
                Study Guide
              </span>
            ),
          },
          {
            key: "keyNotes",
            label: (
              <span className="!flex !items-center !gap-2">
                <FileTextOutlined />
                Key Notes
              </span>
            ),
          },
          {
            key: "userNote",
            label: (
              <span className="!flex !items-center !gap-2">
                <EditOutlined />
                My Notes
              </span>
            ),
          },
        ]}
      />

      <div className="!flex-1 !mt-4 !overflow-auto">
        <Card className="!h-full">
          {activeTab === "studyGuide" && (
            <div className="!flex !flex-col !h-full">
              <div className="!mb-2">
                <p className="!text-sm !text-gray-600 !mb-2">
                  Study Guide: Comprehensive guidance for understanding the material
                </p>
                <Button size="small" icon={<ReloadOutlined />} loading={regenerating.guide} onClick={handleRegenerateStudyGuide}>
                  Regenerate
                </Button>
              </div>
              <TextArea
                value={studyGuide}
                onChange={(e) => handleStudyGuideChange(e.target.value)}
                placeholder="Study guide (read-only from AI)"
                className="!flex-1 !min-h-[400px]"
                readOnly
              />
            </div>
          )}

          {activeTab === "keyNotes" && (
            <div className="!flex !flex-col !h-full">
              <div className="!mb-2">
                <p className="!text-sm !text-gray-600 !mb-2">
                  Key Notes: Important points and summary
                </p>
                <Button size="small" icon={<ReloadOutlined />} loading={regenerating.notes} onClick={handleRegenerateKeyNotes}>
                  Regenerate
                </Button>
              </div>
              {parsedKeyNotes?.notes?.length ? (
                <div className="!space-y-2 !overflow-auto">
                  {parsedKeyNotes.notes.map(n => (
                    <div key={n.id} className="!border !border-gray-200 !rounded !p-2">
                      <div className="!text-sm !text-gray-900">{n.content}</div>
                      {n.pageNumber !== null && (
                        <div className="!text-xs !text-gray-500">Page {n.pageNumber}</div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <TextArea
                  value={keyNotes}
                  onChange={(e) => handleKeyNotesChange(e.target.value)}
                  placeholder="Key notes (read-only from AI)"
                  className="!flex-1 !min-h-[400px]"
                  readOnly
                />
              )}
            </div>
          )}

          {activeTab === "userNote" && (
            <div className="!flex !flex-col !h-full">
              <div className="!mb-2">
                <p className="!text-sm !text-gray-600 !mb-2">
                  My Notes: Your personal notes and observations
                </p>
              </div>
              <TextArea
                value={userNote}
                onChange={(e) => handleUserNoteChange(e.target.value)}
                placeholder="Enter your personal notes..."
                className="!flex-1 !min-h-[400px]"
              />
            </div>
          )}
        </Card>
      </div>

      <div className="!flex !justify-end !gap-2 !mt-4">
        <Button
          type="primary"
          icon={<SaveOutlined />}
          loading={saving}
          onClick={handleSave}
          className="!bg-blue-600 !border-blue-600 hover:!bg-blue-700 hover:!border-blue-700"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}

