import { Suspense } from 'react';
import ResultsPageContent from './ResultsPageContent';
import { Layout } from '@/components/layout/Layout';

function LoadingFallback() {
  return (
    <Layout>
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    </Layout>
  );
}

export default function EventResultsPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ResultsPageContent />
    </Suspense>
  );
}
