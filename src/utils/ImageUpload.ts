

const imgbbAPI = import.meta.env.VITE_IMGBB_API_KEY;

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

export const uploadImageToImgBB = async (file: File): Promise<string> => {
  if (!imgbbAPI) {
    throw new Error("imgBB API key is not set in environment variables");
  }

  // Basic size guard (ImgBB supports up to ~32MB); keep a safer client limit.
  const maxBytes = 15 * 1024 * 1024; // 15MB
  if (file.size > maxBytes) {
    throw new Error("File is too large. Please choose an image under 15MB.");
  }

  // Attempt 1: binary multipart upload with key in form body
  const formData = new FormData();
  formData.append("key", imgbbAPI);
  formData.append("image", file);

  try {
    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      let errorDetails: any = {};
      try {
        errorDetails = await response.json();
      } catch (_) {
        // ignore json parse failure
      }
      const imgbbMessage = errorDetails?.error?.message || "Upload failed";
      // If Bad Request, retry once with base64 payload
      if (response.status === 400) {
        const base64 = await fileToBase64(file);
        const retryData = new FormData();
        retryData.append("key", imgbbAPI);
        retryData.append("image", base64);
        const retryResp = await fetch("https://api.imgbb.com/1/upload", {
          method: "POST",
          body: retryData,
        });
        if (!retryResp.ok) {
          let retryError: any = {};
          try {
            retryError = await retryResp.json();
          } catch (_) {
            // ignore
          }
          const retryMsg = retryError?.error?.message || imgbbMessage;
          throw new Error(`Upload failed (base64): ${retryMsg}`);
        }
        const retryJson = await retryResp.json();
        return retryJson?.data?.url || retryJson?.data?.display_url;
      }
      throw new Error(`Upload failed: ${imgbbMessage}`);
    }

    const data = await response.json();
    return data?.data?.url || data?.data?.display_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

