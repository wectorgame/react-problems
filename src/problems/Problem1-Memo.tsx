import React, { useState, memo } from "react"

// Этот компонент перерендеривается при каждом изменении родительского компонента
// даже если его props не изменились
const ExpensiveChild = ({ name, age }: { name: string; age: number }) => {
  console.log("ExpensiveChild перерендерился!")

  // Имитация дорогой операции
  const expensiveValue = Array.from({ length: 1000000 }, (_, i) => i).reduce(
    (a, b) => a + b,
    0
  )

  return (
    <div style={{ padding: "10px", border: "1px solid #ccc", margin: "5px" }}>
      <h3>Дорогой компонент</h3>
      <p>Имя: {name}</p>
      <p>Возраст: {age}</p>
      <p>Результат дорогого вычисления: {expensiveValue}</p>
    </div>
  )
}

// Этот компонент тоже перерендеривается без необходимости
const SimpleChild = ({ text }: { text: string }) => {
  console.log("SimpleChild перерендерился!")
  return <p>Простой текст: {text}</p>
}

const Problem1 = () => {
  const [count, setCount] = useState(0)
  const [name, setName] = useState("Иван")
  const [age, setAge] = useState(25)

  return (
    <div style={{ padding: "20px" }}>
      <h2>Задача 1: React.memo и мемоизация компонентов</h2>

      <div style={{ marginBottom: "20px" }}>
        <p>
          Компоненты ExpensiveChild и SimpleChild перерендериваются при каждом
          изменении count, даже если их props не изменились. Откройте консоль и
          нажмите кнопку "Увеличить счетчик" - увидите лишние перерендеры!
        </p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => setCount((c) => c + 1)}>
          Увеличить счетчик: {count}
        </button>
        <button onClick={() => setName(name === "Иван" ? "Петр" : "Иван")}>
          Изменить имя: {name}
        </button>
        <button onClick={() => setAge(age === 25 ? 30 : 25)}>
          Изменить возраст: {age}
        </button>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <div>
          <h4>Дорогой компонент:</h4>
          <ExpensiveChild name={name} age={age} />
        </div>

        <div>
          <h4>Простой компонент:</h4>
          <SimpleChild text="Статический текст" />
        </div>
      </div>
    </div>
  )
}

export default Problem1
