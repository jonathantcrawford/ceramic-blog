import type { LoaderFunction, ActionFunction } from "remix";
import { redirect } from "remix";
import { json, useLoaderData, useCatch, Form } from "remix";
import invariant from "tiny-invariant";
import type { Note } from "~/models/note.server";
import { deleteNote } from "~/models/note.server";
import { getNote } from "~/models/note.server";
import { requireUserId } from "~/session.server";

import { getMDXComponent, mdxComponents } from "~/mdx";
import { useMemo } from "react";

import { compileMDX } from "~/compile-mdx.server";

type LoaderData = {
  note: Note;
  code: string;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  const note = await getNote({ userId, id: params.noteId });
  if (!note) {
    throw new Response("Not Found", { status: 404 });
  }
  const { code } = await compileMDX({mdxSource: note.body});
  return json<LoaderData>({ code, note });
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  invariant(params.noteId, "noteId not found");

  await deleteNote({ userId, id: params.noteId });

  return redirect("/notes");
};

export default function NoteDetailsPage() {
  const {code, note} = useLoaderData() as LoaderData;

  const Component = useMemo(() => code ? getMDXComponent(code) : () => null, [code]);

  return (
    <div>
      <h3 className="text-2xl font-bold">{note.title}</h3>
      <Component components={mdxComponents}/>
      <hr className="my-4" />
      <Form method="post">
        <button
          type="submit"
          className="btn"
        >
          Delete
        </button>
      </Form>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Note not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
