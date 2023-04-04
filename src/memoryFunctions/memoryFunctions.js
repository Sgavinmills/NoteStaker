export function getCategoryLabels(memory) {
    // Create an array to store all tags
    // const allTags = [];
  
    // // Iterate over each object in the JSON store
    // Object.values(memory).forEach((obj) => {
    //   // Get the tags array for the current object
    //   const tags = obj.tags;
  
    //   // If the tags array exists and is not empty, add each tag to the allTags array
    //   if (tags && tags.length > 0) {
    //     tags.forEach((tag) => {
    //       allTags.push(tag);
    //     });
    //   }
    // });
  
    // // Use a Set to remove duplicate tags
    // const uniqueTags = [...new Set(allTags)];
  
    return memory.categories;
}