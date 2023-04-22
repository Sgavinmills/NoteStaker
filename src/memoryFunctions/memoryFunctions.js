export function writeToLocalStorage(memory) {
    localStorage.setItem("memory", JSON.stringify(memory));
}

export function readFromLocalStorage() {
    const savedMemory = JSON.parse(localStorage.getItem("memory"));
    if (!savedMemory) {
        const emptyMemory = {
            notes : [],
            categories: []
        }

        return emptyMemory;
    }
    return savedMemory;
}

  // categories
export function addParentCategoryToMemory(currMemory, categoryName) {
    const newMemory = {...currMemory};
    const newCategories = [...newMemory.categories];
    newCategories.push({ "name" : categoryName, "sub_categories" : []});
    newMemory.categories = newCategories;
    return newMemory;
}

export function addSubCategoryToMemory(currMemory, categoryName, parentIndex) {
    const newMemory = {...currMemory};
    const newCategories = [...newMemory.categories];
    const newNotes = [...newMemory.notes];
    const updatedCategory = {
        ...newCategories[parentIndex],
        sub_categories: [...newCategories[parentIndex].sub_categories, categoryName]
    }
    newCategories[parentIndex] = updatedCategory;

    newMemory.categories = newCategories;

    // checks if any notes are stranded outside of subcategories due to new subcategory.
    // if they are it adds the subcategory to the note. 
    const updatedNotes = newNotes.map(note => {
        const tagIndex = getCatIndex(note.tags, currMemory.categories[parentIndex].name)
        if (tagIndex === -1) {
            return note;
        } else {
            if (note.tags[tagIndex].sub_tags.length === 0) {
                // add subcat name to subtags
                const newTags = [...note.tags];
                const newSubTags = [...newTags[tagIndex].sub_tags];

                newSubTags.push(categoryName);
                newTags[tagIndex].sub_tags = newSubTags;
                const newNote = {...note}
                newNote.tags = newTags;
                return newNote;

            } else {
                return note;
            }
        }
    })
    newMemory.notes = updatedNotes;

    return newMemory;
}

function getCatIndex(categories, categoryName) {
    return categories.reduce((acc, category, index) => {
        const isMatch = category.name === categoryName;
        return isMatch ? index : acc;
    }, -1)
}



export function getParentCategoryIndex(categories, parentCategoryName) {
    return getCatIndex(categories, parentCategoryName);
}


export function addNewBlankNoteToParentCategory(currMemory, categoryName) {
    const newMemory = {...currMemory};
    const timeStamp = new Date().getTime();
    const randomNumber = Math.random().toString(36).slice(2,9);
    const uniqueIdentifier = String(timeStamp) + randomNumber;
    newMemory.notes = [{
        "note" : "",
        "tags" : [{"name" : categoryName, "sub_tags" : []}],
        "additional_info" : "",
        "date_added" : "",
        id : uniqueIdentifier,
        newEmptyNote : true}, 
        ...newMemory.notes]
    return newMemory;
}

export function addNewBlankNoteToSubCategory(currMemory, categoryName, parentCategoryName) {
    const newMemory = {...currMemory};
    const timeStamp = new Date().getTime();
    const randomNumber = Math.random().toString(36).slice(2,9);
    const uniqueIdentifier = String(timeStamp) + randomNumber;
    newMemory.notes = [{
        "note" : "",
        "tags" : [{"name" : parentCategoryName, "sub_tags" : [categoryName]}],
        "additional_info" : "",
        "date_added" : "",
        id : uniqueIdentifier,
        newEmptyNote : true}, 
        ...newMemory.notes]
    return newMemory;
}

function deleteParentCategoryTagFromEachNote(notes, categoryName) {
    const filteredNotes = []
    notes.forEach(note => {
        const tagIndex = getCatIndex(note.tags, categoryName);
        if (tagIndex === -1) {
            filteredNotes.push(note);
        } else {
            if (note.tags.length > 1) {
                const newTags = [...note.tags]
                newTags.splice(tagIndex,1);
                note.tags = newTags;
                filteredNotes.push(note);
            }
        }
    })
    return filteredNotes;
}


export function removeParentCategory(currMemory, categoryName) {
    const newMemory = {...currMemory};
    const newCategories = [...newMemory.categories];
    const newNotes = [...newMemory.notes];
    const catIndex = getCatIndex(newMemory.categories, categoryName);

    // delete category from categories
    newCategories.splice(catIndex, 1);
    newMemory.categories = newCategories;

    // delete the category from tags array of each note, if its the only tag then dismiss note
    const filteredNotes = deleteParentCategoryTagFromEachNote(newNotes, categoryName);

    newMemory.notes = filteredNotes;
    return newMemory;
}



