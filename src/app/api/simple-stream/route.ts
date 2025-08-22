import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const encoder = new TextEncoder();
  
  const stream = new ReadableStream({
    async start(controller) {
      // Send immediate response
      controller.enqueue(encoder.encode('Starting stream...\n'));
      
      // Force flush by sending whitespace
      for (let i = 0; i < 10; i++) {
        controller.enqueue(encoder.encode(' '));
      }
      controller.enqueue(encoder.encode('\n'));
      
      // Wait and send more
      for (let i = 1; i <= 5; i++) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        controller.enqueue(encoder.encode(`Chunk ${i} at ${new Date().toISOString()}\n`));
        
        // Add padding to force flush
        for (let j = 0; j < 10; j++) {
          controller.enqueue(encoder.encode(' '));
        }
        controller.enqueue(encoder.encode('\n'));
      }
      
      controller.enqueue(encoder.encode('Stream complete!\n'));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable nginx buffering
      'Transfer-Encoding': 'chunked',
    },
  });
}