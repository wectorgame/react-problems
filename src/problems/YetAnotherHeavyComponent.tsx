import React from "react"

const YetAnotherHeavyComponent = () => {
  // Имитация еще одного тяжелого компонента с графиками
  const chartData = Array.from({ length: 200 }, (_, i) => ({
    x: i,
    y: Math.sin(i * 0.1) * 100 + Math.random() * 50,
    category: ["A", "B", "C", "D"][i % 4],
  }))

  return (
    <div style={{ padding: "20px" }}>
      <h3>Еще один тяжелый компонент</h3>
      <p>Этот компонент содержит 200 точек данных для графика.</p>

      <div
        style={{
          border: "1px solid #ccc",
          padding: "20px",
          backgroundColor: "#fafafa",
          borderRadius: "8px",
        }}
      >
        <h4>График данных</h4>
        <div
          style={{
            height: "300px",
            border: "1px solid #ddd",
            backgroundColor: "white",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {chartData.map((point, index) => (
            <div
              key={index}
              style={{
                position: "absolute",
                left: `${(point.x / 200) * 100}%`,
                bottom: `${50 + (point.y / 150) * 50}%`,
                width: "2px",
                height: "2px",
                backgroundColor:
                  point.category === "A"
                    ? "#ff6b6b"
                    : point.category === "B"
                    ? "#4ecdc4"
                    : point.category === "C"
                    ? "#45b7d1"
                    : "#96ceb4",
                borderRadius: "50%",
              }}
              title={`x: ${point.x}, y: ${point.y.toFixed(2)}`}
            />
          ))}
        </div>

        <div
          style={{
            marginTop: "10px",
            display: "flex",
            gap: "20px",
            fontSize: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: "#ff6b6b",
                borderRadius: "50%",
              }}
            ></div>
            <span>Категория A</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: "#4ecdc4",
                borderRadius: "50%",
              }}
            ></div>
            <span>Категория B</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: "#45b7d1",
                borderRadius: "50%",
              }}
            ></div>
            <span>Категория C</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <div
              style={{
                width: "10px",
                height: "10px",
                backgroundColor: "#96ceb4",
                borderRadius: "50%",
              }}
            ></div>
            <span>Категория D</span>
          </div>
        </div>
      </div>

      <p style={{ marginTop: "10px", color: "#666" }}>
        Всего точек данных: {chartData.length}
      </p>
    </div>
  )
}

export default YetAnotherHeavyComponent
