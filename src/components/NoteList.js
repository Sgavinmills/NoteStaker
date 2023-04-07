import NoteCard from './NoteCard'
import { useState, useEffect } from 'react';

export default function NoteList({memory, categoryName, setMemory}) {

  const [notesToList, setNotesToList] = useState([]);
  useEffect(() => {
    setNotesToList(() => {
      const notes = memory.notes.filter(note => {
        if (note.tags?.includes(categoryName)) {
          return note;
        }
        return false;
      })
      return notes;
    })
  }, [memory, categoryName])


  
  return (
    <div>
          {notesToList?.map((note, index) => (
            <NoteCard key={index} note={note} index={index} setMemory={setMemory} memory={memory}/>
          ))}
    </div>
  )
}
