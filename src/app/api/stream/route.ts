import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      // Send initial chunk
      controller.enqueue(encoder.encode(`data: {"chunk": 1, "time": "${new Date().toISOString()}", "content": "First chunk"}\n\n`));
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Send second chunk
      controller.enqueue(encoder.encode(`data: {"chunk": 2, "time": "${new Date().toISOString()}", "content": "Second chunk after 2s delay"}\n\n`));
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Send third chunk
      controller.enqueue(encoder.encode(`data: {"chunk": 3, "time": "${new Date().toISOString()}", "content": "Third chunk after 5s total"}\n\n`));
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Send final chunk
      controller.enqueue(encoder.encode(`data: {"chunk": 4, "time": "${new Date().toISOString()}", "content": "Final chunk after 7s total"}\n\n`));
      
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Connection': 'keep-alive',
    },
  });
}