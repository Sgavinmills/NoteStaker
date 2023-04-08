export function getCategoryLabels(memory) {
    return memory.categories;
}

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