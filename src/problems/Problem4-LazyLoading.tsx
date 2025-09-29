import { useState, Suspense, lazy } from "react"

// Используйте lazy для отложенной загрузки
const HeavyComponent = lazy(() => import("../components/HeavyComponent"))
const AnotherHeavyComponent = lazy(
  () => import("../components/AnotherHeavyComponent")
)
const YetAnotherHeavyComponent = lazy(
  () => import("../components/YetAnotherHeavyComponent")
)

const Problem4 = () => {
  const [activeTab, setActiveTab] = useState<
    "heavy" | "another" | "yetAnother"
  >("heavy")
  const [showLazyComponent, setShowLazyComponent] = useState(false)

  const renderActiveComponent = () => {
    switch (activeTab) {
      case "heavy":
        return <HeavyComponent />
      case "another":
        return <AnotherHeavyComponent />
      case "yetAnother":
        return <YetAnotherHeavyComponent />
      default:
        return null
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Задача 4: Lazy Loading и Code Splitting</h2>

      <div style={{ marginBottom: "20px" }}>
        <p>
          Все тяжелые компоненты загружаются сразу при загрузке страницы, что
          увеличивает время первоначальной загрузки. Откройте Network tab в
          DevTools и посмотрите, сколько компонентов загружается сразу!
        </p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h4>Табы:</h4>
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <button
            onClick={() => setActiveTab("heavy")}
            style={{
              padding: "10px 20px",
              backgroundColor: activeTab === "heavy" ? "#007bff" : "#f8f9fa",
              color: activeTab === "heavy" ? "white" : "black",
              border: "1px solid #dee2e6",
              borderRadius: "4px",
            }}
          >
            Тяжелый компонент
          </button>
          <button
            onClick={() => setActiveTab("another")}
            style={{
              padding: "10px 20px",
              backgroundColor: activeTab === "another" ? "#007bff" : "#f8f9fa",
              color: activeTab === "another" ? "white" : "black",
              border: "1px solid #dee2e6",
              borderRadius: "4px",
            }}
          >
            Другой тяжелый компонент
          </button>
          <button
            onClick={() => setActiveTab("yetAnother")}
            style={{
              padding: "10px 20px",
              backgroundColor:
                activeTab === "yetAnother" ? "#007bff" : "#f8f9fa",
              color: activeTab === "yetAnother" ? "white" : "black",
              border: "1px solid #dee2e6",
              borderRadius: "4px",
            }}
          >
            Еще один тяжелый компонент
          </button>
        </div>

        <div
          style={{
            border: "1px solid #dee2e6",
            padding: "20px",
            borderRadius: "4px",
          }}
        >
          <Suspense fallback={<div>Загрузка...</div>}>
            {renderActiveComponent()}
          </Suspense>
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h4>Условная загрузка:</h4>
        <button
          onClick={() => setShowLazyComponent(!showLazyComponent)}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
          }}
        >
          {showLazyComponent ? "Скрыть" : "Показать"} ленивый компонент
        </button>

        {showLazyComponent && (
          <div
            style={{
              marginTop: "10px",
              border: "1px solid #dee2e6",
              padding: "20px",
              borderRadius: "4px",
            }}
          >
            <Suspense fallback={<div>Загрузка...</div>}>
              <HeavyComponent />
            </Suspense>
          </div>
        )}
      </div>
    </div>
  )
}

export default Problem4
