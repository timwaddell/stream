import { Suspense } from 'react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// These need to be separate async server components
async function SlowComponent1() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return (
    <div className="p-6 bg-blue-100 dark:bg-blue-900 rounded-lg">
      <h2 className="text-xl font-bold">Component 1 Loaded</h2>
      <p>This loaded after 1 second delay</p>
    </div>
  );
}

async function SlowComponent2() {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return (
    <div className="p-6 bg-green-100 dark:bg-green-900 rounded-lg">
      <h2 className="text-xl font-bold">Component 2 Loaded</h2>
      <p>This loaded after 2 seconds delay</p>
    </div>
  );
}

async function SlowComponent3() {
  await new Promise(resolve => setTimeout(resolve, 3000));
  return (
    <div className="p-6 bg-purple-100 dark:bg-purple-900 rounded-lg">
      <h2 className="text-xl font-bold">Component 3 Loaded</h2>
      <p>This loaded after 3 seconds delay</p>
    </div>
  );
}

async function SlowComponent4() {
  await new Promise(resolve => setTimeout(resolve, 4000));
  return (
    <div className="p-6 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
      <h2 className="text-xl font-bold">Component 4 Loaded</h2>
      <p>This loaded after 4 seconds delay</p>
    </div>
  );
}

function LoadingSkeleton({ text }: { text: string }) {
  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse">
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3"></div>
      <p className="text-sm text-gray-500 mt-2">Loading {text}...</p>
    </div>
  );
}

export default function StreamingPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Next.js App Router Streaming</h1>
      
      <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
        <h2 className="font-semibold mb-2">How This Should Work:</h2>
        <ul className="text-sm space-y-1">
          <li>• Each component loads independently</li>
          <li>• Page shell appears immediately</li>
          <li>• Components stream in as they complete</li>
          <li>• No waiting for slowest component</li>
        </ul>
      </div>

      <p className="mb-8 text-gray-600">
        Page rendered at: {new Date().toISOString()}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Suspense fallback={<LoadingSkeleton text="Component 1" />}>
          <SlowComponent1 />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton text="Component 2" />}>
          <SlowComponent2 />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton text="Component 3" />}>
          <SlowComponent3 />
        </Suspense>

        <Suspense fallback={<LoadingSkeleton text="Component 4" />}>
          <SlowComponent4 />
        </Suspense>
      </div>

      <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 className="font-semibold mb-2">Testing Instructions:</h3>
        <ol className="text-sm space-y-1 list-decimal list-inside">
          <li>Open browser dev tools → Network tab</li>
          <li>Refresh this page</li>
          <li>Look for the document response</li>
          <li>If streaming works: you&apos;ll see chunks arriving over time</li>
          <li>If buffered: entire response arrives at once after 4+ seconds</li>
        </ol>
      </div>
    </div>
  );
}