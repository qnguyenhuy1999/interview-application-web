import Link from 'next/link';
import { Suspense } from 'react';
import { PageContainer, PageHeader } from '@shared/components/templates';
import { Button } from '@shared/components/atoms';
import { NoteList } from '@features/notes/components';
import NotesLoading from './loading';

export const metadata = {
  title: 'My Notes',
  description: 'View and manage your interview preparation notes',
};

export default function NotesPage() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader
          title="My Notes"
          actions={
            <Link href="/notes/new">
              <Button>+ New Note</Button>
            </Link>
          }
        />

        <Suspense fallback={<NotesLoading />}>
          <NoteList />
        </Suspense>

        <div className="py-12 text-center">
          <p className="text-muted-foreground">No notes yet?</p>
          <Link href="/notes/new" className="mt-2 block text-primary hover:underline">
            Create your first note
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
