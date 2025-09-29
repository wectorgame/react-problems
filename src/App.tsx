import { useState } from 'react'
import { Problem1, Problem2, Problem3, Problem4, Problem5 } from './problems'

function App() {
  const [activeProblem, setActiveProblem] = useState(1)

  const problems = [
    { id: 1, title: 'React.memo', component: Problem1 },
    { id: 2, title: 'useMemo', component: Problem2 },
    { id: 3, title: 'useCallback', component: Problem3 },
    { id: 4, title: 'Lazy Loading', component: Problem4 },
    { id: 5, title: 'Context API', component: Problem5 },
  ]

  const ActiveComponent = problems.find(p => p.id === activeProblem)?.component || Problem1

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <header style={{ 
        backgroundColor: '#343a40', 
        color: 'white', 
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1>🚀 React Оптимизация - Практические Задачи</h1>
        <p>Изучайте оптимизацию React на реальных примерах</p>
      </header>

      <nav style={{ 
        backgroundColor: '#e9ecef', 
        padding: '10px 20px',
        borderBottom: '1px solid #dee2e6'
      }}>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {problems.map(problem => (
            <button
              key={problem.id}
              onClick={() => setActiveProblem(problem.id)}
              style={{
                padding: '10px 20px',
                backgroundColor: activeProblem === problem.id ? '#007bff' : '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {problem.id}. {problem.title}
            </button>
          ))}
        </div>
      </nav>

      <main style={{ padding: '20px' }}>
        <ActiveComponent />
      </main>

      <footer style={{ 
        backgroundColor: '#343a40', 
        color: 'white', 
        padding: '20px',
        textAlign: 'center',
        marginTop: '40px'
      }}>
        <p>💡 Откройте DevTools Console для отслеживания перерендеров</p>
        <p>🔍 Используйте React DevTools Profiler для анализа производительности</p>
      </footer>
    </div>
  )
}

export default App
