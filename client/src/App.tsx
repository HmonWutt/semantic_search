import { useEffect, useState } from 'react'
import SearchBar from './components/SearchBar'

export default function App() {
  interface Test {
    name: string
  }

  const [author, setAuthor] = useState<Test>({ name: "Some author" })
  return (
    <main>
      <SearchBar />
    </main>
  )
}
