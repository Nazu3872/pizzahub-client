import { NextRequest, NextResponse } from "next/server";

const SERVER_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://pizzahub-server-nazu2.vercel.app";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const authHeader = req.headers.get("authorization");
    const cookieHeader = req.headers.get("cookie");

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };
    if (authHeader) headers["Authorization"] = authHeader;
    if (cookieHeader) headers["Cookie"] = cookieHeader;

    const targetUrl = `${SERVER_URL.replace(/\/$/, "")}/api/orders`;
    const res = await fetch(targetUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to process order" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    const cookieHeader = req.headers.get("cookie");

    const headers: Record<string, string> = {
      Accept: "application/json",
    };
    if (authHeader) headers["Authorization"] = authHeader;
    if (cookieHeader) headers["Cookie"] = cookieHeader;

    const targetUrl = `${SERVER_URL.replace(/\/$/, "")}/api/orders/customer`;
    const res = await fetch(targetUrl, {
      method: "GET",
      headers,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
