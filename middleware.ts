import { NextRequest, NextResponse } from 'next/server';
import { updateSession } from "@/utils/supabase/middleware";

export const config = {
  runtime: 'edge',
};

export default async function middleware(request: NextRequest) {
  return await updateSession(request);
}
