import CategoryCard from './CategoryCard'
import styles from "../CSS/Card.module.css";

export default function Categories({memory, setMemory}) {
console.log(memory.categories)
  return (
    <div>
          {memory.categories.map((category, index) => (
            <CategoryCard key ={index} index={index} categoryName={category} memory={memory} setMemory={setMemory}/>
          ))}
    </div>
  )
}
