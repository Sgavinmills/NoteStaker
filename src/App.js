import './App.css';
// import testMemoryJSON from './memory2.json';
// import testMemoryJSON from './emptyMemory.json';
import { useState, useEffect } from 'react';
import Categories from './components/Categories';
import AddNoteCard from './components/AddNoteCard';
import AddCategoryCard from './components/AddCategoryCard';
import NewNoteForm from './components/NewNoteForm';
import NewCategoryForm from './components/NewCategoryForm';
import {readFromLocalStorage, writeToLocalStorage} from "./memoryFunctions/memoryFunctions";
import AppStyle from "./CSS/AppContainer.module.css";


function App() {
  const [memory, setMemory] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showAddNoteForm, setShowAddNoteForm] = useState(false);
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);

  useEffect(() => {
  // const memoryToUse = testMemoryJSON;
  const memoryToUse = readFromLocalStorage();
  setMemory(memoryToUse); 
  setIsLoading(false);
  }, [])

  useEffect(() => {
    if (!isLoading) {
      writeToLocalStorage(memory)
    }
  }, [memory, isLoading])

  return (
    <div className={`${AppStyle["app-container"]}`}>
      <AddNoteCard showAddNoteForm={showAddNoteForm} setShowAddNoteForm={setShowAddNoteForm}/>
      <AddCategoryCard showAddCategoryForm={showAddCategoryForm} setShowAddCategoryForm={setShowAddCategoryForm} />
      {showAddCategoryForm && <NewCategoryForm setMemory={setMemory} setShowAddCategoryForm={setShowAddCategoryForm}/> }
      {showAddNoteForm && <NewNoteForm memory={memory} setMemory={setMemory} setShowAddNoteForm={setShowAddNoteForm}/> }
      {!isLoading && <Categories memory={memory} setMemory={setMemory} />}

    </div>
   
  );
}

export default App;