function deleteSubCategoryFromEachNote(newNotes, categoryName, parentCategoryName) {
    const filteredNotes = [];

    newNotes.forEach(note => {
        const parentCatIndex = getCatIndex(note.tags, parentCategoryName);
        if (parentCatIndex === -1) {
            filteredNotes.push(note);
        } else {
            const subCatIndex = note.tags[parentCatIndex].sub_tags.indexOf(categoryName);
            if (subCatIndex === -1) {
                filteredNotes.push(note);
            } else {
               if (note.tags[parentCatIndex].sub_tags.length > 1) {
                    const newNoteSubTags = [...note.tags[parentCatIndex].sub_tags];
                    note.tags[parentCatIndex].sub_tags = newNoteSubTags;
                    filteredNotes.push(note);
                } else {
                    if (note.tags.length > 1) {

                        const newNoteTags = [...note.tags];
                        newNoteTags.splice(parentCatIndex, 1);
                        note.tags = newNoteTags;
                        
                        filteredNotes.push(note);
                    }
                }
            }
        }
    })

    return filteredNotes;

}
export function removeSubCategoryFromMemory(currMemory, categoryName, parentCategoryName) {
    const newMemory = {...currMemory};
    const newCategories = [...newMemory.categories];
    const newNotes = [...newMemory.notes];
    const parentCatIndex = getCatIndex(newMemory.categories, parentCategoryName);

    const subCatIndex = newCategories[parentCatIndex].sub_categories.indexOf(categoryName)

    const newSubCategories = [...newCategories[parentCatIndex].sub_categories];
    newSubCategories.splice(subCatIndex, 1);
    newCategories[parentCatIndex].sub_categories = newSubCategories;
    newMemory.categories = newCategories


    const filteredNotes = deleteSubCategoryFromEachNote(newNotes, categoryName, parentCategoryName)
    newMemory.notes = filteredNotes;
    return newMemory;
}

export function removeAllNotesFromASubCategory(currMemory, categoryName, parentCategoryName) {
    const newMemory = {...currMemory};
    const newNotes = [...newMemory.notes];

    const filteredNotes = deleteSubCategoryFromEachNote(newNotes, categoryName, parentCategoryName);
    newMemory.notes = filteredNotes;
    return newMemory;
}


export function removeAllNotesFromParentCategory(currMemory, categoryName) {
    const newMemory = {...currMemory};
    const newNotes = [...newMemory.notes];
    const filteredNotes = deleteParentCategoryTagFromEachNote(newNotes, categoryName);
    newMemory.notes = filteredNotes;
    return newMemory;
    
}



export function editParentCategoryName(currMemory, oldName, newName) {
    const newMemory = {...currMemory};
    const newCategories = [...newMemory.categories];
    const newNotes = [...newMemory.notes];

    const catIndex = getCatIndex(newCategories, oldName);
    const updatedCategory = {
        ...newCategories[catIndex], 
        name : newName}

    newCategories[catIndex] = updatedCategory;
    newMemory.categories = newCategories;

    const updatedNotes = newNotes.map(note => {
        const tagIndex = getCatIndex(note.tags, oldName);
        if (tagIndex > -1) {
            const updatedTag = {
                ...note.tags[tagIndex],
                name : newName
            }

            note.tags[tagIndex] = updatedTag;
        }
        return note;
    })

    newMemory.notes = updatedNotes;
    return newMemory;

}

export function editSubCategoryName(currMemory, oldName, newName, parentCategoryName) {
    const newMemory = {...currMemory};
    const newNotes = [...newMemory.notes];
    const newCategories = [...newMemory.categories];

    const parentCatIndex = getCatIndex(newCategories, parentCategoryName);
    const subCatIndex = newCategories[parentCatIndex].sub_categories.indexOf(oldName);

    const newSubCategories = [...newCategories[parentCatIndex].sub_categories];
    newSubCategories[subCatIndex] = newName;
    newCategories[parentCatIndex].sub_categories = newSubCategories;
    newMemory.categories = newCategories;

    const updatedNotes = newNotes.map(note => {
        const parentCatIndex = getCatIndex(note.tags, parentCategoryName);
        if (parentCatIndex === -1) {
            return note;
        } else {
            const subCatIndex = note.tags[parentCatIndex].sub_tags.indexOf(oldName);
            if (subCatIndex === -1) {
                return note;
            } else {
                const updatedTags = [...note.tags];
                const updatedSubTags = [...updatedTags[parentCatIndex].sub_tags];
                updatedSubTags[subCatIndex] = newName;

                updatedTags[parentCatIndex].sub_tags = updatedSubTags;
                note.tags = updatedTags;
                return note; 
            }
        }
    })

    newMemory.notes = updatedNotes;
    return newMemory;
} 

