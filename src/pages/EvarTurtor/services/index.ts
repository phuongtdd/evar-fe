import { 
  StudyMaterial, 
  Quiz, 
  Flashcard, 
  FlashcardSet, 
  ChatMessage, 
  ChatSession, 
  Note, 
  UserProgress,
  ApiResponse,
  PaginatedResponse,
  SearchParams,
  MaterialFilter
} from '../types';
import {
  MOCK_MATERIALS,
  MOCK_QUIZZES,
  MOCK_FLASHCARDS,
  MOCK_FLASHCARD_SETS,
  MOCK_CHAT_SESSIONS,
  MOCK_NOTES,
  MOCK_USER_PROGRESS,
  generateId,
  PAGINATION
} from '../mock/mockData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Study Materials Service
export class MaterialService {
  private static materials: StudyMaterial[] = [...MOCK_MATERIALS];

  static async getAllMaterials(params?: SearchParams): Promise<PaginatedResponse<StudyMaterial>> {
    await delay(500);
    
    let filteredMaterials = [...this.materials];
    
    if (params) {
      // Apply filters
      if (params.filters.type?.length) {
        filteredMaterials = filteredMaterials.filter(m => 
          params.filters.type!.includes(m.type)
        );
      }
      
      if (params.filters.status?.length) {
        filteredMaterials = filteredMaterials.filter(m => 
          params.filters.status!.includes(m.status)
        );
      }
      
      if (params.filters.tags?.length) {
        filteredMaterials = filteredMaterials.filter(m => 
          m.tags.some(tag => params.filters.tags!.includes(tag))
        );
      }
      
      // Apply search query
      if (params.query) {
        const query = params.query.toLowerCase();
        filteredMaterials = filteredMaterials.filter(m => 
          m.title.toLowerCase().includes(query) ||
          m.description?.toLowerCase().includes(query) ||
          m.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }
      
      // Apply sorting
      filteredMaterials.sort((a, b) => {
        let comparison = 0;
        switch (params.sortBy) {
          case 'title':
            comparison = a.title.localeCompare(b.title);
            break;
          case 'date':
            comparison = new Date(a.uploadDate).getTime() - new Date(b.uploadDate).getTime();
            break;
          case 'size':
            comparison = a.fileSize - b.fileSize;
            break;
          case 'type':
            comparison = a.type.localeCompare(b.type);
            break;
        }
        return params.sortOrder === 'desc' ? -comparison : comparison;
      });
    }
    
    const total = filteredMaterials.length;
    const page = params?.page || 1;
    const limit = params?.limit || PAGINATION.DEFAULT_PAGE_SIZE;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      data: filteredMaterials.slice(startIndex, endIndex),
      total,
      page,
      limit,
      hasNext: endIndex < total,
      hasPrev: page > 1
    };
  }

  static async getMaterialById(id: string): Promise<ApiResponse<StudyMaterial>> {
    await delay(300);
    
    const material = this.materials.find(m => m.id === id);
    if (!material) {
      return {
        success: false,
        data: null as any,
        error: 'Material not found'
      };
    }
    
    return {
      success: true,
      data: material
    };
  }

  static async createMaterial(material: Omit<StudyMaterial, 'id' | 'uploadDate' | 'lastModified'>): Promise<ApiResponse<StudyMaterial>> {
    await delay(800);
    
    const newMaterial: StudyMaterial = {
      ...material,
      id: generateId('mat'),
      uploadDate: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    
    this.materials.unshift(newMaterial);
    
    return {
      success: true,
      data: newMaterial,
      message: 'Material created successfully'
    };
  }

  static async updateMaterial(id: string, updates: Partial<StudyMaterial>): Promise<ApiResponse<StudyMaterial>> {
    await delay(500);
    
    const index = this.materials.findIndex(m => m.id === id);
    if (index === -1) {
      return {
        success: false,
        data: null as any,
        error: 'Material not found'
      };
    }
    
    this.materials[index] = {
      ...this.materials[index],
      ...updates,
      lastModified: new Date().toISOString()
    };
    
    return {
      success: true,
      data: this.materials[index],
      message: 'Material updated successfully'
    };
  }

  static async deleteMaterial(id: string): Promise<ApiResponse<void>> {
    await delay(400);
    
    const index = this.materials.findIndex(m => m.id === id);
    if (index === -1) {
      return {
        success: false,
        data: null as any,
        error: 'Material not found'
      };
    }
    
    this.materials.splice(index, 1);
    
    return {
      success: true,
      data: undefined,
      message: 'Material deleted successfully'
    };
  }
}

// Quiz Service
export class QuizService {
  private static quizzes: Quiz[] = [...MOCK_QUIZZES];

