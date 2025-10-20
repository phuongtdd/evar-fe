import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ExamState, UseExamReturn, ExamResults, Question } from "../types";
import { examService } from "../services/examService";
import { EXAM_CONFIG, EXAM_CONSTANTS } from "../constants";

export const useExam = (examId?: string, initialExamData?: any): UseExamReturn => {
  const navigate = useNavigate();

  const [examState, setExamState] = useState<ExamState>({
    examData: null,
    questions: [],
    currentQuestionIndex: 0,
    timeLeft: EXAM_CONFIG.DEFAULT_TIME_LIMIT,
    isExamStarted: false,
    isExamCompleted: false,
    userAnswers: {},
    markedQuestions: new Set(),
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('=== EXAM STATE CHANGED ===', {
      questions: examState.questions.map(q => ({ id: q.id, isMarked: q.isMarked })),
      markedQuestions: Array.from(examState.markedQuestions),
      currentQuestionIndex: examState.currentQuestionIndex
    });
  }, [examState.questions, examState.markedQuestions, examState.currentQuestionIndex]);

  const loadExam = useCallback(async () => {
    if (!examId) return;

    setIsLoading(true);
    setError(null);

    try {
      let examData;

      if (initialExamData) {
        examData = initialExamData;
      } else {
        const response = await examService.getExamById(examId);
        examData = response.data;
      }

      const questions: Question[] = examData.questions.map((q: Question, index: number) => ({
        id: index + 1,
        content: q.content,
        questionType: q.questionType,
        hardLevel: q.hardLevel,
        subjectName: q.subjectName,
        answers: q.answers.map((answer, answerIndex) => ({
          id: answerIndex + 1,
          content: answer.content,
          isCorrect: answer.isCorrect,
          isSelected: false,
        })),
        questionImg: q.questionImg,
        selectedAnswer: undefined,
        isMarked: false,
        isAnswered: false,
      }));

      setExamState((prev) => ({
        ...prev,
        examData,
        questions,
        timeLeft: EXAM_CONFIG.DEFAULT_TIME_LIMIT,
      }));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Có lỗi xảy ra khi tải bài thi"
      );
    } finally {
      setIsLoading(false);
    }
  }, [examId, initialExamData]);

  const startExam = useCallback(() => {
    setExamState((prev) => ({
      ...prev,
      isExamStarted: true,
    }));
  }, []);

  const selectAnswer = useCallback(
    (questionId: number, answerIndex: number) => {
      setExamState((prev) => {
        const newQuestions = [...prev.questions];
        const questionIndex = newQuestions.findIndex(
          (q) => q.id === questionId
        );

        if (questionIndex !== -1) {
          newQuestions[questionIndex].selectedAnswer = answerIndex;
          newQuestions[questionIndex].isAnswered = true;
        }

        const newUserAnswers = {
          ...prev.userAnswers,
          [questionId]: answerIndex,
        };

        return {
          ...prev,
          questions: newQuestions,
          userAnswers: newUserAnswers,
        };
      });
    },
    []
  );

  const markQuestion = useCallback((questionId: number) => {
    console.log('=== MARK QUESTION CALLED ===', { questionId });
    
    setExamState(prev => {
      console.log('Previous state:', {
        questionId,
        prevIsMarked: prev.questions.find(q => q.id === questionId)?.isMarked,
        prevMarkedQuestions: Array.from(prev.markedQuestions)
      });
      
      const newQuestions = prev.questions.map(q => ({ ...q }));
      const questionIndex = newQuestions.findIndex(q => q.id === questionId);
      
      if (questionIndex !== -1) {
        const wasMarked = newQuestions[questionIndex].isMarked;
        newQuestions[questionIndex] = {
          ...newQuestions[questionIndex],
          isMarked: !wasMarked
        };
        
        console.log('Question updated:', {
          questionId,
          wasMarked,
          isNowMarked: !wasMarked,
          questionIndex
        });
        
        console.log(`Question ${questionId} ${wasMarked ? 'unmarked' : 'marked'}`, {
          questionId,
          wasMarked,
          isNowMarked: !wasMarked,
          timestamp: new Date().toLocaleTimeString()
        });
      }

      const newMarkedQuestions = new Set(prev.markedQuestions);
      const isNowMarked = questionIndex !== -1 ? newQuestions[questionIndex].isMarked : false;
      
      if (isNowMarked) {
        newMarkedQuestions.add(questionId);
        console.log(`Question ${questionId} added to marked questions set`);
      } else {
        newMarkedQuestions.delete(questionId);
        console.log(`Question ${questionId} removed from marked questions set`);
      }
      
      const newState = {
        ...prev,
        questions: newQuestions,
        markedQuestions: newMarkedQuestions
      };
      
      console.log('New state:', {
        questionId,
        newIsMarked: newState.questions.find(q => q.id === questionId)?.isMarked,
        newMarkedQuestions: Array.from(newState.markedQuestions)
      });
      
      return newState;
    });
  }, []);



  const goToQuestion = useCallback((questionIndex: number) => {
    setExamState((prev) => ({
      ...prev,
      currentQuestionIndex: questionIndex,
    }));
  }, []);

  const submitExam = useCallback(async () => {
    if (!examId) {
      throw new Error("Không tìm thấy ID bài thi");
    }

    try {
      const currentState = examState;
      
      await examService.submitExamAnswers(examId, currentState.userAnswers);

      const correctAnswers = currentState.questions.reduce((count, question) => {
        if (question.selectedAnswer !== undefined) {
          const selectedAnswer = question.answers[question.selectedAnswer];
          return count + (selectedAnswer?.isCorrect ? 1 : 0);
        }
        return count;
      }, 0);

      const results: ExamResults = {
        totalQuestions: currentState.questions.length,
        answeredQuestions: Object.keys(currentState.userAnswers).length,
        correctAnswers,
        score: Math.round((correctAnswers / currentState.questions.length) * 100),
        timeSpent: EXAM_CONFIG.DEFAULT_TIME_LIMIT - currentState.timeLeft,
        userAnswers: currentState.userAnswers,
      };

      setExamState((prev) => ({
        ...prev,
        isExamCompleted: true,
      }));

      return results;
    } catch (err) {
      console.error('Submit exam error:', err);
      const errorMessage = err instanceof Error ? err.message : "Có lỗi xảy ra khi nộp bài";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [examId, examState]);

  const resetExam = useCallback(() => {
    setExamState({
      examData: null,
      questions: [],
      currentQuestionIndex: 0,
      timeLeft: EXAM_CONFIG.DEFAULT_TIME_LIMIT,
      isExamStarted: false,
      isExamCompleted: false,
      userAnswers: {},
      markedQuestions: new Set(),
    });
    setError(null);
  }, []);

  useEffect(() => {
    if (!examState.isExamStarted || examState.isExamCompleted) return;

    const timer = setInterval(() => {
      setExamState((prev) => {
        if (prev.timeLeft <= 0) {
          clearInterval(timer);
          return {
            ...prev,
            isExamCompleted: true,
          };
        }
        return {
          ...prev,
          timeLeft: prev.timeLeft - 1,
        };
      });
    }, EXAM_CONSTANTS.TIMER_INTERVAL);

    return () => clearInterval(timer);
  }, [examState.isExamStarted, examState.isExamCompleted]);

  useEffect(() => {
    if (!examState.isExamStarted || examState.isExamCompleted || !examId)
      return;

    const autoSave = setInterval(() => {
      examService.saveExamProgress(
        examId,
        examState.userAnswers,
        examState.currentQuestionIndex
      );
    }, EXAM_CONSTANTS.AUTO_SAVE_INTERVAL);

    return () => clearInterval(autoSave);
  }, [
    examState.isExamStarted,
    examState.isExamCompleted,
    examId,
    examState.userAnswers,
    examState.currentQuestionIndex,
  ]);

  useEffect(() => {
    loadExam();
  }, [loadExam]);

  return {
    examState,
    startExam,
    selectAnswer,
    markQuestion,
    goToQuestion,
    submitExam,
    resetExam,
    isLoading,
    error,
  };
};
