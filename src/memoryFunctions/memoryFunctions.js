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
    console.log(categories, categoryName)
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


