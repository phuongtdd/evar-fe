// src/pages/Room/hooks/useRoomLogic.ts
import { useEffect, useRef, useState } from "react";
import { message } from "antd";
import { loadZegoScript, initializeZegoRoom } from "../services/zegoService";
import {
  getUsernameFromToken,
  getUserIdFromToken,
  getFullNameFromToken,
} from "../utils/auth";
import {
  joinRoomSession,
  leaveRoomSession,
  getRoomDetail,
  deleteRoom,
  kickRoomSession,
} from "../services/roomService";

import { useRoomSocket } from "../../../hooks/socket/useCloseRoomSocket";
import { useKickRoomSocket } from "../../../hooks/socket/useKickRoomSocket";

import { Room, ZegoUser } from "../types";

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
  const [roomDetails, setRoomDetails] = useState<Room | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const { isRoomDeleted } = useRoomSocket(roomID);
  const currentUserId = getUserIdFromToken();
  const { kickMessage, countDown } = useKickRoomSocket(currentUserId);
  const [otherParticipants, setOtherParticipants] = useState<ZegoUser[]>([]);
  const [currentUser, setCurrentUser] = useState<ZegoUser | null>(null);
  const participants = currentUser
    ? [currentUser, ...otherParticipants]
    : otherParticipants;

  useEffect(() => {
    const generatedRoomID =
      getUrlParams(window.location.href)["roomID"] ||
      Math.floor(Math.random() * 10000) + "";
    setRoomID(generatedRoomID);

    const userID =
      getUserIdFromToken() || "user" + Math.floor(Math.random() * 10000);
    const userName =
      getUsernameFromToken() || "Guest" + Math.floor(Math.random() * 10000);
    const fullName = getFullNameFromToken() || "Undefined full name";

    if (!userID || !userName) {
      setError("Bạn cần đăng nhập để tham gia phòng.");
      setIsLoading(false);
      return;
    }

    // setCurrentUser({ userID, userName });

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
        console.log("members", roomDetail.members);

        if (roomDetail.members && roomDetail.members.length > 0) {
          const mappedMembers = roomDetail.members
            .filter((member: any) => member.user.id !== userID) // loại chính mình
            .map((member: any) => ({
              userID: member.user.id,
              userName: member.user.username+"|"+`${member.user.person.firstName} ${member.user.person.lastName}`
            }));
          setOtherParticipants(mappedMembers);
        }

        setIsOwner(userID === roomDetail?.ownerId);
        await loadZegoScript();
        await initializeZegoRoom({
          container: rootRef.current,
          roomID: generatedRoomID,
          userID,
          userName: `${userName}|${fullName}`,
          fullName,
          maxUsers: roomDetail.capacity,
          onJoinRoom: () => {
            setIsLoading(false);
            clearTimeout(timeout);

            joinRoomSession({
              memberId: userID,
              roomId: generatedRoomID,
            });

            setCurrentUser({
              userID,
              userName: userName+'|'+fullName,
            });
          },

          onLeaveRoom: () => {
            if (userID === roomDetail.ownerId) {
              deleteRoom(generatedRoomID);
            } else {
              leaveRoomSession(userID);
            }
            setOtherParticipants((prev) =>
              prev.filter((p) => p.userID !== userID)
            );
            if (userID !== roomDetail.ownerId) {
              setTimeout(() => {
                window.location.href = "/room";
              }, 500);
            }
          },

          onUserJoin: (newlyJoinedUsers: ZegoUser[]) => {
            console.log("👤 Người khác join:", newlyJoinedUsers);
            setOtherParticipants((prev) => {
              const existingIds = new Set(prev.map((p) => p.userID));
              const newOnes = newlyJoinedUsers.filter(
                (u) => !existingIds.has(u.userID)
              );
              return [...prev, ...newOnes];
            });
          },
          onUserLeave: (leftUsers: ZegoUser[]) => {
            console.log("User leave event", leftUsers);
            const leftUserIds = new Set(leftUsers.map((u) => u.userID));
            setOtherParticipants((currentUser) =>
              currentUser.filter((p) => !leftUserIds.has(p.userID))
            );
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
