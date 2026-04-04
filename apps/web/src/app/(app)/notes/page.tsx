import { Suspense } from 'react';
import { NoteListContainer } from '@features/notes/components';
import NotesLoading from './loading';

export const metadata = {
  title: 'My Notes',
  description: 'View and manage your interview preparation notes',
};

export default function NotesPage() {
  return (
    <div className="w-full">
      <Suspense fallback={<NotesLoading />}>
        <NoteListContainer />
      </Suspense>
    </div>
  );
}
