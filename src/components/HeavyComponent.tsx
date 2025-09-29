import React from "react"

const HeavyComponent = () => {
  // Имитация тяжелого компонента с большим количеством элементов
  const items = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    name: `Элемент ${i}`,
    value: Math.random() * 1000,
  }))

  return (
    <div style={{ padding: "20px" }}>
      <h3>Тяжелый компонент</h3>
      <p>
        Этот компонент содержит 1000 элементов и имитирует тяжелую загрузку.
      </p>

      <div
        style={{
          maxHeight: "300px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "10px",
          backgroundColor: "#f9f9f9",
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              padding: "5px",
              borderBottom: "1px solid #eee",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>{item.name}</span>
            <span style={{ color: "#666" }}>{item.value.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <p style={{ marginTop: "10px", color: "#666" }}>
        Всего элементов: {items.length}
      </p>
    </div>
  )
}

export default HeavyComponent
