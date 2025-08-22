import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  
  // Create padding to force buffering threshold
  const padding = ' '.repeat(1024); // 1KB padding
  
  const stream = new ReadableStream({
    async start(controller) {
      // Send initial chunk with padding to trigger streaming
      controller.enqueue(encoder.encode(`Stream started at ${new Date().toISOString()}\n${padding}\n`));
      
      for (let i = 1; i <= 10; i++) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Send chunk with timestamp and padding
        const chunk = `Chunk ${i}/10 at ${new Date().toISOString()}\n${padding}\n`;
        controller.enqueue(encoder.encode(chunk));
        
        console.log(`Sent chunk ${i}`);
      }
      
      controller.enqueue(encoder.encode(`Stream completed at ${new Date().toISOString()}\n`));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate, proxy-revalidate, max-age=0',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
      'X-Proxy-Cache': 'BYPASS',
      'Transfer-Encoding': 'chunked',
      'Content-Encoding': 'identity',
    },
  });
}