import { Suspense } from 'react';
import { QuizClient } from '@features/quiz/components';
import { PageContainer } from '@shared/components/templates';
import { Spinner } from '@shared/components/atoms';

export const metadata = {
  title: 'Quiz',
  description: 'Take your interview quiz',
};

function QuizLoading() {
  return (
    <div className="py-8 text-center">
      <Spinner />
    </div>
  );
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="w-full -mt-6 sm:-mt-10">
      <Suspense fallback={<QuizLoading />}>
        <QuizClient quizId={id} />
      </Suspense>
    </div>
  );
}
