import { Suspense } from 'react';

async function DelayedContent({ delay, children }: { delay: number; children: React.ReactNode }) {
  // Use a proper promise-based delay for server streaming
  await new Promise(resolve => setTimeout(resolve, delay));
  return <>{children}</>;
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
    </div>
  );
}

export function StreamingSection({ delay, children }: { delay: number; children: React.ReactNode }) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DelayedContent delay={delay}>
        {children}
      </DelayedContent>
    </Suspense>
  );
}