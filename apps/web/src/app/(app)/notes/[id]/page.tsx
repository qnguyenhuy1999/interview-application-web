import { NoteDetailClientWrapper } from "./note-detail-client-wrapper";

export const metadata = {
  title: "Note Details",
  description: "View your interview preparation note",
};

export default async function NoteDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <NoteDetailClientWrapper noteId={id} />;
}
