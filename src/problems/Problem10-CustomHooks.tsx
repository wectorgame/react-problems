import { useState, useEffect, useCallback, useRef, useMemo } from "react"

interface Todo {
  id: number
  text: string
  completed: boolean
  createdAt: Date
  priority: "low" | "medium" | "high"
}

interface UseTodosReturn {
  todos: Todo[]
  addTodo: (text: string, priority?: "low" | "medium" | "high") => void
  toggleTodo: (id: number) => void
  deleteTodo: (id: number) => void
  clearCompleted: () => void
  filter: "all" | "active" | "completed"
  setFilter: (filter: "all" | "active" | "completed") => void
  filteredTodos: Todo[]
  stats: {
    total: number
    completed: number
    active: number
  }
}

// Проблема: логика todos разбросана по компоненту
const Problem10 = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all")
  const [newTodoText, setNewTodoText] = useState("")
  const [newTodoPriority, setNewTodoPriority] = useState<"low" | "medium" | "high">("medium")
  
  // Проблема: нет мемоизации для фильтрации
  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case "active":
        return !todo.completed
      case "completed":
        return todo.completed
      default:
        return true
    }
  })
  
  // Проблема: статистика пересчитывается при каждом рендере
  const stats = {
    total: todos.length,
    completed: todos.filter(todo => todo.completed).length,
    active: todos.filter(todo => !todo.completed).length
  }
  
  const addTodo = useCallback((text: string, priority: "low" | "medium" | "high" = "medium") => {
    if (!text.trim()) return
    
    const newTodo: Todo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
      priority
    }
    
    setTodos(prev => [...prev, newTodo])
  }, [])
  
  const toggleTodo = useCallback((id: number) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }, [])
  
  const deleteTodo = useCallback((id: number) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }, [])
  
  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(todo => !todo.completed))
  }, [])
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addTodo(newTodoText, newTodoPriority)
    setNewTodoText("")
  }
  
  // Проблема: нет оптимизации для больших списков
  const TodoItem = ({ todo }: { todo: Todo }) => {
    console.log(`Рендер todo: ${todo.text}`)
    
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        padding: "8px",
        border: "1px solid #eee",
        borderRadius: "4px",
        marginBottom: "4px",
        backgroundColor: todo.completed ? "#f5f5f5" : "#fff"
      }}>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id)}
          style={{ marginRight: "8px" }}
        />
        <span style={{
          flex: 1,
          textDecoration: todo.completed ? "line-through" : "none",
          color: todo.completed ? "#666" : "#000"
        }}>
          {todo.text}
        </span>
        <span style={{
          fontSize: "12px",
          padding: "2px 6px",
          borderRadius: "12px",
          backgroundColor: 
            todo.priority === "high" ? "#ffebee" :
            todo.priority === "medium" ? "#fff3e0" : "#e8f5e8",
          color: 
            todo.priority === "high" ? "#c62828" :
            todo.priority === "medium" ? "#ef6c00" : "#2e7d32",
          marginRight: "8px"
        }}>
          {todo.priority}
        </span>
        <button
          onClick={() => deleteTodo(todo.id)}
          style={{
            background: "none",
            border: "none",
            color: "#dc3545",
            cursor: "pointer",
            fontSize: "16px"
          }}
        >
          ×
        </button>
      </div>
    )
  }
  
  return (
    <div style={{ padding: "20px" }}>
      <h2>Задача 10: Кастомные хуки для оптимизации</h2>
      
      <div style={{ marginBottom: "20px" }}>
        <p>
          Логика управления todos разбросана по компоненту, нет переиспользования кода,
          отсутствует мемоизация и оптимизация для больших списков.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Добавить новую задачу..."
            style={{
              flex: 1,
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: "4px"
            }}
          />
          <select
            value={newTodoPriority}
            onChange={(e) => setNewTodoPriority(e.target.value as "low" | "medium" | "high")}
            style={{
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: "4px"
            }}
          >
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </select>
          <button
            type="submit"
            style={{
              padding: "8px 16px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Добавить
          </button>
        </div>
      </form>
      
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <button
            onClick={() => setFilter("all")}
            style={{
              padding: "6px 12px",
              backgroundColor: filter === "all" ? "#007bff" : "#f8f9fa",
              color: filter === "all" ? "white" : "black",
              border: "1px solid #dee2e6",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Все ({stats.total})
          </button>
          <button
            onClick={() => setFilter("active")}
            style={{
              padding: "6px 12px",
              backgroundColor: filter === "active" ? "#007bff" : "#f8f9fa",
              color: filter === "active" ? "white" : "black",
              border: "1px solid #dee2e6",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Активные ({stats.active})
          </button>
          <button
            onClick={() => setFilter("completed")}
            style={{
              padding: "6px 12px",
              backgroundColor: filter === "completed" ? "#007bff" : "#f8f9fa",
              color: filter === "completed" ? "white" : "black",
              border: "1px solid #dee2e6",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Завершенные ({stats.completed})
          </button>
          <button
            onClick={clearCompleted}
            disabled={stats.completed === 0}
            style={{
              padding: "6px 12px",
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: stats.completed === 0 ? "not-allowed" : "pointer",
              opacity: stats.completed === 0 ? 0.5 : 1
            }}
          >
            Очистить завершенные
          </button>
        </div>
      </div>
      
      <div style={{ maxHeight: "400px", overflow: "auto" }}>
        {filteredTodos.length === 0 ? (
          <p style={{ textAlign: "center", color: "#666", padding: "20px" }}>
            {filter === "all" ? "Нет задач" : 
             filter === "active" ? "Нет активных задач" : "Нет завершенных задач"}
          </p>
        ) : (
          filteredTodos.map(todo => (
            <TodoItem key={todo.id} todo={todo} />
          ))
        )}
      </div>
      
      <div style={{ marginTop: "20px" }}>
        <h4>Проблемы:</h4>
        <ul>
          <li>Логика todos не переиспользуется</li>
          <li>Нет мемоизации для фильтрации и статистики</li>
          <li>Компоненты перерендериваются без необходимости</li>
          <li>Нет оптимизации для больших списков</li>
          <li>Отсутствует кастомный хук для управления состоянием</li>
        </ul>
      </div>
    </div>
  )
}

export default Problem10
