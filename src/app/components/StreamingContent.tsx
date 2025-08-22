import { Suspense } from 'react';

// Separate async server components for proper streaming
async function DelayedSection1() {
  await new Promise(resolve => setTimeout(resolve, 500));
  return (
    <div className="text-sm text-gray-500 mb-4">
      Page loaded at: {new Date().toISOString()}
    </div>
  );
}

async function DelayedSection2() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return (
    <>
      <h1 className="text-3xl font-bold mb-4">Next.js App Router Streaming</h1>
      <p className="text-lg mb-4">This demonstrates proper streaming with App Router.</p>
      <div className="space-y-2">
        <a href="/streaming" className="block text-blue-600 hover:text-blue-800 underline">
          → Full Streaming Demo
        </a>
        <a href="/sse-test" className="block text-blue-600 hover:text-blue-800 underline">
          → Server-Sent Events Test
        </a>
        <a href="/debug" className="block text-blue-600 hover:text-blue-800 underline">
          → Debug Tools
        </a>
      </div>
    </>
  );
}

async function DelayedSection3() {
  await new Promise(resolve => setTimeout(resolve, 2000));
  return (
    <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
      <li className="mb-2 tracking-[-.01em]">
        Each section streams independently
      </li>
      <li className="tracking-[-.01em]">
        No waiting for the slowest component
      </li>
    </ol>
  );
}

async function DelayedSection4() {
  await new Promise(resolve => setTimeout(resolve, 3000));
  return (
    <div className="p-4 bg-green-100 dark:bg-green-900 rounded-lg">
      <h3 className="font-semibold mb-2">Streaming Success!</h3>
      <p className="text-sm">If you see this loading progressively, streaming is working.</p>
    </div>
  );
}

function LoadingSpinner({ text }: { text?: string }) {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground mr-2"></div>
      {text && <span className="text-sm text-gray-500">Loading {text}...</span>}
    </div>
  );
}

// Export individual streaming sections
export function StreamingSection1() {
  return (
    <Suspense fallback={<LoadingSpinner text="timestamp" />}>
      <DelayedSection1 />
    </Suspense>
  );
}

export function StreamingSection2() {
  return (
    <Suspense fallback={<LoadingSpinner text="main content" />}>
      <DelayedSection2 />
    </Suspense>
  );
}

export function StreamingSection3() {
  return (
    <Suspense fallback={<LoadingSpinner text="instructions" />}>
      <DelayedSection3 />
    </Suspense>
  );
}

export function StreamingSection4() {
  return (
    <Suspense fallback={<LoadingSpinner text="final section" />}>
      <DelayedSection4 />
    </Suspense>
  );
}