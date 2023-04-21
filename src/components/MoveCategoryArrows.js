import React, { useState } from 'react';
import MoveArrowStyles from "../CSS/MoveArrow.module.css";
import { getParentCategoryIndex, moveCategoryDown, moveCategoryUp } from '../memoryFunctions/memoryFunctions';

const EditCategoryModal = ({setMemory, category, setMovingCategory, memory}) => {
  const [catName, ] = useState(category.name)


const handleUp = (event) => {
  event.stopPropagation();
  event.preventDefault();

  const catIndex = getParentCategoryIndex(memory.categories, catName);
  if (catIndex === 0) {
    // handle not being able to move up here.
    // dont do until note moving is implemented because that might be a pickler
    return;
  }

  setMemory(currMemory => {
    const newMemory = moveCategoryUp(currMemory, catIndex);
    return newMemory;
    })
}

const handleDown = (event) => {
  event.stopPropagation();
  event.preventDefault();
  const catIndex = getParentCategoryIndex(memory.categories, catName);
  if (catIndex === memory.categories.length -1) {
    console.log("already at bottom")
    // handle not moving here, but wait til notes is done
    return;
  }
  setMemory(currMemory => {
    const newMemory = moveCategoryDown(currMemory, catIndex);
    return newMemory;
    })
}

const handleDone = (event) => {
  event.stopPropagation();
  event.preventDefault();
  setMovingCategory(false);
}


  return (
    <div className={`${MoveArrowStyles["arrow-modal-container"]}`}>
     <div className={`${MoveArrowStyles["arrow-container"]}`}>
      
        <div className={`${MoveArrowStyles["up-arrow"]}`} onClick={(event) => {handleUp(event)}}></div>
        <div className={`${MoveArrowStyles["done"]}`} onClick={(event) => {handleDone(event)}}></div>
        <div className={`${MoveArrowStyles["down-arrow"]}`} onClick={(event) => {handleDown(event)}}></div>

     </div>
    </div>

  );
};

export default EditCategoryModal;
