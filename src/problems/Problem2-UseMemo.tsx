import React, { useState, useMemo } from "react"

// Эта функция выполняется при каждом рендере
const expensiveCalculation = (numbers: number[]): number => {
  console.log("Выполняется дорогое вычисление...")

  // Имитация очень дорогой операции
  let result = 0
  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < 100000; j++) {
      result += numbers[i] * Math.random()
    }
  }
  return Math.floor(result)
}

// Этот компонент перерендеривается при каждом изменении count
const ExpensiveCalculation = ({ numbers }: { numbers: number[] }) => {
  const result = expensiveCalculation(numbers)

  return (
    <div style={{ padding: "10px", border: "1px solid #ccc", margin: "5px" }}>
      <h3>Результат дорогого вычисления</h3>
      <p>Числа: {numbers.join(", ")}</p>
      <p>Результат: {result}</p>
    </div>
  )
}

const Problem2 = () => {
  const [count, setCount] = useState(0)
  const [numbers, setNumbers] = useState([1, 2, 3, 4, 5])
  const [filter, setFilter] = useState("")

  // Этот массив создается заново при каждом рендере
  const filteredNumbers = numbers.filter((num) =>
    num.toString().includes(filter)
  )

  // Этот объект создается заново при каждом рендере
  const config = {
    theme: "dark",
    language: "ru",
    numbers: filteredNumbers,
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Задача 2: useMemo для дорогих вычислений</h2>

      <div style={{ marginBottom: "20px" }}>
        <p>
          Дорогие вычисления выполняются при каждом рендере, даже если входные
          данные не изменились. Откройте консоль и нажмите "Увеличить счетчик" -
          увидите, что дорогое вычисление выполняется снова!
        </p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setCount((c) => c + 1)}>
          Увеличить счетчик: {count}
        </button>
        <button
          onClick={() =>
            setNumbers([...numbers, Math.floor(Math.random() * 100)])
          }
        >
          Добавить случайное число
        </button>
        <input
          type="text"
          placeholder="Фильтр чисел"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          style={{ marginLeft: "10px", padding: "5px" }}
        />
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <div>
          <h4>Дорогое вычисление:</h4>
          <ExpensiveCalculation numbers={filteredNumbers} />
        </div>

        <div>
          <h4>Конфигурация:</h4>
          <pre
            style={{
              backgroundColor: "#f0f0f0",
              padding: "10px",
              borderRadius: "4px",
            }}
          >
            {JSON.stringify(config, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default Problem2
