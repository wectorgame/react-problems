import { useState, useEffect, useMemo } from "react"

interface SearchResult {
  id: number
  title: string
  description: string
  category: string
}

const mockSearchAPI = async (query: string): Promise<SearchResult[]> => {
  // Имитация API запроса
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 500))
  
  const results = [
    { id: 1, title: "React Performance", description: "Оптимизация React приложений", category: "Frontend" },
    { id: 2, title: "JavaScript Tips", description: "Полезные советы по JavaScript", category: "Programming" },
    { id: 3, title: "TypeScript Guide", description: "Полное руководство по TypeScript", category: "Programming" },
    { id: 4, title: "CSS Grid Layout", description: "Современная верстка с CSS Grid", category: "Frontend" },
    { id: 5, title: "Node.js Best Practices", description: "Лучшие практики для Node.js", category: "Backend" },
  ]
  
  return results.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.description.toLowerCase().includes(query.toLowerCase())
  )
}

const SearchResultItem = ({ result }: { result: SearchResult }) => {
  console.log(`Рендер результата: ${result.title}`)
  
  return (
    <div style={{
      padding: "12px",
      border: "1px solid #eee",
      borderRadius: "4px",
      marginBottom: "8px",
      backgroundColor: "#f9f9f9"
    }}>
      <h4 style={{ margin: "0 0 4px 0" }}>{result.title}</h4>
      <p style={{ margin: "0 0 4px 0", color: "#666" }}>{result.description}</p>
      <span style={{ 
        fontSize: "12px", 
        color: "#007bff", 
        backgroundColor: "#e3f2fd", 
        padding: "2px 6px", 
        borderRadius: "12px" 
      }}>
        {result.category}
      </span>
    </div>
  )
}

const Problem7 = () => {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [searchCount, setSearchCount] = useState(0)
  const [apiCalls, setApiCalls] = useState(0)
  
  // Проблема: поиск выполняется при каждом изменении query
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    
    setLoading(true)
    setSearchCount(prev => prev + 1)
    setApiCalls(prev => prev + 1)
    
    mockSearchAPI(query).then(data => {
      setResults(data)
      setLoading(false)
    })
  }, [query])
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }
  
  return (
    <div style={{ padding: "20px" }}>
      <h2>Задача 7: Debounce и оптимизация поиска</h2>
      
      <div style={{ marginBottom: "20px" }}>
        <p>
          Поиск выполняется при каждом изменении input, что приводит к множественным API запросам
          и плохому пользовательскому опыту. При быстром вводе генерируется много ненужных запросов.
        </p>
      </div>
      
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Введите поисковый запрос..."
          value={query}
          onChange={handleInputChange}
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "16px"
          }}
        />
      </div>
      
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
          <span>Запросов к API: <strong>{apiCalls}</strong></span>
          <span>Поисковых запросов: <strong>{searchCount}</strong></span>
          <span>Результатов: <strong>{results.length}</strong></span>
        </div>
        {loading && <div style={{ color: "#007bff" }}>Загрузка...</div>}
      </div>
      
      <div style={{ marginBottom: "20px" }}>
        <h4>Результаты поиска:</h4>
        {results.length === 0 && !loading && query && (
          <p style={{ color: "#666" }}>Ничего не найдено</p>
        )}
        {results.map(result => (
          <SearchResultItem key={result.id} result={result} />
        ))}
      </div>
      
      <div style={{ marginBottom: "20px" }}>
        <h4>Проблемы:</h4>
        <ul>
          <li>API запрос выполняется при каждом изменении input</li>
          <li>При быстром вводе генерируется много ненужных запросов</li>
          <li>Результаты могут приходить в неправильном порядке</li>
          <li>Плохой UX из-за постоянной загрузки</li>
        </ul>
      </div>
    </div>
  )
}

export default Problem7
