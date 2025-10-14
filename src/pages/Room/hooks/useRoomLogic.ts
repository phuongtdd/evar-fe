// src/pages/Room/hooks/useRoomLogic.ts
import { useEffect, useRef, useState } from "react";
import { message } from "antd";
import { loadZegoScript, initializeZegoRoom } from "../services/zegoService";
import { getUsernameFromToken, getUserIdFromToken } from "../utils/auth";
import {
  joinRoomSession,
  leaveRoomSession,
  getRoomDetail,
  deleteRoom,
  kickRoomSession
} from "../services/roomService";

import { useRoomSocket } from "../../../hooks/socket/useCloseRoomSocket";
import { useKickRoomSocket } from "../../../hooks/socket/useKickRoomSocket";

import { Room } from "../types";

interface ZegoUser {
  userID: string;
  userName: string;
}

function getUrlParams(url: string) {
  const urlStr = url.split("?")[1] || "";
  const urlSearchParams = new URLSearchParams(urlStr);
  const result: Record<string, string> = Object.fromEntries(
    urlSearchParams.entries()
  );
  return result;
}

export const useRoomLogic = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const [roomID, setRoomID] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [participantCount, setParticipantCount] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [participants, setParticipants] = useState<ZegoUser[]>([]);
  const [roomDetails, setRoomDetails] = useState<Room | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const { isRoomDeleted } = useRoomSocket(roomID);
  const currentUserId = getUserIdFromToken();
  const { kickMessage, countDown } = useKickRoomSocket(currentUserId);

  useEffect(() => {
    const generatedRoomID =
      getUrlParams(window.location.href)["roomID"] ||
      Math.floor(Math.random() * 10000) + "";
    setRoomID(generatedRoomID);

    const userID =
      getUserIdFromToken() || "user" + Math.floor(Math.random() * 10000);
    const userName =
      getUsernameFromToken() || "Guest" + Math.floor(Math.random() * 10000);

    if (!userID || !userName) {
      setError("Bạn cần đăng nhập để tham gia phòng.");
      setIsLoading(false);
      return;
    }

    let timeout: number;

    const setupRoom = async () => {
      setIsLoading(true);
      setError(null);
      timeout = setTimeout(() => {
        if (isLoading) {
          setError("Failed to load video conference. Please try again.");
          setIsLoading(false);
        }
      }, 5000);

      try {
        const roomDetail = await getRoomDetail(generatedRoomID);
        setRoomDetails(roomDetail);
        setIsOwner(userID === roomDetail?.ownerId);
        await loadZegoScript();
        await initializeZegoRoom({
          container: rootRef.current,
          roomID: generatedRoomID,
          userID,
          userName,
          maxUsers: roomDetail.capacity,
          onJoinRoom: () => {
            setIsLoading(false);
            clearTimeout(timeout);
            if (userID !== roomDetail.ownerId) {
              joinRoomSession({
                memberId: userID,
                roomId: generatedRoomID,
              });
            }
          },
          onLeaveRoom: () => {
            if (userID === roomDetail.ownerId) {
              deleteRoom(generatedRoomID);
            } else {
              leaveRoomSession(userID);
            }
          },
          onUserJoin: (users: ZegoUser[]) => {
            console.log("User join event", users);
            setParticipants(users);
          },
          onUserLeave: (users: ZegoUser[]) => {
            console.log("User leave event", users);
            setParticipants(users);
          },
        });
        setTimeout(() => {
          setIsLoading(false);
          clearTimeout(timeout);
        }, 1000); // Give a little more time for UI to render
      } catch (err: any) {
        setError(err.message || "Failed to initialize video conference.");
        setIsLoading(false);
        clearTimeout(timeout);
      }
    };

    setupRoom();

    return () => {
      clearTimeout(timeout);
      // Clean up Zego instance if needed, depending on Zego's API
    };
  }, []);

  const handleKickUser = async (userIdToKick: string) => {
    if (!roomDetails) return;
    try {
      await kickRoomSession(userIdToKick);
      // Zego sẽ tự động kích hoạt onUserLeave, state `participants` sẽ được cập nhật
    } catch (error) {
      // Service đã có message.error, nên ở đây chỉ cần log
      console.error("Kick user failed from hook", error);
    }
  };

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

  return {
    rootRef,
    roomID,
    isLoading,
    participantCount,
    error,
    isFullscreen,
    copyRoomLink,
    leaveRoom,
    enterFullscreen,
    exitFullscreen,
    participants,
    isOwner,
    handleKickUser,
    roomDetails,
    isRoomDeleted,
    kickMessage,
  };
};
