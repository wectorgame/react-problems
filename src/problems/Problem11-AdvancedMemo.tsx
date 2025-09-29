import { useState, useMemo, useCallback, memo, useRef } from "react"

interface ExpensiveData {
  id: number
  value: number
  computed: number
  metadata: {
    category: string
    tags: string[]
    timestamp: number
  }
}

interface FilterState {
  category: string
  minValue: number
  maxValue: number
  tags: string[]
  sortBy: "value" | "computed" | "timestamp"
  sortOrder: "asc" | "desc"
}

const Problem11 = () => {
  const [data, setData] = useState<ExpensiveData[]>([])
  const [filter, setFilter] = useState<FilterState>({
    category: "all",
    minValue: 0,
    maxValue: 1000,
    tags: [],
    sortBy: "value",
    sortOrder: "asc",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set())
  const [isGenerating, setIsGenerating] = useState(false)

  // Проблема: тяжелые вычисления выполняются при каждом рендере
  const generateExpensiveData = (count: number): ExpensiveData[] => {
    const categories = ["A", "B", "C", "D", "E"]
    const tags = ["tag1", "tag2", "tag3", "tag4", "tag5"]

    return Array.from({ length: count }, (_, i) => {
      // Имитация тяжелых вычислений
      let computed = 0
      for (let j = 0; j < 10000; j++) {
        computed += Math.sqrt(i * j) * Math.sin(i + j)
      }

      return {
        id: i,
        value: Math.floor(Math.random() * 1000),
        computed: Math.floor(computed),
        metadata: {
          category: categories[Math.floor(Math.random() * categories.length)],
          tags: tags.slice(0, Math.floor(Math.random() * 3) + 1),
          timestamp: Date.now() + i,
        },
      }
    })
  }

  // Проблема: данные генерируются при каждом вызове
  const handleGenerateData = () => {
    setIsGenerating(true)
    // Имитация асинхронной генерации
    setTimeout(() => {
      const newData = generateExpensiveData(1000)
      setData(newData)
      setIsGenerating(false)
    }, 100)
  }

  // Проблема: фильтрация выполняется при каждом рендере
  const filteredData = data.filter((item) => {
    if (
      filter.category !== "all" &&
      item.metadata.category !== filter.category
    ) {
      return false
    }
    if (item.value < filter.minValue || item.value > filter.maxValue) {
      return false
    }
    if (
      filter.tags.length > 0 &&
      !filter.tags.some((tag) => item.metadata.tags.includes(tag))
    ) {
      return false
    }
    if (
      searchTerm &&
      !item.metadata.tags.some((tag) => tag.includes(searchTerm))
    ) {
      return false
    }
    return true
  })

  // Проблема: сортировка выполняется при каждом рендере
  const sortedData = filteredData.sort((a, b) => {
    let aValue: number, bValue: number

    switch (filter.sortBy) {
      case "value":
        aValue = a.value
        bValue = b.value
        break
      case "computed":
        aValue = a.computed
        bValue = b.computed
        break
      case "timestamp":
        aValue = a.metadata.timestamp
        bValue = b.metadata.timestamp
        break
      default:
        return 0
    }

    return filter.sortOrder === "asc" ? aValue - bValue : bValue - aValue
  })

  // Проблема: статистика пересчитывается при каждом рендере
  const statistics = {
    total: data.length,
    filtered: filteredData.length,
    selected: selectedItems.size,
    averageValue:
      data.length > 0
        ? data.reduce((sum, item) => sum + item.value, 0) / data.length
        : 0,
    averageComputed:
      data.length > 0
        ? data.reduce((sum, item) => sum + item.computed, 0) / data.length
        : 0,
    categories: [...new Set(data.map((item) => item.metadata.category))],
    allTags: [...new Set(data.flatMap((item) => item.metadata.tags))],
  }

  // Проблема: функции пересоздаются при каждом рендере
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilter((prev) => ({ ...prev, [key]: value }))
  }

  const handleItemSelect = (id: number) => {
    setSelectedItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  const handleSelectAll = () => {
    if (selectedItems.size === sortedData.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(sortedData.map((item) => item.id)))
    }
  }

  const handleBulkOperation = (operation: "delete" | "update") => {
    if (operation === "delete") {
      setData((prev) => prev.filter((item) => !selectedItems.has(item.id)))
      setSelectedItems(new Set())
    }
  }

  // Проблема: компонент перерендеривается при каждом изменении
  const DataItem = ({
    item,
    isSelected,
    onSelect,
  }: {
    item: ExpensiveData
    isSelected: boolean
    onSelect: (id: number) => void
  }) => {
    console.log(`Рендер DataItem ${item.id}`)

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px",
          border: "1px solid #eee",
          borderRadius: "4px",
          marginBottom: "8px",
          backgroundColor: isSelected ? "#e3f2fd" : "#fff",
          cursor: "pointer",
        }}
        onClick={() => onSelect(item.id)}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onSelect(item.id)}
          style={{ marginRight: "10px" }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: "bold" }}>
            Item {item.id} - {item.metadata.category}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            Value: {item.value} | Computed: {item.computed}
          </div>
          <div style={{ fontSize: "12px", color: "#666" }}>
            Tags: {item.metadata.tags.join(", ")}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Задача 11: Продвинутая мемоизация и оптимизация</h2>

      <div style={{ marginBottom: "20px" }}>
        <p>
          Тяжелые вычисления выполняются при каждом рендере, отсутствует
          мемоизация сложных операций, компоненты перерендериваются без
          необходимости. Нет оптимизации для больших объемов данных.
        </p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={handleGenerateData}
          disabled={isGenerating}
          style={{
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: isGenerating ? "not-allowed" : "pointer",
            marginRight: "10px",
          }}
        >
          {isGenerating
            ? "Генерация..."
            : "Сгенерировать данные (1000 элементов)"}
        </button>

        <button
          onClick={handleSelectAll}
          disabled={sortedData.length === 0}
          style={{
            padding: "10px 20px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          {selectedItems.size === sortedData.length
            ? "Снять все"
            : "Выбрать все"}
        </button>

        <button
          onClick={() => handleBulkOperation("delete")}
          disabled={selectedItems.size === 0}
          style={{
            padding: "10px 20px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: selectedItems.size === 0 ? "not-allowed" : "pointer",
          }}
        >
          Удалить выбранные ({selectedItems.size})
        </button>
      </div>

      <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
        <div style={{ flex: 1 }}>
          <h3>Фильтры</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <div>
              <label>Категория:</label>
              <select
                value={filter.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                style={{ width: "100%", padding: "5px" }}
              >
                <option value="all">Все</option>
                {statistics.categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label>Сортировка:</label>
              <select
                value={`${filter.sortBy}-${filter.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split("-")
                  handleFilterChange("sortBy", sortBy)
                  handleFilterChange("sortOrder", sortOrder)
                }}
                style={{ width: "100%", padding: "5px" }}
              >
                <option value="value-asc">По значению (возр.)</option>
                <option value="value-desc">По значению (убыв.)</option>
                <option value="computed-asc">По вычисленному (возр.)</option>
                <option value="computed-desc">По вычисленному (убыв.)</option>
                <option value="timestamp-asc">По времени (возр.)</option>
                <option value="timestamp-desc">По времени (убыв.)</option>
              </select>
            </div>

            <div>
              <label>Мин. значение: {filter.minValue}</label>
              <input
                type="range"
                min="0"
                max="1000"
                value={filter.minValue}
                onChange={(e) =>
                  handleFilterChange("minValue", Number(e.target.value))
                }
                style={{ width: "100%" }}
              />
            </div>

            <div>
              <label>Макс. значение: {filter.maxValue}</label>
              <input
                type="range"
                min="0"
                max="1000"
                value={filter.maxValue}
                onChange={(e) =>
                  handleFilterChange("maxValue", Number(e.target.value))
                }
                style={{ width: "100%" }}
              />
            </div>
          </div>

          <div style={{ marginTop: "10px" }}>
            <label>Поиск по тегам:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Введите тег..."
              style={{ width: "100%", padding: "5px" }}
            />
          </div>
        </div>

        <div style={{ flex: 1 }}>
          <h3>Статистика</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "10px",
            }}
          >
            <div
              style={{
                padding: "10px",
                backgroundColor: "#f8f9fa",
                borderRadius: "4px",
              }}
            >
              <strong>Всего:</strong> {statistics.total}
            </div>
            <div
              style={{
                padding: "10px",
                backgroundColor: "#f8f9fa",
                borderRadius: "4px",
              }}
            >
              <strong>Отфильтровано:</strong> {statistics.filtered}
            </div>
            <div
              style={{
                padding: "10px",
                backgroundColor: "#f8f9fa",
                borderRadius: "4px",
              }}
            >
              <strong>Выбрано:</strong> {statistics.selected}
            </div>
            <div
              style={{
                padding: "10px",
                backgroundColor: "#f8f9fa",
                borderRadius: "4px",
              }}
            >
              <strong>Ср. значение:</strong>{" "}
              {statistics.averageValue.toFixed(2)}
            </div>
            <div
              style={{
                padding: "10px",
                backgroundColor: "#f8f9fa",
                borderRadius: "4px",
              }}
            >
              <strong>Ср. вычисленное:</strong>{" "}
              {statistics.averageComputed.toFixed(2)}
            </div>
            <div
              style={{
                padding: "10px",
                backgroundColor: "#f8f9fa",
                borderRadius: "4px",
              }}
            >
              <strong>Тегов:</strong> {statistics.allTags.length}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxHeight: "400px", overflow: "auto" }}>
        <h3>Данные ({sortedData.length})</h3>
        {sortedData.map((item) => (
          <DataItem
            key={item.id}
            item={item}
            isSelected={selectedItems.has(item.id)}
            onSelect={handleItemSelect}
          />
        ))}
      </div>

      <div style={{ marginTop: "20px" }}>
        <h4>Проблемы:</h4>
        <ul>
          <li>Тяжелые вычисления выполняются при каждом рендере</li>
          <li>Отсутствует мемоизация сложных операций</li>
          <li>Компоненты перерендериваются без необходимости</li>
          <li>Нет оптимизации для больших объемов данных</li>
          <li>Функции пересоздаются при каждом рендере</li>
          <li>Отсутствует виртуализация для больших списков</li>
          <li>Нет дебаунсинга для поиска и фильтрации</li>
        </ul>
      </div>
    </div>
  )
}

export default Problem11
