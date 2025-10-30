import apiClient from '../../../configs/axiosConfig';
import { KnowledgeBase, Flashcard, Note, Keynote, CreateKnowledgeBaseRequest } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const getRealUserId = (): string => {
  const explicit = localStorage.getItem('userId');
  if (explicit && explicit !== 'default-user') return explicit;
  
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const [, payloadB64] = token.split('.');
      const payload = JSON.parse(atob(payloadB64));
      const userId = payload?.userId || payload?.id || payload?.sub || payload?.user?.id;
      if (userId) return userId;
    } catch (e) {
      console.error('Failed to parse JWT token:', e);
    }
  }
  
  return 'default-user';
};

export const knowledgeBaseService = {

  getAllKnowledgeBases: async (): Promise<KnowledgeBase[]> => {
    const userId = getRealUserId();
    // console.log('📚 Fetching knowledge bases for userId:', userId);
    
    const response = await apiClient.get(`/knowledge/user/${userId}`);
    const kbList = Array.isArray(response.data) ? response.data : [];
    
    // console.log('Received', kbList.length, 'knowledge bases');
    
    let allCardSets: any[] = [];
    try {
      const setsResponse = await apiClient.get(`/card-set/my?userId=${userId}`);
      allCardSets = Array.isArray(setsResponse.data) ? setsResponse.data : [];
      console.log(' Fetched', allCardSets.length, 'card sets');
      
      const linkedSets = allCardSets.filter(s => s.knowledgeBaseId !== null);
    
      if (linkedSets.length > 0) {
        console.log('  Linked KB IDs:', linkedSets.map(s => s.knowledgeBaseId));
      }
    } catch (error) {
      console.warn('Failed to fetch card sets:', error);
    }
    
    const kbWithCounts = await Promise.all(kbList.map(async (kb: any) => {
      const kbId = kb.id?.toString() || kb.knowledgeBaseId?.toString();
      const kbIdNum = parseInt(kbId); 
    
      let flashcardCount = 0;
      
      let kbSet = allCardSets.find((s: any) => {
        const setKbId = s.knowledgeBaseId;
        return setKbId !== null && setKbId !== undefined && setKbId === kbIdNum;
      });
      
      if (!kbSet && kb.fileName) {
        kbSet = allCardSets.find((s: any) => 
          s.knowledgeBaseId === null && s.name && s.name.includes(kb.fileName)
        );
        if (kbSet) {
          console.log(`✅ KB ${kbId}: Found card set by fileName match "${kbSet.name}"`);
        }
      }
      
      if (kbSet) {
        flashcardCount = 1;
        const totalCards = kbSet.totalCards || kbSet.flashcardCount || 0;
        console.log(`✅ KB ${kbId}: Found 1 card set "${kbSet.name}" with ${totalCards} cards inside`);
      }
      
      let noteCount = 0;
      let keynoteCount = 0;
      
      try {
        const detailResponse = await apiClient.get(`/knowledge/${kbId}`);
        const detail = detailResponse.data;
        noteCount = (detail.userNote && detail.userNote.trim() !== '') ? 1 : 0;
        keynoteCount = (detail.keyNotes && detail.keyNotes.trim() !== '') ? 1 : 0;
      } catch (error) {
        console.warn(`⚠️ Failed to fetch detail for KB ${kbId}:`, error);
      }
      
      return {
        id: kbId,
        title: kb.fileName || kb.title || 'Untitled',
        description: kb.description || kb.summary || 'No description',
        subject: kb.subject || 'Chưa phân loại',
        grade: kb.grade || '12',
        createdBy: kb.createdBy || kb.userId || 'Unknown',
        createdAt: kb.createdAt || new Date().toISOString(),
        updatedAt: kb.updatedAt || new Date().toISOString(),
        flashcardCount,
        noteCount,
        keynoteCount,
        color: kb.color || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
        fileUrl: kb.fileUrl,
      };
    }));
    
    console.log(' Knowledge bases with counts loaded successfully');
    return kbWithCounts;
  },

  getKnowledgeBaseById: async (id: string): Promise<KnowledgeBase> => {
    console.log(' Fetching knowledge base:', id);
    const response = await apiClient.get(`/knowledge/${id}`);
    const kb = response.data;
    
    return {
      id: kb.id?.toString() || kb.knowledgeBaseId?.toString(),
      title: kb.fileName || kb.title || 'Untitled',
      description: kb.description || kb.summary || 'No description',
      subject: kb.subject || 'Chưa phân loại',
      grade: kb.grade || '12',
      createdBy: kb.createdBy || kb.userId || 'Unknown',
      createdAt: kb.createdAt || new Date().toISOString(),
      updatedAt: kb.updatedAt || new Date().toISOString(),
      flashcardCount: kb.flashcardCount || 0,
      noteCount: kb.noteCount || 0,
      keynoteCount: kb.keynoteCount || 0,
      color: kb.color || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      fileUrl: kb.fileUrl,
    };
  },

  createKnowledgeBase: async (file: File, metadata: CreateKnowledgeBaseRequest): Promise<KnowledgeBase> => {
    const userId = getRealUserId();
    console.log(' Uploading knowledge base for userId:', userId);
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', userId);
    formData.append('subject', metadata.subject);
    formData.append('grade', metadata.grade);
    if (metadata.description) {
      formData.append('description', metadata.description);
    }
    
    const response = await apiClient.post('/knowledge/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    const kb = response.data;
    console.log(' Knowledge base created:', kb);
    
    return {
      id: kb.id?.toString() || kb.knowledgeBaseId?.toString(),
      title: kb.fileName || metadata.title || file.name,
      description: metadata.description || kb.summary || 'No description',
      subject: metadata.subject,
      grade: metadata.grade,
      createdBy: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      flashcardCount: 0,
      noteCount: 0,
      keynoteCount: 0,
      color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      fileUrl: kb.fileUrl,
    };
  },

  updateKnowledgeBase: async (id: string, data: Partial<CreateKnowledgeBaseRequest>): Promise<KnowledgeBase> => {
    console.log('✏️ Updating knowledge base:', id);
    const response = await apiClient.put(`/knowledge/${id}`, data);
    const kb = response.data;
    
    return {
      id: kb.id?.toString() || kb.knowledgeBaseId?.toString(),
      title: kb.fileName || kb.title || 'Untitled',
      description: kb.description || kb.summary || 'No description',
      subject: kb.subject || data.subject || 'Chưa phân loại',
      grade: kb.grade || data.grade || '12',
      createdBy: kb.createdBy || kb.userId || 'Unknown',
      createdAt: kb.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      flashcardCount: kb.flashcardCount || 0,
      noteCount: kb.noteCount || 0,
      keynoteCount: kb.keynoteCount || 0,
      color: kb.color || `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      fileUrl: kb.fileUrl,
    };
  },

  deleteKnowledgeBase: async (id: string): Promise<void> => {
    console.log(' Starting deletion process for knowledge base:', id);
    const userId = getRealUserId();
    
    try {
      const kbResponse = await apiClient.get(`/knowledge/${id}`);
      const kb = kbResponse.data;
      const fileName = kb.fileName;
      
      try {
        const setsResponse = await apiClient.get(`/card-set/my?userId=${userId}`);
        const sets = Array.isArray(setsResponse.data) ? setsResponse.data : [];
        
        const relatedSets = sets.filter((s: any) => {
          if (s.knowledgeBaseId?.toString() === id) return true;
          if (s.knowledgeBaseId === null && fileName && s.name && s.name.includes(fileName)) return true;
          return false;
        });
        
        for (const set of relatedSets) {
          await apiClient.delete(`/card-set/${set.id}`);
        }
        console.log(` Deleted ${relatedSets.length} card set(s)`);
      } catch (error) {
        console.warn('Failed to delete card sets:', error);
      }
      
      if (kb.fileUrl) {
        console.log(' Deleting file from remote cloud...');
        try {
          const urlParts = kb.fileUrl.split('/');
          const uploadIndex = urlParts.indexOf('upload');
          if (uploadIndex !== -1 && uploadIndex + 2 < urlParts.length) {
            const publicIdWithExt = urlParts.slice(uploadIndex + 2).join('/');
            const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
            
            console.log(` Deleting file with public_id: ${publicId}`);
            await apiClient.delete('/cloudinary/delete', {
              data: { publicId }
            });
            console.log(' File deleted from Cloudinary');
          }
        } catch (error) {
          console.warn(' Failed to delete file from Cloudinary:', error);
        }
      }

      await apiClient.delete(`/knowledge/delete/${id}`);
      
      console.log(' Knowledge base and all related resources deleted successfully');
    } catch (error) {
      console.error(' Failed to delete knowledge base:', error);
      throw error;
    }
  },
};

// Flashcard Service
export const flashcardService = {
  getOrCreateCardSet: async (knowledgeBaseId: string): Promise<string> => {
    const userId = getRealUserId();
    const setsResponse = await apiClient.get(`/card-set/my?userId=${userId}`);
    const sets = Array.isArray(setsResponse.data) ? setsResponse.data : [];
    
    const kbResponse = await apiClient.get(`/knowledge/${knowledgeBaseId}`);
    const fileName = kbResponse.data?.fileName;
    
    let targetSet = sets.find((s: any) => {
      if (s.knowledgeBaseId?.toString() === knowledgeBaseId) return true;
      if (s.knowledgeBaseId === null && fileName && s.name && s.name.includes(fileName)) return true;
      return false;
    });
    
    if (!targetSet) {
      console.log('➕ Creating new card set for KB:', knowledgeBaseId);
      const createSetResponse = await apiClient.post('/card-set/generate/ai', null, {
        params: {
          knowledgeBaseId: knowledgeBaseId,
          count: 0
        }
      });
      targetSet = createSetResponse.data;
    }
    
    return targetSet.id;
  },

  getFlashcardsByKnowledgeBaseId: async (knowledgeBaseId: string): Promise<{ flashcards: Flashcard[], cardSetId: string | null }> => {
    const userId = getRealUserId();
    console.log('🎴 [LEARNING] Fetching flashcards for KB:', knowledgeBaseId);
    
    const kbResponse = await apiClient.get(`/knowledge/${knowledgeBaseId}`);
    const fileName = kbResponse.data?.fileName;
    console.log('📄 [LEARNING] KB fileName:', fileName);
    
    const response = await apiClient.get(`/card-set/my?userId=${userId}`);
    const sets = Array.isArray(response.data) ? response.data : [];
    
    console.log('📦 [LEARNING] Received', sets.length, 'card sets');
    
   
    const kbSets = sets.filter((s: any) => {
      if (s.knowledgeBaseId !== null && s.knowledgeBaseId?.toString() === knowledgeBaseId) {
        console.log('✅ [LEARNING] Found set by knowledgeBaseId:', s.name);
        return true;
      }
      if (s.knowledgeBaseId === null && fileName && s.name && s.name.includes(fileName)) {
        console.log('✅ [LEARNING] Found set by fileName match:', s.name);
        return true;
      }
      return false;
    });
    
    if (kbSets.length === 0) {
      console.warn(' [LEARNING] No card sets found for KB:', knowledgeBaseId);
      return { flashcards: [], cardSetId: null };
    }
    
    console.log(' [LEARNING] Found', kbSets.length, 'sets for KB', knowledgeBaseId);
    
    const allFlashcards: any[] = [];
    let cardSetId: string | null = null;
    for (const set of kbSets) {
      console.log(' [LEARNING] Fetching flashcards from set:', set.id, '(', set.name, ')');
      if (!cardSetId) cardSetId = set.id; 
      const detailResponse = await apiClient.get(`/card-set/${set.id}`);
      if (detailResponse.data && Array.isArray(detailResponse.data.flashcards)) {
        console.log(' [LEARNING] Set', set.id, 'has', detailResponse.data.flashcards.length, 'flashcards');
        allFlashcards.push(...detailResponse.data.flashcards);
      }
    }
    
    console.log(' [LEARNING] Total flashcards for KB', knowledgeBaseId, ':', allFlashcards.length);
    
    return {
      flashcards: allFlashcards.map((fc: any) => ({
        id: fc.id?.toString(),
        knowledgeBaseId: knowledgeBaseId,
        front: fc.front || fc.question || '',
        back: fc.back || fc.answer || '',
        tags: fc.tags || [],
        difficulty: fc.difficulty || 'medium',
        lastReviewed: fc.lastReviewed,
        nextReview: fc.nextReview,
        createdAt: fc.createdAt || new Date().toISOString(),
        updatedAt: fc.updatedAt || new Date().toISOString(),
      })),
      cardSetId
    };
  },

  // Create flashcard
  createFlashcard: async (knowledgeBaseId: string, cardSetId: string, data: Partial<Flashcard>): Promise<Flashcard> => {
    const userId = getRealUserId();
    console.log('➕ Creating flashcard for card set:', cardSetId);
    
    const response = await apiClient.post(`/card-set/${cardSetId}/flashcards`, {
      userId: userId,
      knowledgeBaseId: parseInt(knowledgeBaseId),
      front: data.front,
      back: data.back,
      difficulty: data.difficulty || 'medium',
      tags: data.tags || [],
    });
    
    const fc = response.data;
    console.log('Flashcard created:', fc);
    
    return {
      id: fc.id?.toString(),
      knowledgeBaseId: knowledgeBaseId,
      front: fc.front,
      back: fc.back,
      tags: fc.tags || data.tags || [],
      difficulty: fc.difficulty || data.difficulty || 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  // Update flashcard
  updateFlashcard: async (id: string, data: Partial<Flashcard>): Promise<Flashcard> => {
    console.log('✒️ Updating flashcard:', id);
    const response = await apiClient.put('/card-set/flashcards/update', {
      id: id,
      front: data.front,
      back: data.back,
      difficulty: data.difficulty,
      tags: data.tags,
    });
    
    const fc = response.data;
    return {
      id: fc.id?.toString(),
      knowledgeBaseId: data.knowledgeBaseId || '',
      front: fc.front,
      back: fc.back,
      tags: fc.tags || data.tags || [],
      difficulty: fc.difficulty || data.difficulty || 'medium',
      createdAt: fc.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  // Delete flashcard
  deleteFlashcard: async (id: string): Promise<void> => {
    console.log('🗑️ Deleting flashcard:', id);
    await apiClient.delete(`/card-set/flashcards/${id}`);
    console.log('Flashcard deleted');
  },

  // Delete card set
  deleteCardSet: async (setId: string): Promise<void> => {
    console.log(' Deleting card set:', setId);
    await apiClient.delete(`/card-set/${setId}`);
    console.log(' Card set deleted');
  },
};

// User Note Service
export const noteService = {
  getNotesByKnowledgeBaseId: async (knowledgeBaseId: string): Promise<Note[]> => {
    console.log('📝 [LEARNING] Fetching notes for KB:', knowledgeBaseId);
    
    try {
      const response = await apiClient.get(`/knowledge/${knowledgeBaseId}`);
      const kb = response.data;
      
      if (!kb.userNote || kb.userNote.trim() === '') {
        console.log('⚠️ [LEARNING] No user note found for KB:', knowledgeBaseId);
        return [];
      }
      
      const note: Note = {
        id: `note-${knowledgeBaseId}`,
        knowledgeBaseId: knowledgeBaseId,
        title: 'My Notes',
        content: kb.userNote,
        tags: [],
        isPinned: false,
        createdAt: kb.createdAt || new Date().toISOString(),
        updatedAt: kb.updatedAt || new Date().toISOString(),
      };
      
      console.log('[LEARNING] Loaded user note for KB:', knowledgeBaseId);
      return [note];
      
    } catch (error) {
      console.error(' [LEARNING] Failed to fetch notes:', error);
      return [];
    }
  },

  // Create note
  createNote: async (knowledgeBaseId: string, data: Partial<Note>): Promise<Note> => {
    const userId = getRealUserId();
    console.log('➕ Creating note for KB:', knowledgeBaseId);
    
    const response = await apiClient.post('/user-note', {
      userId: userId,
      knowledgeBaseId: knowledgeBaseId,
      title: data.title,
      content: data.content,
      tags: data.tags || [],
      isPinned: data.isPinned || false,
    });
    
    const note = response.data;
    console.log('Note created:', note);
    
    return {
      id: note.id?.toString(),
      knowledgeBaseId: knowledgeBaseId,
      title: note.title,
      content: note.content,
      tags: note.tags || [],
      isPinned: note.isPinned || false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  updateNote: async (id: string, data: Partial<Note>): Promise<Note> => {
    console.log(' Updating note:', id);
    const response = await apiClient.put(`/user-note/${id}`, {
      title: data.title,
      content: data.content,
      tags: data.tags,
      isPinned: data.isPinned,
    });
    
    const note = response.data;
    return {
      id: note.id?.toString(),
      knowledgeBaseId: data.knowledgeBaseId || '',
      title: note.title,
      content: note.content,
      tags: note.tags || [],
      isPinned: note.isPinned || false,
      createdAt: note.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  deleteNote: async (id: string): Promise<void> => {
    console.log(' Deleting note:', id);
    await apiClient.delete(`/user-note/${id}`);
    console.log(' Note deleted');
  },
};

export const keynoteService = {
  getKeynotesByKnowledgeBaseId: async (knowledgeBaseId: string): Promise<Keynote[]> => {
    console.log('🎬 [LEARNING] Fetching keynotes for KB:', knowledgeBaseId);
    
    try {
      const response = await apiClient.get(`/knowledge/${knowledgeBaseId}`);
      const kb = response.data;
      
      if (!kb.keyNotes || kb.keyNotes.trim() === '') {
        console.log('[LEARNING] No key notes found for KB:', knowledgeBaseId);
        return [];
      }
      
      try {
        const keyNotesResponse = await apiClient.get(`/knowledge/${knowledgeBaseId}/key-notes`);
        const parsedKeyNotes = keyNotesResponse.data;
        
        if (parsedKeyNotes && parsedKeyNotes.notes && Array.isArray(parsedKeyNotes.notes)) {
          console.log('[LEARNING] Parsed', parsedKeyNotes.notes.length, 'key notes as slides');
          

          const keynote: Keynote = {
            id: `keynote-${knowledgeBaseId}`,
            knowledgeBaseId: knowledgeBaseId,
            title: `Key Notes (${parsedKeyNotes.notes.length} slides)`,
            slides: parsedKeyNotes.notes.map((note: any, index: number) => ({
              id: note.id || `slide-${index}`,
              content: note.content,
              pageNumber: note.pageNumber,
              relevance: note.relevance
            })),
            tags: [],
            createdAt: kb.createdAt || new Date().toISOString(),
            updatedAt: kb.updatedAt || new Date().toISOString(),
          };
          
          return [keynote];
        }
      } catch (parseError) {
        console.warn(' [LEARNING] Failed to parse key notes as JSON, using plain text');
      }
      

      const lines = kb.keyNotes.split('\n').filter((line: string) => line.trim());
      const keynote: Keynote = {
        id: `keynote-${knowledgeBaseId}`,
        knowledgeBaseId: knowledgeBaseId,
        title: `Key Notes (${lines.length} slides)`,
        slides: lines.map((line: string, idx: number) => ({
          id: `slide-${idx}`,
          content: line.trim(),
          pageNumber: null,
          relevance: 1.0
        })),
        tags: [],
        createdAt: kb.createdAt || new Date().toISOString(),
        updatedAt: kb.updatedAt || new Date().toISOString(),
      };
      
      console.log(' [LEARNING] Loaded 1 keynote with', lines.length, 'slides for KB:', knowledgeBaseId);
      return [keynote];
      
    } catch (error) {
      console.error(' [LEARNING] Failed to fetch keynotes:', error);
      return [];
    }
  },

  createKeynote: async (knowledgeBaseId: string, data: Partial<Keynote>): Promise<Keynote> => {
    console.log('➕ Creating keynote for KB:', knowledgeBaseId);
    
    const response = await apiClient.post('/keynotes', {
      knowledgeBaseId: knowledgeBaseId,
      title: data.title,
      slides: data.slides || [],
      tags: data.tags || [],
    });
    
    const kn = response.data;
    console.log(' Keynote created:', kn);
    
    return {
      id: kn.id?.toString(),
      knowledgeBaseId: knowledgeBaseId,
      title: kn.title,
      slides: kn.slides || [],
      tags: kn.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  updateKeynote: async (id: string, data: Partial<Keynote>): Promise<Keynote> => {
    console.log(' Updating keynote:', id);
    const response = await apiClient.put(`/keynotes/${id}`, {
      title: data.title,
      slides: data.slides,
      tags: data.tags,
    });
    
    const kn = response.data;
    return {
      id: kn.id?.toString(),
      knowledgeBaseId: data.knowledgeBaseId || '',
      title: kn.title,
      slides: kn.slides || [],
      tags: kn.tags || [],
      createdAt: kn.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  deleteKeynote: async (id: string): Promise<void> => {
    console.log(' Deleting keynote:', id);
    await apiClient.delete(`/keynotes/${id}`);
    console.log('Keynote deleted');
  },
};
