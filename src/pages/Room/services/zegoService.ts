// src/pages/Room/services/zegoService.ts
import { APP_ID, SERVER_SECRET } from "../constants";
import "../types"; 

interface JoinRoomOptions {
  container: HTMLDivElement | null;
  roomID: string;
  userID: string;
  userName: string;
  fullName: string;
  onJoinRoom: () => void;
  onUserJoin: (users: any[]) => void;
  onUserLeave: (users: any[]) => void;
  onLeaveRoom?: () => void;
  maxUsers?: number;
}

export const initializeZegoRoom = async ({
  container,
  roomID,
  userID,
  userName,
  onJoinRoom,
  onUserJoin,
  onUserLeave,
  onLeaveRoom,
  maxUsers,
}: JoinRoomOptions) => {
  if (!container || !window.ZegoUIKitPrebuilt) {
    throw new Error("ZegoUIKitPrebuilt script not loaded or container not found.");
  }

  const kitToken = window.ZegoUIKitPrebuilt.generateKitTokenForTest(
    APP_ID,
    SERVER_SECRET,
    roomID,
    userID,
    userName
  );

  const zp = window.ZegoUIKitPrebuilt.create(kitToken);
  zp.joinRoom({
    container: container,
    sharedLinks: [
      {
        name: "Link phòng học",
        url:
          window.location.protocol +
          "//" +
          window.location.host +
          window.location.pathname +
          "?roomID=" +
          roomID,
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
    maxUsers: maxUsers,
    layout: "Auto",
    showLayoutButton: true,
    onJoinRoom: onJoinRoom,
    onUserJoin: onUserJoin,
    onUserLeave: onUserLeave,
    onLeaveRoom: onLeaveRoom,
  });

  return zp;
};

export const loadZegoScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.ZegoUIKitPrebuilt) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/@zegocloud/zego-uikit-prebuilt/zego-uikit-prebuilt.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load ZegoUIKitPrebuilt script."));
    document.body.appendChild(script);
  });
};