export function addOrRemoveParentCategoryToNote(currMemory, noteID, categoryName, noteText) {
    const newMemory = { ...currMemory };
    const updatedNotes = [...newMemory.notes];
    const noteIndex = updatedNotes.reduce((acc, item, index) => {
        const isMatch = noteID === item.id;
        return isMatch ? index : acc;
      }, -1);
    
      const noteCurrentCategories = updatedNotes[noteIndex].tags;
      const noteNewCategories = [...noteCurrentCategories];

      const catIndex = getCatIndex(noteNewCategories, categoryName);
      if (catIndex > -1) {
        if (noteNewCategories.length > 1) {
            noteNewCategories.splice(catIndex,1);
        } else {
            console.log("will not remove from category as it would leave it stranded")
        }
      } else {
        noteNewCategories.push({"name" : categoryName, "sub_tags" : []})
      }

      updatedNotes[noteIndex].tags = noteNewCategories;
      updatedNotes[noteIndex].note = noteText;
      updatedNotes[noteIndex].newEmptyNote = false;


      newMemory.notes = updatedNotes;
      return newMemory;
}


export function getNoteIndex(notes, noteID) {
    // const noteIndex = notes.reduce((acc, item, index) => {
    //     const isMatch = noteID === item.id;
    //     return isMatch ? index : acc;
    //   }, -1);

    //   return noteIndex;
    return getNoteIndexFromNoteList(notes, noteID)
}

function getNoteIndexFromNoteList(notes, noteID) {
    const noteIndex = notes.reduce((acc, item, index) => {
        const isMatch = noteID === item.id;
        return isMatch ? index : acc;
      }, -1);

      return noteIndex;
}
export function addOrRemoveSubCategoryToNote(currMemory, noteID, categoryName, parentCategoryName, noteText) {
    const newMemory = {...currMemory};
    const updatedNotes = [...newMemory.notes];
    const noteIndex = updatedNotes.reduce((acc, item, index) => {
        const isMatch = noteID === item.id;
        return isMatch ? index : acc;
      }, -1);

      const noteCurrentCategories = updatedNotes[noteIndex].tags;
      const noteNewCategories = [...noteCurrentCategories];

      const parentCatIndex = getCatIndex(noteNewCategories, parentCategoryName);
      if(parentCatIndex > -1) {


          const subCatIndex = noteNewCategories[parentCatIndex].sub_tags.indexOf(categoryName)
    
          if (subCatIndex > -1) {
            const newSubTags = [...noteNewCategories[parentCatIndex].sub_tags]
    
            if (newSubTags.length > 1) { // remove subtag
                newSubTags.splice(subCatIndex,1);
                noteNewCategories[parentCatIndex].sub_tags = newSubTags;
            } else { // else remove parent cat
                if (noteNewCategories.length > 1) {
                    noteNewCategories.splice(parentCatIndex,1);
                } else {
                    console.log("will not remove category as its last one")
                }
            }
          } else { 
            noteNewCategories[parentCatIndex].sub_tags = [...noteNewCategories[parentCatIndex].sub_tags, categoryName];
          }
      } else {
          noteNewCategories.push({"name" : parentCategoryName, "sub_tags" : [categoryName]})
      }
      updatedNotes[noteIndex].tags = noteNewCategories;
      updatedNotes[noteIndex].note = noteText;
      updatedNotes[noteIndex].newEmptyNote = false;

      newMemory.notes = updatedNotes;
      return newMemory;
}

export function deleteNoteFromMemory(currMemory, noteID) {
    const newMemory = {...currMemory};
    const updatedNotes = [...newMemory.notes];

    const noteIndex = getNoteIndexFromNoteList(updatedNotes, noteID);
    updatedNotes.splice(noteIndex, 1);
    newMemory.notes = updatedNotes;
    return newMemory;

}

export function submitNoteChange(currMemory, noteID, noteText) {
    const newMemory = { ...currMemory };
    const updatedNotes = [...newMemory.notes];
    const noteIndex = getNoteIndexFromNoteList(updatedNotes, noteID);
    
    updatedNotes[noteIndex].note = noteText;
    updatedNotes[noteIndex].newEmptyNote = false;
    newMemory.notes = updatedNotes;
    return newMemory;
}

