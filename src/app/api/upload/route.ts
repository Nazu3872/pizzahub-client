import { NextRequest, NextResponse } from "next/server";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided for upload" },
        { status: 400 }
      );
    }

    // Size validation
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, message: "Image exceeds 5MB limit" },
        { status: 400 }
      );
    }

    // MIME type validation
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid file format. Only JPEG, PNG, WEBP, and GIF allowed.",
        },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Image = buffer.toString("base64");

    const imgbbKey = process.env.IMGBB_API_KEY?.trim();

    if (imgbbKey) {
      // Real upload to ImgBB API
      const imgbbForm = new FormData();
      imgbbForm.append("image", base64Image);

      const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
        {
          method: "POST",
          body: imgbbForm,
        }
      );

      const result = await response.json();

      if (!response.ok || !result.data?.url) {
        return NextResponse.json(
          {
            success: false,
            message: result.error?.message || "Failed to upload image to ImgBB",
          },
          { status: 502 }
        );
      }

      return NextResponse.json({
        success: true,
        url: result.data.url,
      });
    } else {
      // Fallback data URI when IMGBB_API_KEY is not yet populated
      const dataUri = `data:${file.type};base64,${base64Image}`;
      return NextResponse.json({
        success: true,
        url: dataUri,
        isFallback: true,
      });
    }
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Image upload failed" },
      { status: 500 }
    );
  }
}
