import { createContext, useContext, ReactNode, useState, useEffect } from "react"
import { Question, QuizState, QuizInfo } from "../types"


const QuizContext = createContext<QuizState | null>(null)

export const QuizProvider = ({ children }: { children: ReactNode }) => {
  const [fileUploaded, setFileUploaded] = useState(false)
  const [uploadedFile, setUploadedFile] = useState({ name: "", size: "" })
  const [results, setResults] = useState<Question[]>([]) // Explicitly type as Question[]
  const [quizInfo, setQuizInfo] = useState<QuizInfo | null>(null)
  const [isQuizInfoModalVisible, setIsQuizInfoModalVisible] = useState(false)

  // Listen for reset event from sidebar
  useEffect(() => {
    const handleResetQuizInfo = () => {
      setQuizInfo(null);
      setIsQuizInfoModalVisible(false);
      setFileUploaded(false);
      setUploadedFile({ name: "", size: "" });
      setResults([]);
    };

    window.addEventListener("reset-quiz-info", handleResetQuizInfo);

    return () => {
      window.removeEventListener("reset-quiz-info", handleResetQuizInfo);
    };
  }, []);

  return (
    <QuizContext.Provider
      value={{
        fileUploaded,
        setFileUploaded,
        uploadedFile,
        setUploadedFile,
        results,
        setResults,
        quizInfo,
        setQuizInfo,
        isQuizInfoModalVisible,
        setIsQuizInfoModalVisible
      }}
    >
      {children}
    </QuizContext.Provider>
  )
}

export const useQuizContext = () => useContext(QuizContext)!