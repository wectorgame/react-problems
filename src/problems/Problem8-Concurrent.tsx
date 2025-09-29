import { useState, useTransition, useDeferredValue, useMemo } from "react"

interface Product {
  id: number
  name: string
  price: number
  category: string
  rating: number
  inStock: boolean
}

const generateProducts = (count: number): Product[] => {
  const categories = ["Электроника", "Одежда", "Книги", "Спорт", "Дом", "Красота"]
  
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: `Товар ${i + 1}`,
    price: Math.floor(Math.random() * 10000) + 100,
    category: categories[Math.floor(Math.random() * categories.length)],
    rating: Math.floor(Math.random() * 5) + 1,
    inStock: Math.random() > 0.2
  }))
}

const ProductCard = ({ product }: { product: Product }) => {
  // Имитация тяжелых вычислений для каждого товара
  const expensiveCalculation = useMemo(() => {
    let result = 0
    for (let i = 0; i < 100000; i++) {
      result += Math.random()
    }
    return result
  }, [product.id])
  
  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "16px",
      margin: "8px",
      backgroundColor: product.inStock ? "#fff" : "#f5f5f5",
      opacity: product.inStock ? 1 : 0.6
    }}>
      <h3 style={{ margin: "0 0 8px 0", fontSize: "16px" }}>{product.name}</h3>
      <p style={{ margin: "0 0 8px 0", color: "#666" }}>{product.category}</p>
      <p style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "bold" }}>
        {product.price.toLocaleString()} ₽
      </p>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#ffa500" }}>
          {"★".repeat(product.rating)}{"☆".repeat(5 - product.rating)}
        </span>
        <span style={{ 
          color: product.inStock ? "#28a745" : "#dc3545",
          fontSize: "12px",
          fontWeight: "bold"
        }}>
          {product.inStock ? "В наличии" : "Нет в наличии"}
        </span>
      </div>
    </div>
  )
}

const Problem8 = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [category, setCategory] = useState("")
  const [sortBy, setSortBy] = useState<"name" | "price" | "rating">("name")
  const [showOnlyInStock, setShowOnlyInStock] = useState(false)
  const [isPending, startTransition] = useTransition()
  
  const products = useMemo(() => generateProducts(2000), [])
  
  // Проблема: фильтрация и сортировка блокируют UI
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !category || product.category === category
      const matchesStock = !showOnlyInStock || product.inStock
      return matchesSearch && matchesCategory && matchesStock
    })
    
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "price":
          return a.price - b.price
        case "rating":
          return b.rating - a.rating
        default:
          return 0
      }
    })
    
    return filtered
  }, [products, searchTerm, category, sortBy, showOnlyInStock])
  
  const deferredProducts = useDeferredValue(filteredProducts)
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }
  
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    startTransition(() => {
      setCategory(e.target.value)
    })
  }
  
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    startTransition(() => {
      setSortBy(e.target.value as "name" | "price" | "rating")
    })
  }
  
  const handleStockChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      setShowOnlyInStock(e.target.checked)
    })
  }
  
  return (
    <div style={{ padding: "20px" }}>
      <h2>Задача 8: Concurrent Features и приоритизация</h2>
      
      <div style={{ marginBottom: "20px" }}>
        <p>
          Фильтрация и сортировка 2000 товаров блокирует UI, делая приложение неотзывчивым.
          При изменении фильтров пользователь не может взаимодействовать с интерфейсом.
        </p>
      </div>
      
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Поиск товаров..."
            value={searchTerm}
            onChange={handleSearchChange}
            style={{
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              minWidth: "200px"
            }}
          />
          
          <select
            value={category}
            onChange={handleCategoryChange}
            style={{
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: "4px"
            }}
          >
            <option value="">Все категории</option>
            <option value="Электроника">Электроника</option>
            <option value="Одежда">Одежда</option>
            <option value="Книги">Книги</option>
            <option value="Спорт">Спорт</option>
            <option value="Дом">Дом</option>
            <option value="Красота">Красота</option>
          </select>
          
          <select
            value={sortBy}
            onChange={handleSortChange}
            style={{
              padding: "8px 12px",
              border: "1px solid #ddd",
              borderRadius: "4px"
            }}
          >
            <option value="name">По названию</option>
            <option value="price">По цене</option>
            <option value="rating">По рейтингу</option>
          </select>
          
          <label style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <input
              type="checkbox"
              checked={showOnlyInStock}
              onChange={handleStockChange}
            />
            Только в наличии
          </label>
        </div>
        
        {isPending && (
          <div style={{ color: "#007bff", marginBottom: "10px" }}>
            Обновление списка...
          </div>
        )}
        
        <p style={{ margin: "0", color: "#666" }}>
          Найдено товаров: {deferredProducts.length}
        </p>
      </div>
      
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
        gap: "8px",
        maxHeight: "600px",
        overflow: "auto",
        border: "1px solid #ddd",
        borderRadius: "4px",
        padding: "8px"
      }}>
        {deferredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      <div style={{ marginTop: "20px" }}>
        <h4>Проблемы:</h4>
        <ul>
          <li>Фильтрация 2000 товаров блокирует UI</li>
          <li>Пользователь не может взаимодействовать с интерфейсом во время обработки</li>
          <li>Тяжелые вычисления выполняются синхронно</li>
          <li>Нет приоритизации обновлений</li>
        </ul>
      </div>
    </div>
  )
}

export default Problem8
