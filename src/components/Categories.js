import { useState } from 'react'
import CategoryCard from './CategoryCard'

export default function Categories({memory, setMemory}) {
  const [isFocussedCannotClick, setIsFocussedCannotClick] = useState(false);
  return (
    <div>
          {memory.categories.map((category, index) => (
            <CategoryCard key={index} category={category} memory={memory} setMemory={setMemory} isFocussedCannotClick={isFocussedCannotClick} setIsFocussedCannotClick={setIsFocussedCannotClick}/>
          ))}
    </div>
  )
}
