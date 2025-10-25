import React, { useEffect } from "react";
import saveQuizChecked from "../../../../assets/images/SuccessCheck.png";
import BackButton from "../../../Common/BackButton";

interface Props {
  showMessage: (type: "success" | "error" | "warning", content: string) => void;
}

const SavedQuizSuccess = ({ showMessage }: Props) => {
  useEffect(() => {
    showMessage("success", "mother fucker");
  }, [showMessage]);

  return (
    <div className="min-h-screen p-4 flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Tạo Quiz với AI OCR
        </h1>
        <BackButton url={"/dashboard"} />
      </div>

      <main className="flex-1 w-full flex flex-col items-center justify-center pb-[120px]">
        <div className="w-[340px] flex flex-col items-center justify-center text-center">
          <img
            src={saveQuizChecked}
            alt=""
            className="w-[120px] h-[120px] object-cover"
          />
          <h3 className="mt-4 text-xl font-semibold text-gray-800">
            Tạo Quiz thành công!
          </h3>
          <BackButton url={"/dashboard"} />
        </div>
      </main>
    </div>
  );
};

export default SavedQuizSuccess;
