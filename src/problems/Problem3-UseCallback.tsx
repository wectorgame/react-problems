import { useState, useCallback, memo } from "react"

// Этот компонент перерендеривается при каждом изменении родителя
// потому что функция onClick создается заново при каждом рендере
const ExpensiveButton = memo(
  ({
    onClick,
    label,
    count,
  }: {
    onClick: () => void
    label: string
    count: number
  }) => {
    console.log(`${label} перерендерился!`)

    return (
      <button
        onClick={onClick}
        style={{
          padding: "10px 20px",
          margin: "5px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
        }}
      >
        {label} (кликов: {count})
      </button>
    )
  }
)

// Этот компонент тоже перерендеривается из-за новой функции
const SearchInput = memo(
  ({
    onSearch,
    placeholder,
  }: {
    onSearch: (value: string) => void
    placeholder: string
  }) => {
    console.log("SearchInput перерендерился!")

    return (
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onSearch(e.target.value)}
        style={{ padding: "8px", margin: "5px", width: "200px" }}
      />
    )
  }
)

const Problem3 = () => {
  const [count1, setCount1] = useState(0)
  const [count2, setCount2] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [otherState, setOtherState] = useState(0)

  // Эти функции создаются заново при каждом рендере
  const handleButton1Click = useCallback(() => {
    setCount1((c) => c + 1)
  }, [])

  const handleButton2Click = useCallback(() => {
    setCount2((c) => c + 1)
  }, [])

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value)
  }, [])

  // Эта функция создается заново при каждом рендере
  const handleComplexOperation = useCallback((id: number) => {
    console.log(`Выполняется сложная операция для ID: ${id}`)
    // Имитация сложной операции
    return id * 2
  }, [])

  return (
    <div style={{ padding: "20px" }}>
      <h2>Задача 3: useCallback для функций</h2>

      <div style={{ marginBottom: "20px" }}>
        <p>
          Функции создаются заново при каждом рендере, что приводит к ненужным
          перерендерам дочерних компонентов. Откройте консоль и нажмите любую
          кнопку - увидите лишние перерендеры!
        </p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setOtherState((s) => s + 1)}>
          Изменить другое состояние: {otherState}
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h4>Кнопки:</h4>
        <ExpensiveButton
          onClick={handleButton1Click}
          label="Кнопка 1"
          count={count1}
        />
        <ExpensiveButton
          onClick={handleButton2Click}
          label="Кнопка 2"
          count={count2}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h4>Поиск:</h4>
        <SearchInput
          onSearch={handleSearch}
          placeholder="Введите поисковый запрос"
        />
        <p>Результат поиска: {searchTerm}</p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h4>Сложная операция:</h4>
        <button onClick={() => handleComplexOperation(42)}>
          Выполнить сложную операцию
        </button>
      </div>
    </div>
  )
}

export default Problem3