  static async getAllQuizzes(materialId?: string): Promise<ApiResponse<Quiz[]>> {
    await delay(400);
    
    let filteredQuizzes = [...this.quizzes];
    if (materialId) {
      filteredQuizzes = filteredQuizzes.filter(q => q.materialId === materialId);
    }
    
    return {
      success: true,
      data: filteredQuizzes
    };
  }

  static async getQuizById(id: string): Promise<ApiResponse<Quiz>> {
    await delay(300);
    
    const quiz = this.quizzes.find(q => q.id === id);
    if (!quiz) {
      return {
        success: false,
        data: null as any,
        error: 'Quiz not found'
      };
    }
    
    return {
      success: true,
      data: quiz
    };
  }

  static async createQuiz(quiz: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Quiz>> {
    await delay(600);
    
    const newQuiz: Quiz = {
      ...quiz,
      id: generateId('quiz'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.quizzes.push(newQuiz);
    
    return {
      success: true,
      data: newQuiz,
      message: 'Quiz created successfully'
    };
  }

  static async updateQuiz(id: string, updates: Partial<Quiz>): Promise<ApiResponse<Quiz>> {
    await delay(500);
    
    const index = this.quizzes.findIndex(q => q.id === id);
    if (index === -1) {
      return {
        success: false,
        data: null as any,
        error: 'Quiz not found'
      };
    }
    
    this.quizzes[index] = {
      ...this.quizzes[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return {
      success: true,
      data: this.quizzes[index],
      message: 'Quiz updated successfully'
    };
  }

  static async deleteQuiz(id: string): Promise<ApiResponse<void>> {
    await delay(400);
    
    const index = this.quizzes.findIndex(q => q.id === id);
    if (index === -1) {
      return {
        success: false,
        data: null as any,
        error: 'Quiz not found'
      };
    }
    
    this.quizzes.splice(index, 1);
    
    return {
      success: true,
      data: undefined,
      message: 'Quiz deleted successfully'
    };
  }
}

// Flashcard Service
export class FlashcardService {
  private static flashcards: Flashcard[] = [...MOCK_FLASHCARDS];
  private static flashcardSets: FlashcardSet[] = [...MOCK_FLASHCARD_SETS];

  static async getAllFlashcards(materialId?: string): Promise<ApiResponse<Flashcard[]>> {
    await delay(400);
    
    let filteredFlashcards = [...this.flashcards];
    if (materialId) {
      filteredFlashcards = filteredFlashcards.filter(fc => fc.materialId === materialId);
    }
    
    return {
      success: true,
      data: filteredFlashcards
    };
  }

  static async getAllFlashcardSets(materialId?: string): Promise<ApiResponse<FlashcardSet[]>> {
    await delay(400);
    
    let filteredSets = [...this.flashcardSets];
    if (materialId) {
      filteredSets = filteredSets.filter(fs => fs.materialId === materialId);
    }
    
    return {
      success: true,
      data: filteredSets
    };
  }

  static async createFlashcard(flashcard: Omit<Flashcard, 'id' | 'createdAt' | 'reviewCount' | 'successRate'>): Promise<ApiResponse<Flashcard>> {
    await delay(500);
    
    const newFlashcard: Flashcard = {
      ...flashcard,
      id: generateId('fc'),
      createdAt: new Date().toISOString(),
      reviewCount: 0,
      successRate: 0
    };
    
    this.flashcards.push(newFlashcard);
    
    return {
      success: true,
      data: newFlashcard,
      message: 'Flashcard created successfully'
    };
  }

  static async updateFlashcard(id: string, updates: Partial<Flashcard>): Promise<ApiResponse<Flashcard>> {
    await delay(400);
    
    const index = this.flashcards.findIndex(fc => fc.id === id);
    if (index === -1) {
      return {
        success: false,
        data: null as any,
        error: 'Flashcard not found'
      };
    }
    
    this.flashcards[index] = {
      ...this.flashcards[index],
      ...updates
    };
    
    return {
      success: true,
      data: this.flashcards[index],
      message: 'Flashcard updated successfully'
    };
  }

  static async deleteFlashcard(id: string): Promise<ApiResponse<void>> {
    await delay(300);
    
    const index = this.flashcards.findIndex(fc => fc.id === id);
    if (index === -1) {
      return {
        success: false,
        data: null as any,
        error: 'Flashcard not found'
      };
    }
    
    this.flashcards.splice(index, 1);
    
    return {
      success: true,
      data: undefined,
      message: 'Flashcard deleted successfully'
    };
  }
}

// Chat Service
export class ChatService {
  private static chatSessions: ChatSession[] = [...MOCK_CHAT_SESSIONS];

  static async getAllChatSessions(): Promise<ApiResponse<ChatSession[]>> {
    await delay(400);
    
    return {
      success: true,
      data: [...this.chatSessions]
    };
  }

  static async getChatSessionById(id: string): Promise<ApiResponse<ChatSession>> {
    await delay(300);
    
    const session = this.chatSessions.find(s => s.id === id);
    if (!session) {
      return {
        success: false,
        data: null as any,
        error: 'Chat session not found'
      };
    }
    
    return {
      success: true,
      data: session
    };
  }

  static async createChatSession(session: Omit<ChatSession, 'id' | 'createdAt' | 'updatedAt' | 'messages'>): Promise<ApiResponse<ChatSession>> {
    await delay(500);
    
    const newSession: ChatSession = {
      ...session,
      id: generateId('chat'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: []
    };
    
    this.chatSessions.push(newSession);
    
    return {
      success: true,
      data: newSession,
      message: 'Chat session created successfully'
    };
  }

  static async addMessage(sessionId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>): Promise<ApiResponse<ChatMessage>> {
    await delay(300);
    
    const session = this.chatSessions.find(s => s.id === sessionId);
    if (!session) {
      return {
        success: false,
        data: null as any,
        error: 'Chat session not found'
      };
    }
    
    const newMessage: ChatMessage = {
      ...message,
      id: generateId('msg'),
      timestamp: new Date().toISOString()
    };
    
    session.messages.push(newMessage);
    session.updatedAt = new Date().toISOString();
    
    return {
      success: true,
      data: newMessage,
      message: 'Message added successfully'
    };
  }

  static async deleteChatSession(id: string): Promise<ApiResponse<void>> {
    await delay(400);
    
    const index = this.chatSessions.findIndex(s => s.id === id);
    if (index === -1) {
      return {
        success: false,
        data: null as any,
        error: 'Chat session not found'
      };
    }
    
    this.chatSessions.splice(index, 1);
    
    return {
      success: true,
      data: undefined,
      message: 'Chat session deleted successfully'
    };
  }
}

// Note Service
export class NoteService {
  private static notes: Note[] = [...MOCK_NOTES];

  static async getAllNotes(materialId?: string): Promise<ApiResponse<Note[]>> {
    await delay(400);
    
    let filteredNotes = [...this.notes];
    if (materialId) {
      filteredNotes = filteredNotes.filter(n => n.materialId === materialId);
    }
    
    return {
      success: true,
      data: filteredNotes
    };
  }

  static async getNoteById(id: string): Promise<ApiResponse<Note>> {
    await delay(300);
    
    const note = this.notes.find(n => n.id === id);
    if (!note) {
      return {
        success: false,
        data: null as any,
        error: 'Note not found'
      };
    }
    
    return {
      success: true,
      data: note
    };
  }

  static async createNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiResponse<Note>> {
    await delay(500);
    
    const newNote: Note = {
      ...note,
      id: generateId('note'),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.notes.push(newNote);
    
    return {
      success: true,
      data: newNote,
      message: 'Note created successfully'
    };
  }

  static async updateNote(id: string, updates: Partial<Note>): Promise<ApiResponse<Note>> {
    await delay(400);
    
    const index = this.notes.findIndex(n => n.id === id);
    if (index === -1) {
      return {
        success: false,
        data: null as any,
        error: 'Note not found'
      };
    }
    
    this.notes[index] = {
      ...this.notes[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return {
      success: true,
      data: this.notes[index],
      message: 'Note updated successfully'
    };
  }

  static async deleteNote(id: string): Promise<ApiResponse<void>> {
    await delay(300);
    
    const index = this.notes.findIndex(n => n.id === id);
    if (index === -1) {
      return {
        success: false,
        data: null as any,
        error: 'Note not found'
      };
    }
    
    this.notes.splice(index, 1);
    
    return {
      success: true,
      data: undefined,
      message: 'Note deleted successfully'
    };
  }
}

// User Progress Service
export class UserProgressService {
  private static userProgress: UserProgress[] = [...MOCK_USER_PROGRESS];

  static async getUserProgress(materialId?: string): Promise<ApiResponse<UserProgress[]>> {
    await delay(400);
    
    let filteredProgress = [...this.userProgress];
    if (materialId) {
      filteredProgress = filteredProgress.filter(p => p.materialId === materialId);
    }
    
    return {
      success: true,
      data: filteredProgress
    };
  }

  static async updateProgress(materialId: string, updates: Partial<UserProgress>): Promise<ApiResponse<UserProgress>> {
    await delay(500);
    
    const index = this.userProgress.findIndex(p => p.materialId === materialId);
    if (index === -1) {
      return {
        success: false,
        data: null as any,
        error: 'Progress not found'
      };
    }
    
    this.userProgress[index] = {
      ...this.userProgress[index],
      ...updates,
      lastAccessed: new Date().toISOString()
    };
    
    return {
      success: true,
      data: this.userProgress[index],
      message: 'Progress updated successfully'
    };
  }
}
