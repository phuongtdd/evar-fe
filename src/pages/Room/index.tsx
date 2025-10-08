import React, { useEffect, useRef } from "react";

const appID = 1393742945;
const serverSecret = "a88144e2bde8983a33bcdb99e5e31c9b";

function getUrlParams(url: string) {
    const urlStr = url.split("?")[1] || "";
    const urlSearchParams = new URLSearchParams(urlStr);
    const result: Record<string, string> = Object.fromEntries(urlSearchParams.entries());
    return result;
}

declare global {
    interface Window {
        ZegoUIKitPrebuilt: any;
    }
}

const Room: React.FC = () => {
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const roomID =
            getUrlParams(window.location.href)["roomID"] ||
            Math.floor(Math.random() * 10000) + "";
        const userID = Math.floor(Math.random() * 10000) + "";
        const userName = "userName" + userID;

        // Load Zego script
        const script = document.createElement("script");
        script.src =
            "https://unpkg.com/@zegocloud/zego-uikit-prebuilt/zego-uikit-prebuilt.js";
        script.async = true;
        script.onload = () => {
            const kitToken = window.ZegoUIKitPrebuilt.generateKitTokenForTest(
                appID,
                serverSecret,
                roomID,
                userID,
                userName
            );
            const zp = window.ZegoUIKitPrebuilt.create(kitToken);
            zp.joinRoom({
                container: rootRef.current,
                sharedLinks: [
                    {
                        name: "Personal link",
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
                maxUsers: 50,
                layout: "Auto",
                showLayoutButton: true,
            });
    };
    document.body.appendChild(script);

    // Cleanup
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div
      id="root"
      ref={rootRef}
      style={{ width: "100vw", height: "100vh" }}
    ></div>
  );
};

export default Room;