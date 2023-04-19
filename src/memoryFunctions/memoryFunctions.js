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

function deepCopy(obj) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
    const copy = Array.isArray(obj) ? [] : {};
    Object.keys(obj).forEach(key => {
      copy[key] = deepCopy(obj[key]);
    });
    return copy;
  }


  // categories
export function addParentCategoryToMemory(currMemory, categoryName) {
    const newMemory = deepCopy(currMemory)
    // const newCategories = deepCopyCategories(newMemory.categories)
    newMemory.categories.push({ "name" : categoryName, "sub_categories" : []});
    return newMemory;
}

export function addSubCategoryToMemory(currMemory, categoryName, parentIndex) {
    const newMemory = deepCopy(currMemory)
    newMemory.categories[parentIndex].sub_categories.push(categoryName);
    return newMemory;
}

export function getParentCategoryIndex(categories, parentCategoryName) {
    return categories.reduce((acc, category, index) => {
        const isMatch = category.name === parentCategoryName;
        return isMatch ? index : acc;
    }, -1)
}

export function addNewBlankNoteToParentCategory(currMemory, categoryName) {
    const newMemory = deepCopy(currMemory);
    const timeStamp = new Date().getTime();
    const randomNumber = Math.random().toString(36).slice(2,9);
    const uniqueIdentifier = String(timeStamp) + randomNumber;

    newMemory.notes.unshift({
        "note" : "",
        "tags" : [{"name" : categoryName, "sub_tags" : []}],
        "additional_info" : "",
        "date_added" : "",
        id : uniqueIdentifier,
        newEmptyNote : true
    })
    console.log(newMemory)
    return newMemory;
}




