import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

const RAILS = "http://localhost:3001/api/v1";

async function proxy(req: NextRequest, params: { path: string[] }) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const path   = params.path.join("/");
  const target = `${RAILS}/${path}${req.nextUrl.search}`;

  const headers = new Headers();
  headers.set("Content-Type", "application/json");
  headers.set("X-User-Email", session.user.email);

  const isBodyMethod = !["GET", "HEAD"].includes(req.method);
  const body         = isBodyMethod ? await req.text() : undefined;

  const res  = await fetch(target, { method: req.method, headers, body });
  const text = await res.text();

  return new NextResponse(text, {
    status:  res.status,
    headers: { "Content-Type": "application/json" },
  });
}

type Ctx = { params: Promise<{ path: string[] }> };

export const GET    = async (req: NextRequest, ctx: Ctx) => proxy(req, await ctx.params);
export const POST   = async (req: NextRequest, ctx: Ctx) => proxy(req, await ctx.params);
export const PATCH  = async (req: NextRequest, ctx: Ctx) => proxy(req, await ctx.params);
export const PUT    = async (req: NextRequest, ctx: Ctx) => proxy(req, await ctx.params);
export const DELETE = async (req: NextRequest, ctx: Ctx) => proxy(req, await ctx.params);
