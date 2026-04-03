import { NoteForm } from '@features/notes/components';
import { PageContainer, PageHeader } from '@shared/components/templates';
import { Button } from '@shared/components/atoms';

export const metadata = {
  title: 'Create Note',
  description: 'Create a new interview preparation note',
};

export default function NewNotePage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader title="Create Note" />

        <NoteForm />
      </div>
    </PageContainer>
  );
}