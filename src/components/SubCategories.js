import SubCategoryCard from './SubCategoryCard'

export default function SubCategories({memory, setMemory, parentCategory, isFocussedCannotClick, setIsFocussedCannotClick}) {
  return (
    <div>
          {memory.categories.filter((category) => category.name === parentCategory.name && parentCategory.sub_categories.length >= 1)[0].sub_categories.map((subCategory, index) => (
            <SubCategoryCard key={index} parentCategory={parentCategory} subCategoryName={subCategory} memory={memory} setMemory={setMemory} isFocussedCannotClick={isFocussedCannotClick} setIsFocussedCannotClick={setIsFocussedCannotClick}/>
          ))}
    </div>
  )
}
