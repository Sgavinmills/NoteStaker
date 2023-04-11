import './App.css';
// import testMemoryJSON from './memory2.json';
// import testMemoryJSON from './emptyMemory.json';
import { useState, useEffect } from 'react';
import Categories from './components/Categories';
// import AddNoteCard from './components/AddNoteCard';
// import AddCategoryCard from './components/AddCategoryCard';
// import NewNoteForm from './components/NewNoteForm';
import NewAddNoteForm from './components/NewAddNoteForm';
// import NewCategoryForm from './components/NewCategoryForm';
import {readFromLocalStorage, writeToLocalStorage} from "./memoryFunctions/memoryFunctions";
import AppStyle from "./CSS/AppContainer.module.css";
import AddCategoryModal from './components/AddCategoryModal';

function App() {
  const [memory, setMemory] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showAddNoteForm, setShowAddNoteForm] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);
  // const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);

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

  // const addUniqueIds = () => {
  //   setMemory((currMemory) => {
  //     const newMemory = {...currMemory};
  //     const newNotes = [...newMemory.notes];
  //     newNotes.forEach(note => {
  //       const timeStamp = new Date().getTime();
  //       const randomNumber = Math.random().toString(36).slice(2,9);
  //       const uniqueIdentifier = String(timeStamp) + randomNumber;
  //       console.log(uniqueIdentifier)

  //       if (!note.id) {
  //         note.id = uniqueIdentifier;
  //       }
  //     })
  //     newMemory.notes = newNotes;
  //     return newMemory;
  //   })
  // }

    // const iconStyle = {
    //   fontSize: '50px',
    //   color: '#c6d6f0',
    //   cursor: 'pointer',
    // // margin: '10px',
    // // display: 'block'
    // //  'marginLeft': '90%',
    // //  'marginRight': '60px',
    //  display: 'block'
    // };

    const handleBurgerClick = (event) => {
      event.preventDefault();
      event.stopPropagation();

      setAddingCategory(!addingCategory);
    }

    
  return (
    <div className={`${AppStyle["app-container"]}`}>
      { addingCategory && <AddCategoryModal setAddingCategory={setAddingCategory} memory={memory} setMemory={setMemory} />}
        
      {/* <button style={{ height: `100px`}} onClick={addUniqueIds}>Add unique ids</button> */}
      <div className={`${AppStyle["hamburger-container"]}`}><span onClick={(event) => {handleBurgerClick(event)}} className={`${AppStyle["hamburger-span"]}`}>&#x2630;</span></div>
      {/* <AddNoteCard memory={memory} setMemory={setMemory} showAddNoteForm={showAddNoteForm} setShowAddNoteForm={setShowAddNoteForm}/> */}
      
      {/* <AddCategoryCard showAddCategoryForm={showAddCategoryForm} setShowAddCategoryForm={setShowAddCategoryForm} /> */}
      {/* {showAddCategoryForm && <NewCategoryForm setMemory={setMemory} setShowAddCategoryForm={setShowAddCategoryForm}/> } */}
      {/* {showAddNoteForm && <NewNoteForm memory={memory} setMemory={setMemory} setShowAddNoteForm={setShowAddNoteForm}/> } */}
      {showAddNoteForm && <NewAddNoteForm memory={memory} setMemory={setMemory} setShowAddNoteForm={setShowAddNoteForm}/> }
      {!isLoading && <Categories memory={memory} setMemory={setMemory} />}

    </div>
   
  );
}

export default App;
