import { NextRequest, NextResponse } from "next/server";
import { isAuthorized } from "@/lib/admin/auth";
import { persistAdminImage } from "@/lib/admin/upload-image";

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "无效的表单数据" }, { status: 400 });
  }

  const file = form.get("file");
  const slug = String(form.get("slug") || "post");

  if (!file || !(file instanceof Blob)) {
    return NextResponse.json({ error: "缺少 file 字段" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const contentType = file.type || "image/jpeg";
  const name = file instanceof File ? file.name : undefined;

  const result = await persistAdminImage(buffer, contentType, slug, name);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    url: result.url,
    storage: result.storage,
  });
}
