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

// function deepCopy(obj) {
//     if (typeof obj !== 'object' || obj === null) {
//       return obj;
//     }
//     const copy = Array.isArray(obj) ? [] : {};
//     Object.keys(obj).forEach(key => {
//       copy[key] = deepCopy(obj[key]);
//     });
//     return copy;
//   }


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
    const updatedCategory = {
        ...newCategories[parentIndex],
        sub_categories: [...newCategories[parentIndex].sub_categories, categoryName]
    }
    newCategories[parentIndex] = updatedCategory;
    newMemory.categories = newCategories;
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




