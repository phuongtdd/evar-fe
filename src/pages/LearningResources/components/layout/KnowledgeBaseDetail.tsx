import React from 'react';
import { Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import StudyMaterialLayout from '../../../Material/components/layout/study-material-layout';

interface KnowledgeBaseDetailProps {
  // Keeping the original props for compatibility, but this implementation delegates to StudyMaterialLayout
  knowledgeBase: any;
  onBack: () => void;
}

const KnowledgeBaseDetail: React.FC<KnowledgeBaseDetailProps> = ({ knowledgeBase, onBack }) => {
  return (
    <div className="min-h-screen bg-white">
      <div className="px-6 pt-6">
        <Button icon={<ArrowLeftOutlined />} onClick={onBack} className="mb-4">
          Quay lại
        </Button>
      </div>
      <StudyMaterialLayout knowledgeBaseId={knowledgeBase?.id} />
    </div>
  );
};

export default KnowledgeBaseDetail;
