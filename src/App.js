import './App.css';
// import testMemoryJSON from './memory2.json';
// import testMemoryJSON from './emptyMemory.json';
import { useState, useEffect } from 'react';
import Categories from './components/Categories';
import {readFromLocalStorage, writeToLocalStorage} from "./memoryFunctions/memoryFunctions";
import AppStyle from "./CSS/AppContainer.module.css";
import AddCategoryModal from './components/AddCategoryModal';

function App() {
  const [memory, setMemory] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [addingCategory, setAddingCategory] = useState(false);

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


  const handleBurgerClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setAddingCategory(!addingCategory);
  }

    const updatePriorities = () => {
      setMemory(currMemory => {
        const newMemory = {...currMemory}
        const newNotes = [...newMemory.notes]
        const updatedNotes = newNotes.map(note => {
          if (note.isHighPriority) {
            note.priority = "high"
          } else {
            note.priority = ""
          }
          delete note.isHighPriority;

          return note;
        })

        newMemory.notes = updatedNotes;
        return newMemory;
      })
    }
  return (
    <div className={`${AppStyle["app-container"]}`}>
      <button style={{ height: '100px' }} onClick={updatePriorities}>Update priority</button>
      { addingCategory && <AddCategoryModal setAddingCategory={setAddingCategory} memory={memory} setMemory={setMemory} />}
      <div className={`${AppStyle["hamburger-container"]}`}><span onClick={(event) => {handleBurgerClick(event)}} className={`${AppStyle["hamburger-span"]}`}>&#x2630;</span></div>
      {!isLoading && <Categories memory={memory} setMemory={setMemory} />}

    </div>
   
  );
}

export default App;
