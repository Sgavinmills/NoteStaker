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

  return (
    <div className={`${AppStyle["app-container"]}`}>
      { addingCategory && <AddCategoryModal setAddingCategory={setAddingCategory} memory={memory} setMemory={setMemory} />}
      <div className={`${AppStyle["hamburger-container"]}`}><span onClick={(event) => {handleBurgerClick(event)}} className={`${AppStyle["hamburger-span"]}`}>&#x2630;</span></div>
      {!isLoading && <Categories memory={memory} setMemory={setMemory} />}

    </div>
   
  );
}

export default App;
