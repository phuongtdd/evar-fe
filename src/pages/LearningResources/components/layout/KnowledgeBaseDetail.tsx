import React, { useState } from 'react';
import { Tabs, Button, Tag, Breadcrumb } from 'antd';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import { KnowledgeBase } from '../../types';
import FlashcardManager from './FlashcardManager';
import NoteManager from './NoteManager';
import KeynoteManager from './KeynoteManager';
import PDFManager from './PDFManager';

interface KnowledgeBaseDetailProps {
  knowledgeBase: KnowledgeBase;
  onBack: () => void;
}

const KnowledgeBaseDetail: React.FC<KnowledgeBaseDetailProps> = ({
  knowledgeBase,
  onBack,
}) => {
  const [activeTab, setActiveTab] = useState('flashcards');

  const tabItems = [
    {
      key: 'pdf',
      label: 'Tài liệu PDF',
      children: <PDFManager knowledgeBaseId={knowledgeBase.id} fileUrl={knowledgeBase.fileUrl} fileName={knowledgeBase.title} />,
    },
    {
      key: 'flashcards',
      label: `Flashcards (${knowledgeBase.flashcardCount})`,
      children: <FlashcardManager knowledgeBaseId={knowledgeBase.id} />,
    },
    {
      key: 'notes',
      label: `Notes (${knowledgeBase.noteCount})`,
      children: <NoteManager knowledgeBaseId={knowledgeBase.id} />,
    },
    {
      key: 'keynotes',
      label: `Keynotes (${knowledgeBase.keynoteCount})`,
      children: <KeynoteManager knowledgeBaseId={knowledgeBase.id} />,
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={onBack}
          className="mb-4"
        >
          Quay lại
        </Button>

        <Breadcrumb
          items={[
            {
              title: (
                <>
                  <HomeOutlined />
                  <span>Tài nguyên học tập</span>
                </>
              ),
            },
            {
              title: knowledgeBase.title,
            },
          ]}
          className="mb-4"
        />

        <div
          className="p-6 rounded-lg"
          style={{
            background: `linear-gradient(135deg, ${knowledgeBase.color || '#3b82f6'}22 0%, ${knowledgeBase.color || '#3b82f6'}11 100%)`,
            borderLeft: `4px solid ${knowledgeBase.color || '#3b82f6'}`,
          }}
        >
          <h1 className="text-3xl font-bold mb-2">{knowledgeBase.title}</h1>
          <p className="text-gray-700 mb-4">{knowledgeBase.description}</p>
          <div className="flex gap-2">
            <Tag color="blue">{knowledgeBase.subject}</Tag>
            <Tag color="green">Lớp {knowledgeBase.grade}</Tag>
            <Tag>Tạo bởi {knowledgeBase.createdBy}</Tag>
          </div>
        </div>
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={tabItems}
        size="large"
      />
    </div>
  );
};

export default KnowledgeBaseDetail;
