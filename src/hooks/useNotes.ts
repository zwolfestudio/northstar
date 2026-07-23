import useCollection from "./useCollection";
import { notes as seedNotes } from "../data/notes";
import type { Note } from "../models/note";

function useNotes() {
  return useCollection<Note>("northstar-notes", seedNotes);
}

export default useNotes;
