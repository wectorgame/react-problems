import { useState, useMemo, useCallback, memo, useEffect } from "react"

interface ListItem {
  id: number
  name: string
  email: string
  avatar: string
  description: string
}

const generateData = (count: number): ListItem[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `Пользователь ${i + 1}`,
    email: `user${i + 1}@example.com`,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
    description: `Описание пользователя ${
      i + 1
    }. Это очень длинное описание, которое может занимать несколько строк и содержать много текста для демонстрации производительности.`,
  }))
}

const ListItem = memo(({ item, index }: { item: ListItem; index: number }) => {
  console.log(`Рендер элемента ${index}`)

  return (
    <div
      style={{
        display: "flex",
        padding: "12px",
        borderBottom: "1px solid #eee",
        alignItems: "center",
        minHeight: "80px",
      }}
    >
      <img
        src={item.avatar}
        alt={item.name}
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          marginRight: "12px",
        }}
      />
      <div>
        <h4 style={{ margin: "0 0 4px 0" }}>{item.name}</h4>
        <p style={{ margin: "0 0 4px 0", color: "#666" }}>{item.email}</p>
        <p style={{ margin: "0", fontSize: "14px", color: "#888" }}>
          {item.description}
        </p>
      </div>
    </div>
  )
})

const Problem6 = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [itemHeight] = useState(80)
  const [containerHeight] = useState(400)
  const [scrollTop, setScrollTop] = useState(0)

  const data = useMemo(() => generateData(10000), [])

  useEffect(() => {
    setScrollTop(0)
  }, [searchTerm])

  const filteredData = useMemo(() => {
    return data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [data, searchTerm])

  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight)
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      filteredData.length
    )

    return filteredData.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index,
    }))
  }, [filteredData, scrollTop, itemHeight, containerHeight])

  const totalHeight = filteredData.length * itemHeight
  const offsetY = Math.floor(scrollTop / itemHeight) * itemHeight

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  const containerStyle = useMemo<React.CSSProperties>(
    () => ({
      height: containerHeight,
      overflow: "auto",
      border: "1px solid #ddd",
      borderRadius: "4px",
      position: "relative",
    }),
    [containerHeight]
  )

  return (
    <div style={{ padding: "20px" }}>
      <h2>Задача 6: Виртуализация больших списков</h2>

      <div style={{ marginBottom: "20px" }}>
        <p>
          Список из 10,000 элементов рендерится полностью, что вызывает
          серьезные проблемы производительности. При скролле все элементы
          перерендериваются, что приводит к лагам.
        </p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Поиск по имени или email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 12px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "16px",
          }}
        />
        <p style={{ margin: "8px 0 0 0", color: "#666" }}>
          Найдено: {filteredData.length} из {data.length} элементов
        </p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <div style={containerStyle} onScroll={handleScroll}>
          <div style={{ height: totalHeight, position: "relative" }}>
            <div style={{ transform: `translateY(${offsetY}px)` }}>
              {visibleItems.map((item) => (
                <ListItem key={item.id} item={item} index={item.index} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h4>Проблемы:</h4>
        <ul>
          <li>Все 10,000 элементов рендерятся одновременно</li>
          <li>При скролле все элементы перерендериваются</li>
          <li>
            Поиск работает медленно из-за большого количества DOM элементов
          </li>
          <li>Память расходуется на невидимые элементы</li>
        </ul>
      </div>
    </div>
  )
}

export default Problem6
