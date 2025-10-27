"use client";

import { useState } from "react";
import { Button, Spin, Empty, Space, Tooltip, Input } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  ExpandOutlined,
  CompressOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";

interface PdfViewerProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  totalPages?: number;
}

export default function PdfViewer({
  currentPage,
  onPageChange,
  totalPages = 10,
}: PdfViewerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(100);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 10, 50));
  };

  const handleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  if (isFullScreen) {
    return (
      <div className="!fixed !inset-0 !z-50 !bg-black !flex !flex-col">
        <div className="!flex !items-center !justify-between !px-6 !py-4 !bg-gray-900 !border-b !border-gray-700">
          <h3 className="!text-white !font-semibold">
            Study Material - Full Screen
          </h3>
          <div className="!text-sm !text-gray-300">
            Page {currentPage} of {totalPages}
          </div>
        </div>

        <div className="!flex-1 !overflow-auto !flex !items-center !justify-center !bg-black !p-8">
          {isLoading ? (
            <Spin />
          ) : (
            <div
              className="!bg-white !rounded-lg !shadow-2xl !flex !items-center !justify-center !border !border-gray-300"
              style={{
                width: `${zoomLevel}%`,
                aspectRatio: "8.5 / 11",
              }}
            >
              <div className="!text-center">
                <Empty
                  description={`Page ${currentPage}`}
                  style={{
                    marginTop: 48,
                  }}
                />
                <p className="!text-gray-500 !mt-4">
                  PDF content will be displayed here
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Full Screen Controls */}
        <div className="!flex !items-center !justify-between !px-6 !py-4 !bg-gray-900 !border-t !border-gray-700">
          <Space>
            <Button
              icon={<LeftOutlined />}
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="!bg-gray-800 !border-gray-700 !text-white hover:!bg-gray-700"
            >
              Previous
            </Button>

            <div className="!flex !items-center !gap-2">
              <Input
                type="number"
                min="1"
                max={totalPages}
                value={currentPage}
                onChange={(e) => {
                  const page = Number.parseInt(e.target.value, 10);
                  if (page >= 1 && page <= totalPages) {
                    onPageChange(page);
                  }
                }}
                className="!w-16 !text-center !bg-gray-800 !border-gray-700 !text-white"
              />
              <span className="!text-gray-300">/ {totalPages}</span>
            </div>

            <Button
              icon={<RightOutlined />}
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="!bg-gray-800 !border-gray-700 !text-white hover:!bg-gray-700"
            >
              Next
            </Button>
          </Space>

          <Space>
            <Tooltip title="Zoom In">
              <Button
                icon={<ZoomInOutlined />}
                onClick={handleZoomIn}
                disabled={zoomLevel >= 200}
                className="!bg-gray-800 !border-gray-700 !text-white hover:!bg-gray-700"
              />
            </Tooltip>

            <span className="!text-gray-300">{zoomLevel}%</span>

            <Tooltip title="Zoom Out">
              <Button
                icon={<ZoomOutOutlined />}
                onClick={handleZoomOut}
                disabled={zoomLevel <= 50}
                className="!bg-gray-800 !border-gray-700 !text-white hover:!bg-gray-700"
              />
            </Tooltip>

            <Tooltip title="Exit Full Screen">
              <Button
                icon={<CompressOutlined />}
                onClick={handleFullScreen}
                className="!bg-gray-800 !border-gray-700 !text-white hover:!bg-gray-700"
              />
            </Tooltip>
          </Space>
        </div>
      </div>
    );
  }

  return (
    <div className="!flex !flex-col !h-full !bg-gray-50">
      {/* PDF Header */}
      <div className="!flex !items-center !justify-between !px-4 !py-3 !border-b !border-gray-200 !bg-white">
        <h3 className="!text-gray-900 !font-semibold">Study Material</h3>
        <div className="!text-sm !text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
      </div>

      {/* PDF Viewer Area */}
      <div className="!flex-1 !overflow-auto !flex !items-center !justify-center !bg-gray-100 !p-4">
        {isLoading ? (
          <Spin />
        ) : (
          <div
            className="!bg-white !rounded-lg !shadow-md !flex !items-center !justify-center !border !border-gray-200 !transition-all"
            style={{
              width: "100%",
              maxWidth: "600px",
              aspectRatio: "8.5 / 11",
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: "center",
            }}
          >
            <div className="!text-center">
              <Empty
                description={`Page ${currentPage}`}
                style={{
                  marginTop: 48,
                }}
              />
              <p className="!text-gray-500 !mt-4">
                PDF content will be displayed here
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      <div className="!flex !items-center !justify-between !px-4 !py-3 !border-t !border-gray-200 !bg-white">
        <Button
          icon={<LeftOutlined />}
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="!text-gray-600"
        >
          Previous
        </Button>

        <Space>
          <div className="!flex !items-center !gap-2">
            <Input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = Number.parseInt(e.target.value, 10);
                if (page >= 1 && page <= totalPages) {
                  onPageChange(page);
                }
              }}
              className="!w-16 !text-center"
            />
            <span className="!text-gray-600">/ {totalPages}</span>
          </div>

          <Tooltip title="Zoom In">
            <Button
              icon={<ZoomInOutlined />}
              onClick={handleZoomIn}
              disabled={zoomLevel >= 200}
              size="small"
              className="!text-gray-600"
            />
          </Tooltip>

          <span className="!text-sm !text-gray-600">{zoomLevel}%</span>

          <Tooltip title="Zoom Out">
            <Button
              icon={<ZoomOutOutlined />}
              onClick={handleZoomOut}
              disabled={zoomLevel <= 50}
              size="small"
              className="!text-gray-600"
            />
          </Tooltip>

          <Tooltip title="Full Screen">
            <Button
              icon={<ExpandOutlined />}
              onClick={handleFullScreen}
              size="small"
              className="!text-gray-600"
            />
          </Tooltip>
        </Space>

        <Button
          icon={<RightOutlined />}
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="!text-gray-600"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