export function toggleHighPriority(currMemory, noteID, noteText) {
    const newMemory = { ...currMemory };
    const updatedNotes = [...newMemory.notes];
    const noteIndex = getNoteIndexFromNoteList(updatedNotes, noteID);

    if (updatedNotes[noteIndex].priority === "high") {
        updatedNotes[noteIndex].priority = "low" 
      } else if (updatedNotes[noteIndex].priority === "low") {
        updatedNotes[noteIndex].priority = "" 
      } else {
        updatedNotes[noteIndex].priority = "high" 
      }

      updatedNotes[noteIndex].note = noteText;
      newMemory.notes = updatedNotes;
      return newMemory;
}

export function toggleMarkDone(currMemory, noteID, noteText) {
    const newMemory = { ...currMemory };
    const updatedNotes = [...newMemory.notes];
    const noteIndex = getNoteIndexFromNoteList(updatedNotes, noteID);

    
    updatedNotes[noteIndex].markDone = !updatedNotes[noteIndex].markDone;
    newMemory.notes = updatedNotes;
    updatedNotes[noteIndex].note = noteText;

    return newMemory;
}

export function moveCategoryUp(currMemory, catIndex) {
    const newMemory = {...currMemory};
    const newCategories = [...newMemory.categories];
    const itemToMove = {...newCategories[catIndex]};
    newCategories[catIndex] = {...newCategories[catIndex -1]};
    newCategories[catIndex-1] = itemToMove;
    newMemory.categories = newCategories;
    return newMemory;
}

export function moveCategoryDown(currMemory, catIndex) {
    const newMemory = {...currMemory};
    const newCategories = [...newMemory.categories];
    const itemToMove = {...newCategories[catIndex]};
    newCategories[catIndex] = {...newCategories[catIndex + 1]};
    newCategories[catIndex+1] = itemToMove;
    newMemory.categories = newCategories;
    return newMemory;
}

// update functions to use getSubCatIndex later.
export function getSubCatIndex(categories, categoryName, parentCatIndex) {
    return categories[parentCatIndex].sub_categories.indexOf(categoryName);
}

export function moveSubCategoryUp(currMemory, subCatIndex, parentIndex) {
    // const newMemory = JSON.parse(JSON.stringify(currMemory));
    // const itemToMove = newMemory.categories[parentIndex].sub_categories[subCatIndex];
    // newMemory.categories[parentIndex].sub_categories[subCatIndex] = newMemory.categories[parentIndex].sub_categories[subCatIndex-1]
    // newMemory.categories[parentIndex].sub_categories[subCatIndex-1] = itemToMove;

    const newMemory = {...currMemory};
    const newCategories = [...newMemory.categories]

    const newCat = {...newCategories[parentIndex]}; // brand new cat. has same sub cat?
    const newSubCategories = [...newCat.sub_categories];

    const itemToCopy = newSubCategories[subCatIndex];
    newSubCategories[subCatIndex] = newSubCategories[subCatIndex-1] // any issues check here, but theyre strings!
    newSubCategories[subCatIndex-1] = itemToCopy;

    newCat.sub_categories = newSubCategories;
    newCategories[parentIndex] = newCat;
    newMemory.categories = newCategories;
    return newMemory;
}

export function moveSubCategoryDown(currMemory, catIndex, parentIndex, x) {
        const newMemory = {...currMemory};
        const newCategories = [...newMemory.categories];
        const newCategory = {...newCategories[parentIndex]}
        const newSubCategories = [...newCategory.sub_categories]
        
        const itemToMove = newSubCategories[catIndex];
        newSubCategories[catIndex] = newSubCategories[catIndex+1];
        newSubCategories[catIndex+1] = itemToMove;
    
        newCategory.sub_categories = newSubCategories;
        newCategories[parentIndex] = newCategory;
        newMemory.categories = newCategories;
        return newMemory;
}

export function moveNoteUp(currMemory, noteIndex, noteToSwapIndex) {
    console.log("should be moving " + noteIndex + " above " + noteToSwapIndex)
    const newMemory = {...currMemory};
    const newNotes = [...newMemory.notes];

    const itemToMove = {...newNotes.splice(noteIndex, 1)[0]}
    newNotes.splice(noteToSwapIndex, 0, itemToMove)

    newMemory.notes = newNotes;
    return newMemory;
}

export function moveNoteDown(currMemory, noteIndex, noteToSwapIndex) {
    const newMemory = {...currMemory};
    const newNotes = [...newMemory.notes];

    const itemToMove = {...newNotes.splice(noteIndex, 1)[0]}
    newNotes.splice(noteToSwapIndex, 0, itemToMove);

    newMemory.notes = newNotes;
    return newMemory;
}



