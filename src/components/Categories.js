import CategoryCard from './CategoryCard'

export default function Categories({memory, setMemory}) {
  return (
    <div>
          {memory.categories.map((category, index) => (
            <CategoryCard key ={index} index={index} categoryName={category} memory={memory} setMemory={setMemory}/>
          ))}
    </div>
  )
}
