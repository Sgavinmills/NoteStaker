import AddNoteCard from './components/AddNoteCard'
import NoteCard from './components/NoteCard'
import AddNotes from './AddNotes'
import BoxList from './BoxList';
// import memory from './memory.json';

export default function ShowNotes({memory}) {
  const notes = getNotesList(memory);

  function getNotesList(jsonStore) {
    // Create an array to store all tags
    const allNotes = [];
  
    // Iterate over each object in the JSON store
    Object.values(jsonStore).forEach((obj) => {
      // Get the tags array for the current object
      const notes = obj;
  
      // If the tags array exists and is not empty, add each tag to the allTags array
      if (notes && notes.length > 0) {
        notes.forEach((note) => {
          allNotes.push(note);
        });
      }
    });
  
    // Use a Set to remove duplicate tags
    const uniqueNotes = [...new Set(allNotes)];
  
    return uniqueNotes;
  }
  
  return (
    <div className="notepad-container">
          <AddNoteCard />
          {notes.map((category, index) => (
            <NoteCard key={index} mainText={category} />
          ))}
          {/* <AddNotes /> */}
    </div>
  )
}
