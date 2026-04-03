import { Spinner } from '@shared/components/atoms';

export default function NewNoteLoading() {
  return (
    <div className="flex h-32 items-center justify-center">
      <Spinner />
    </div>
  );
}
