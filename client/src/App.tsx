import { useEffect, useState } from 'react'

export default function App() {
  interface Test {
    name: string
  }

  const [author, setAuthor] = useState<Test>({ name: "Some author" })
  return (
    <main>
      <header>
        <h1>{author.name}</h1>
      </header>
    </main>
  )
}
