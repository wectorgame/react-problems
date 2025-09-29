const AnotherHeavyComponent = () => {
  // Имитация другого тяжелого компонента
  const data = Array.from({ length: 500 }, (_, i) => ({
    id: i,
    title: `Заголовок ${i}`,
    description: `Описание для элемента ${i}`,
    price: Math.random() * 1000,
    category: ["Электроника", "Одежда", "Книги", "Спорт"][i % 4],
  }))

  return (
    <div style={{ padding: "20px" }}>
      <h3>Другой тяжелый компонент</h3>
      <p>Этот компонент содержит 500 товаров с различными категориями.</p>

      <div
        style={{
          maxHeight: "300px",
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: "10px",
          backgroundColor: "#f0f8ff",
        }}
      >
        {data.map((item) => (
          <div
            key={item.id}
            style={{
              padding: "10px",
              borderBottom: "1px solid #ddd",
              backgroundColor: "white",
              marginBottom: "5px",
              borderRadius: "4px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <h4 style={{ margin: "0 0 5px 0", color: "#333" }}>{item.title}</h4>
            <p style={{ margin: "0 0 5px 0", color: "#666", fontSize: "14px" }}>
              {item.description}
            </p>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  backgroundColor: "#e3f2fd",
                  padding: "2px 8px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  color: "#1976d2",
                }}
              >
                {item.category}
              </span>
              <span style={{ fontWeight: "bold", color: "#2e7d32" }}>
                ${item.price.toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <p style={{ marginTop: "10px", color: "#666" }}>
        Всего товаров: {data.length}
      </p>
    </div>
  )
}

export default AnotherHeavyComponent
