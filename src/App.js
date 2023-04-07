import './App.css';
import testMemoryJSON from './memory2.json';
// import testMemoryJSON from './emptyMemory.json';
import { useState, useEffect } from 'react';
import Categories from './components/Categories';
import AddNoteCard from './components/AddNoteCard';
import AddCategoryCard from './components/AddCategoryCard';
import NewNoteForm from './components/NewNoteForm';
import NewCategoryForm from './components/NewCategoryForm';
import {getCategoryLabels, readFromLocalStorage, writeToLocalStorage} from "./memoryFunctions/memoryFunctions";


function App() {
  const [memory, setMemory] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showAddNoteForm, setShowAddNoteForm] = useState(false);
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);

  useEffect(() => {
  //   const categories = getCategoryLabels(memoryJSON);
  //   memoryJSON.categories = categories;
  //   setMemory(memoryJSON);
  // const memoryToUse = testMemoryJSON;
  const memoryToUse = readFromLocalStorage();
  setMemory(memoryToUse); 
  // setMemory(readFromLocalStorage());
  console.log(memoryToUse);
  setIsLoading(false);
  }, [])

  useEffect(() => {
    if (!isLoading) {
      console.log("WRITING TO MEMORY. ");
      console.log(memory);
      writeToLocalStorage(memory)

    }
  }, [memory])

  return (
    <div>
      <AddNoteCard showAddNoteForm={showAddNoteForm} setShowAddNoteForm={setShowAddNoteForm}/>
      {showAddNoteForm && <NewNoteForm memory={memory} setMemory={setMemory} setShowAddNoteForm={setShowAddNoteForm}/> }
      {!isLoading && <Categories memory={memory} setMemory={setMemory} />}
      <AddCategoryCard showAddCategoryForm={showAddCategoryForm} setShowAddCategoryForm={setShowAddCategoryForm} />
      {showAddCategoryForm && <NewCategoryForm setMemory={setMemory} setShowAddCategoryForm={setShowAddCategoryForm}/> }

    </div>
   
  );
}

export default App;
