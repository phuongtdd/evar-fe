import React, { useState } from 'react';
import KnowledgeBaseList from './components/layout/KnowledgeBaseList';
import KnowledgeBaseDetail from './components/layout/KnowledgeBaseDetail';
import { KnowledgeBase } from './types';

const LearningResources: React.FC = () => {
  const [selectedKnowledgeBase, setSelectedKnowledgeBase] = useState<KnowledgeBase | null>(null);

  const handleSelectKnowledgeBase = (kb: KnowledgeBase) => {
    setSelectedKnowledgeBase(kb);
  };

  const handleBack = () => {
    setSelectedKnowledgeBase(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {selectedKnowledgeBase ? (
        <KnowledgeBaseDetail
          knowledgeBase={selectedKnowledgeBase}
          onBack={handleBack}
        />
      ) : (
        <KnowledgeBaseList onSelectKnowledgeBase={handleSelectKnowledgeBase} />
      )}
    </div>
  );
};

export default LearningResources;
