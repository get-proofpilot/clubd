import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  const filePath = join(process.cwd(), 'docs', 'clubd-pitch-deck.html');
  const html = await readFile(filePath, 'utf-8');

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
