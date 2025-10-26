import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ExamState, UseExamReturn, ExamResults, Question } from "../types";
import { examService } from "../services/examService";
import { EXAM_CONFIG, EXAM_CONSTANTS } from "../constants";
import { getUserIdFromToken } from "../../Room/utils/auth";

export const useExam = (examId?: string, initialExamData?: any): UseExamReturn => {
  const navigate = useNavigate();

  const [examState, setExamState] = useState<ExamState>({
    examData: null,
    questions: [],
    currentQuestionIndex: 0,
    timeLeft: EXAM_CONFIG.DEFAULT_TIME_LIMIT,
    isExamStarted: false,
    isExamCompleted: false,
    userAnswers: {} as { [questionId: string]: number },
    markedQuestions: new Set(),
    copyPasteAttempts: 0,
    numTabSwitches: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    console.log('=== EXAM STATE CHANGED ===', {
      questions: examState.questions.map(q => ({ id: q.id, isMarked: q.isMarked })),
      markedQuestions: Array.from(examState.markedQuestions),
      currentQuestionIndex: examState.currentQuestionIndex,
      copyPasteAttempts: examState.copyPasteAttempts,
      numTabSwitches: examState.numTabSwitches,
    });
  }, [examState.questions, examState.markedQuestions, examState.currentQuestionIndex, examState.copyPasteAttempts, examState.numTabSwitches]);

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

      const questions: Question[] = examData.questions.map((q: any, index: number) => ({
        id: index + 1,
        questionId: q.id,
        content: q.content,
        questionType: q.questionType,
        hardLevel: q.hardLevel,
        subjectName: q.subjectName,
        answers: q.answers.map((answer: any, answerIndex: number) => ({
          id: answerIndex + 1,
          answerId: answer.id,
          content: answer.content,
          isCorrect: answer.isCorrect,
          isSelected: false,
        })),
        questionImg: q.questionImg,
        selectedAnswer: undefined,
        selectedAnswers: [],
        isMarked: false,
        isAnswered: false,
      }));

      setExamState((prev) => ({
        ...prev,
        examData,
        questions,
        timeLeft: examData.duration ? examData.duration * 60 : EXAM_CONFIG.DEFAULT_TIME_LIMIT, // Convert minutes to seconds
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
    (questionId: number, answerIndex: number, isMultiple: boolean = false) => {
      setExamState((prev) => {
        const newQuestions = [...prev.questions];
        const questionIndex = newQuestions.findIndex(
          (q) => q.id === questionId
        );

        if (questionIndex !== -1) {
          if (isMultiple) {
            // Handle multiple choice
            const currentAnswers = newQuestions[questionIndex].selectedAnswers || [];
            const isAlreadySelected = currentAnswers.includes(answerIndex);

            const newSelectedAnswers = isAlreadySelected
              ? currentAnswers.filter((idx) => idx !== answerIndex)
              : [...currentAnswers, answerIndex];

            newQuestions[questionIndex] = {
              ...newQuestions[questionIndex],
              selectedAnswers: newSelectedAnswers,
              isAnswered: newSelectedAnswers.length > 0,
            };
          } else {
            // Handle single choice
            newQuestions[questionIndex] = {
              ...newQuestions[questionIndex],
              selectedAnswer: answerIndex,
              isAnswered: true,
            };
          }
        }

        const newUserAnswers = {
          ...prev.userAnswers,
          [newQuestions[questionIndex].questionId]: isMultiple
            ? newQuestions[questionIndex].selectedAnswers!
            : answerIndex,
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

  const incrementCopyPasteAttempts = useCallback(() => {
    setExamState((prev) => ({
      ...prev,
      copyPasteAttempts: prev.copyPasteAttempts + 1,
    }));
  }, []);

  const incrementTabSwitches = useCallback(() => {
    setExamState((prev) => ({
      ...prev,
      numTabSwitches: prev.numTabSwitches + 1,
    }));
  }, []);

  const submitExam = useCallback(async () => {
    if (!examId) {
      throw new Error("Không tìm thấy ID bài thi");
    }

    try {
      const currentState = examState;

      console.log("------------ currentState", currentState)

      // Submit to backend API
      const submissionResponse = await examService.submitExamAnswers(
        examId, 
        currentState.userAnswers, 
        currentState.examData,
        currentState.copyPasteAttempts,
        currentState.numTabSwitches
      );

      console.log('Submission response:', submissionResponse);

      // Calculate correct answers locally by comparing user answers with exam answers
      let correctCount = 0;
      for (const question of currentState.questions) {
        const userAnswer = currentState.userAnswers[question.questionId];
        if (userAnswer !== undefined) {
          const selectedIndices = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
          const correctIndices = question.answers
            .map((answer, index) => answer.isCorrect ? index : -1)
            .filter(index => index !== -1);

          // For multiple choice: selected answers must exactly match correct answers
          // For single choice: selected answer must be in correct answers
          const isCorrect = question.questionType === 'MULTIPLE_CHOICE'
            ? selectedIndices.sort().join(',') === correctIndices.sort().join(',')
            : selectedIndices.length === 1 && correctIndices.includes(selectedIndices[0]);

          if (isCorrect) correctCount++;
        }
      }

      // Use backend response for results but calculate correct answers locally
      const results: ExamResults = {
        totalQuestions: currentState.questions.length,
        answeredQuestions: Object.keys(currentState.userAnswers).length,
        correctAnswers: correctCount,
        score: Math.round((correctCount / currentState.questions.length) * 100), // Calculate percentage based on correct answers
        timeSpent: (currentState.examData?.duration ? currentState.examData.duration * 60 : EXAM_CONFIG.DEFAULT_TIME_LIMIT) - currentState.timeLeft,
        userAnswers: currentState.userAnswers,
        submissionId: submissionResponse.data.id, // Add submission ID to results
        copyPasteAttempts: currentState.copyPasteAttempts,
        numTabSwitches: currentState.numTabSwitches,
      };

      console.log('Created results object:', results);

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
      userAnswers: {} as { [questionId: string]: number | number[] },
      markedQuestions: new Set(),
      copyPasteAttempts: 0,
      numTabSwitches: 0,
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
    incrementCopyPasteAttempts,
    incrementTabSwitches,
    isLoading,
    error,
  };
};
