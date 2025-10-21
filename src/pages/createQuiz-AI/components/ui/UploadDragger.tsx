import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload, Button } from "antd";

const { Dragger } = Upload;

interface UploadDraggerProps {
  onProcess: () => void;
  onRemove?: () => void;
}

const UploadDragger: React.FC<UploadDraggerProps> = ({ onProcess, onRemove }) => {
  const [fileList, setFileList] = useState<any[]>([]);

  const props = {
    name: "file",
    multiple: false,
    fileList,
    onChange(info: any) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
      setFileList([info.file]);
    },
    onRemove: (file: any) => {
      setFileList([]);
      if (onRemove) {
        onRemove();
      }
    },
  };

  return (
    <>
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col items-end">
     <div className="w-full">
       <Dragger {...props}>
        {fileList.length === 0 && (
          <>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag file to this area to upload
            </p>
            <p className="ant-upload-hint">
              Support for a single upload. Strictly prohibit from uploading
              company data or other band files
            </p>
          </>
        )}
      </Dragger>
     </div>
      <Button
        type="primary"
        onClick={onProcess}
        disabled={fileList.length === 0}
       className="mt-5"
      >
        Process
      </Button>
    </div>
    </>
  );
};

export default UploadDragger;
