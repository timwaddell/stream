import { Suspense } from 'react';
import { unstable_noStore as noStore } from 'next/cache';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

async function DelayedComponent({ delay, text }: { delay: number; text: string }) {
  noStore(); // Prevent caching
  
  // Simulate async work
  await new Promise(resolve => setTimeout(resolve, delay));
  
  return (
    <div className="p-4 bg-blue-100 dark:bg-blue-900 rounded-lg mb-4">
      <h2 className="text-xl font-bold">{text}</h2>
      <p>Loaded after {delay}ms delay at {new Date().toLocaleTimeString()}</p>
    </div>
  );
}

function LoadingFallback({ text }: { text: string }) {
  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 animate-pulse">
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
      <p className="text-sm text-gray-500 mt-2">Loading {text}...</p>
    </div>
  );
}

export default function StreamPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Streaming Test Page</h1>
      <p className="mb-4">Page started rendering at: {new Date().toLocaleTimeString()}</p>
      
      <div className="space-y-4">
        <Suspense fallback={<LoadingFallback text="Section 1" />}>
          <DelayedComponent delay={1000} text="Section 1" />
        </Suspense>
        
        <Suspense fallback={<LoadingFallback text="Section 2" />}>
          <DelayedComponent delay={3000} text="Section 2" />
        </Suspense>
        
        <Suspense fallback={<LoadingFallback text="Section 3" />}>
          <DelayedComponent delay={5000} text="Section 3" />
        </Suspense>
        
        <Suspense fallback={<LoadingFallback text="Section 4" />}>
          <DelayedComponent delay={7000} text="Section 4" />
        </Suspense>
      </div>
    </div>
  );
}