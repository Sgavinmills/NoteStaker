import './App.css';
import memoryJSON from './memory.json';
import { useState, useEffect } from 'react';
import Categories from './components/Categories';
import AddNoteCard from './components/AddNoteCard'
import NewNoteForm from './components/NewNoteForm';
import {getCategoryLabels} from "./memoryFunctions/memoryFunctions";


function App() {
  const [memory, setMemory] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showAddNoteForm, setShowAddNoteForm] = useState(false);

  useEffect(() => {
    const categories = getCategoryLabels(memoryJSON);
    memoryJSON.categories = categories;
    setMemory(memoryJSON);
    setIsLoading(false);

  }, [])

  return (
    <div>
      <AddNoteCard showAddNoteForm={showAddNoteForm} setShowAddNoteForm={setShowAddNoteForm}/>
      {showAddNoteForm && <NewNoteForm memory={memory} setMemory={setMemory} setShowAddNoteForm={setShowAddNoteForm}/> }
      {!isLoading && <Categories memory={memory} />}
    </div>
   
  );
}

export default App;
