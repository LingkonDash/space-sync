interface ImgBBResponse {
  data: {
    url: string;
  };
}

export default async function uploadToImgBB(file: File): Promise<string> {
  const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

  if (!IMGBB_API_KEY) {
    throw new Error("IMGBB API key is missing.");
  }

  const formData = new FormData();
  formData.append("image", file);

  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error("Image upload failed.");
  }

  const data: ImgBBResponse = await res.json();

  return data.data.url;
}