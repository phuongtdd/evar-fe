"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import {
  FullscreenExitOutlined,
  FullscreenOutlined,
} from "@ant-design/icons";
import { message, Spin } from "antd";

function getUrlParams(url: string) {
  const urlStr = url.split("?")[1] || "";
  const urlSearchParams = new URLSearchParams(urlStr);
  const result: Record<string, string> = Object.fromEntries(
    urlSearchParams.entries()
  );
  return result;
}

declare global {
  interface Window {
    ZegoUIKitPrebuilt: any;
  }
}

const RoomContent: React.FC = () => {
  const appID = Number(import.meta.env.VITE_APP_ID);
  const serverSecret = import.meta.env.VITE_SERVER_SECRET;


  const rootRef = useRef<HTMLDivElement>(null);
  const [roomID, setRoomID] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [participantCount, setParticipantCount] = useState(1);
  const [error, setError] = useState<string | null>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const generatedRoomID =
      getUrlParams(window.location.href)["roomID"] ||
      Math.floor(Math.random() * 10000) + "";
    setRoomID(generatedRoomID);
    const userID = Math.floor(Math.random() * 10000) + "";
    const userName = "userName" + userID;

    const script = document.createElement("script");
    script.src =
      "https://unpkg.com/@zegocloud/zego-uikit-prebuilt/zego-uikit-prebuilt.js";
    script.async = true;

    const timeout = setTimeout(() => {
      if (isLoading) {
        setError("Failed to load video conference. Please try again.");
        setIsLoading(false);
      }
    }, 5000); 

    script.onload = () => {
      try {
        const kitToken = window.ZegoUIKitPrebuilt.generateKitTokenForTest(
          appID,
          serverSecret,
          generatedRoomID,
          userID,
          userName
        );
        const zp = window.ZegoUIKitPrebuilt.create(kitToken);
        zp.joinRoom({
          container: rootRef.current,
          sharedLinks: [
            {
              name: "Link phòng học",
              url:
                window.location.protocol +
                "//" +
                window.location.host +
                window.location.pathname +
                "?roomID=" +
                generatedRoomID,
            },
          ],
          scenario: {
            mode: window.ZegoUIKitPrebuilt.VideoConference,
          },
          turnOnMicrophoneWhenJoining: false,
          turnOnCameraWhenJoining: false,
          showMyCameraToggleButton: true,
          showMyMicrophoneToggleButton: true,
          showAudioVideoSettingsButton: true,
          showScreenSharingButton: true,
          showTextChat: true,
          showUserList: true,
          maxUsers: 50,
          layout: "Auto",
          showLayoutButton: true,
          onJoinRoom: () => {
            setIsLoading(false);
            clearTimeout(timeout);
          },
          onUserJoin: (users: any[]) => {
            setParticipantCount(users.length + 1);
          },
          onUserLeave: (users: any[]) => {
            setParticipantCount(users.length + 1);
          },
        });
        setTimeout(() => {
          setIsLoading(false);
          clearTimeout(timeout);
        }, 1000);
      } catch (err) {
        setError("Failed to initialize video conference.");
        setIsLoading(false);
        clearTimeout(timeout);
      }
    };

    script.onerror = () => {
      setError("Failed to load ZegoUIKitPrebuilt script.");
      setIsLoading(false);
      clearTimeout(timeout);
    };

    document.body.appendChild(script);

    return () => {
      clearTimeout(timeout);
      document.body.removeChild(script);
    };
  }, []);

  const copyRoomLink = () => {
    const roomLink = `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${roomID}`;
    navigator.clipboard.writeText(roomLink).then(() => {
      message.success("Room link copied to clipboard!");
    });
  };

  const leaveRoom = () => {
    window.location.href = "/";
  };

  const enterFullscreen = () => {
    rootRef.current?.requestFullscreen?.();
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
  };

  useEffect(() => {
    const onChange = () => {
      const active = !!document.fullscreenElement;
      setIsFullscreen(active);
      document.documentElement.classList.toggle("app-fullscreen", active);
    };
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex-1 relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-secondary/80 dark:bg-gray-200 backdrop-blur-sm z-10">
            <div className="text-center">
              <Spin size="large" />
              <p className="mt-4 text-lg font-semibold text-blue-600 dark:text-blue-500">
                Tạo phòng...
              </p>
              <p className="text-black-400">Vui lòng chờ trong giây lát</p>
            </div>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-secondary/80 dark:bg-gray-900/80 backdrop-blur-sm z-10">
            <div className="text-center">
              <p className="text-lg font-semibold text-danger">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
              >
                Thử lại
              </button>
            </div>
          </div>
        )}
          <div className="absolute top-2 right-2 z-20">
          {!isFullscreen ? (
            <button
              onClick={enterFullscreen}
              className="p-2 rounded-bl-md bg-black/60 text-white hover:bg-black/80 transition-colors"
              aria-label="Enter fullscreen"
            >
              <FullscreenOutlined style={{ fontSize: "1.25rem" }} />
            </button>
          ) : (
            <button
              onClick={exitFullscreen}
              className="p-2 rounded-bl-md   bg-black/60 text-white hover:bg-black/80 transition-colors"
              aria-label="Exit fullscreen"
            >
              <FullscreenExitOutlined style={{ fontSize: "1.25rem" }} />
            </button>
          )}
        </div>
        <div
          id="root"
          ref={rootRef}
          className="w-full h-[calc(100vh-112px)] rounded-lg shadow-lg overflow-hidden"
        ></div>
      </div>
    </div>
  );
};

export default RoomContent;
