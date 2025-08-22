'use client';

import { useState, useEffect } from 'react';

interface StreamChunk {
  chunk: number;
  time: string;
  content: string;
}

export default function TestStreamPage() {
  const [chunks, setChunks] = useState<StreamChunk[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const startStream = async () => {
    setChunks([]);
    setIsStreaming(true);
    
    try {
      const response = await fetch('/api/stream');
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) return;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.substring(6));
              setChunks(prev => [...prev, data]);
            } catch (e) {
              console.error('Failed to parse chunk:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Stream error:', error);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">API Stream Test</h1>
      
      <button
        onClick={startStream}
        disabled={isStreaming}
        className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded mb-8"
      >
        {isStreaming ? 'Streaming...' : 'Start Stream Test'}
      </button>

      <div className="space-y-4">
        {chunks.map((chunk, index) => (
          <div key={index} className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
            <h3 className="font-bold">Chunk {chunk.chunk}</h3>
            <p>{chunk.content}</p>
            <p className="text-sm text-gray-600">Received at: {chunk.time}</p>
          </div>
        ))}
        
        {isStreaming && chunks.length === 0 && (
          <div className="p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
            <p>Waiting for first chunk...</p>
          </div>
        )}
      </div>
    </div>
  );
}