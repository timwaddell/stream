'use client';

import { useState } from 'react';

export default function DebugPage() {
  const [output, setOutput] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);

  const testStreaming = async () => {
    setOutput([]);
    setIsStreaming(true);
    
    try {
      const response = await fetch('/api/simple-stream');
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        setOutput(['No reader available']);
        return;
      }

      setOutput(['Stream started...']);
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          setOutput(prev => [...prev, 'Stream finished']);
          break;
        }

        const text = decoder.decode(value, { stream: true });
        setOutput(prev => [...prev, `Received: "${text.trim()}"`]);
      }
    } catch (error) {
      setOutput(prev => [...prev, `Error: ${error}`]);
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Streaming Debug</h1>
      
      <div className="mb-4">
        <p>Platform tests - check if streaming works on:</p>
        <ul className="list-disc list-inside">
          <li>Local development (should work)</li>
          <li>Vercel (might be buffered)</li>
          <li>Railway (might be buffered)</li>
          <li>Netlify (likely buffered)</li>
        </ul>
      </div>

      <button
        onClick={testStreaming}
        disabled={isStreaming}
        className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded mb-8"
      >
        {isStreaming ? 'Testing...' : 'Test Streaming'}
      </button>

      <div className="bg-black text-green-400 p-4 rounded font-mono text-sm h-96 overflow-y-auto">
        {output.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
        {output.length === 0 && <div>Click button to test streaming...</div>}
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p><strong>Expected behavior:</strong> You should see chunks appear one by one with 1-second delays.</p>
        <p><strong>If buffered:</strong> All chunks will appear at once after 5+ seconds.</p>
      </div>
    </div>
  );
}