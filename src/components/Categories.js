import CategoryCard from './CategoryCard'
import styles from "../CSS/Card.module.css";

export default function NotesHome({memory}) {
console.log(memory.categories)
  return (
    <div>
          {memory.categories.map((category, index) => (
            <CategoryCard index={index} categoryName={category} memory={memory}/>
          ))}
    </div>
  )
}
