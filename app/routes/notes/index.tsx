import { Link } from "remix";

export default function NoteIndexPage() {
  return (
    <p>
      No note selected. Select a note on the left, or{" "}
      <Link to="new" className="text-yellow-100 underline">
        create a new note.
      </Link>
    </p>
  );
}
