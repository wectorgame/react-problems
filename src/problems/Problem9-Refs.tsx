import { useState, useRef, useEffect, useCallback } from "react"

interface CanvasState {
  isDrawing: boolean
  lastX: number
  lastY: number
}

const Problem9 = () => {
  const [brushSize, setBrushSize] = useState(5)
  const [brushColor, setBrushColor] = useState("#000000")
  const [isDrawing, setIsDrawing] = useState(false)
  const [undoStack, setUndoStack] = useState<ImageData[]>([])
  const [redoStack, setRedoStack] = useState<ImageData[]>([])
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()
  const lastDrawTimeRef = useRef<number>(0)
  
  // Проблема: canvas перерендеривается при каждом изменении состояния
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return
    
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setIsDrawing(true)
    
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return
    
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineWidth = brushSize
    ctx.strokeStyle = brushColor
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
  }
  
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return
    
    // Проблема: нет throttling для mouse move
    const now = Date.now()
    if (now - lastDrawTimeRef.current < 16) return // 60fps
    lastDrawTimeRef.current = now
    
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return
    
    ctx.lineTo(x, y)
    ctx.stroke()
  }
  
  const handleMouseUp = () => {
    if (!isDrawing) return
    
    setIsDrawing(false)
    
    // Сохраняем состояние для undo
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext("2d")
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
        setUndoStack(prev => [...prev, imageData])
        setRedoStack([]) // Очищаем redo при новом действии
      }
    }
  }
  
  const clearCanvas = () => {
    if (!canvasRef.current) return
    
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return
    
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    
    // Сохраняем состояние для undo
    const imageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
    setUndoStack(prev => [...prev, imageData])
    setRedoStack([])
  }
  
  const undo = () => {
    if (undoStack.length === 0 || !canvasRef.current) return
    
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return
    
    // Сохраняем текущее состояние в redo
    const currentImageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
    setRedoStack(prev => [...prev, currentImageData])
    
    // Восстанавливаем предыдущее состояние
    const previousImageData = undoStack[undoStack.length - 1]
    ctx.putImageData(previousImageData, 0, 0)
    
    setUndoStack(prev => prev.slice(0, -1))
  }
  
  const redo = () => {
    if (redoStack.length === 0 || !canvasRef.current) return
    
    const ctx = canvasRef.current.getContext("2d")
    if (!ctx) return
    
    // Сохраняем текущее состояние в undo
    const currentImageData = ctx.getImageData(0, 0, canvasRef.current.width, canvasRef.current.height)
    setUndoStack(prev => [...prev, currentImageData])
    
    // Восстанавливаем следующее состояние
    const nextImageData = redoStack[redoStack.length - 1]
    ctx.putImageData(nextImageData, 0, 0)
    
    setRedoStack(prev => prev.slice(0, -1))
  }
  
  // Проблема: canvas пересоздается при каждом рендере
  const resizeCanvas = useCallback(() => {
    if (!canvasRef.current || !containerRef.current) return
    
    const container = containerRef.current
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    
    if (!ctx) return
    
    // Сохраняем текущее изображение
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    
    // Устанавливаем новые размеры
    canvas.width = container.clientWidth
    canvas.height = container.clientHeight
    
    // Восстанавливаем изображение
    ctx.putImageData(imageData, 0, 0)
  }, [])
  
  useEffect(() => {
    resizeCanvas()
    
    const handleResize = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      animationFrameRef.current = requestAnimationFrame(resizeCanvas)
    }
    
    window.addEventListener("resize", handleResize)
    
    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [resizeCanvas])
  
  return (
    <div style={{ padding: "20px" }}>
      <h2>Задача 9: useRef и оптимизация DOM операций</h2>
      
      <div style={{ marginBottom: "20px" }}>
        <p>
          Canvas перерендеривается при каждом изменении состояния, что приводит к потере изображения
          и плохой производительности. DOM операции выполняются синхронно, блокируя UI.
        </p>
      </div>
      
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
          <label>
            Размер кисти:
            <input
              type="range"
              min="1"
              max="20"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              style={{ marginLeft: "5px" }}
            />
            {brushSize}px
          </label>
          
          <label>
            Цвет:
            <input
              type="color"
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
              style={{ marginLeft: "5px" }}
            />
          </label>
          
          <button onClick={clearCanvas} style={{ padding: "5px 10px" }}>
            Очистить
          </button>
          
          <button 
            onClick={undo} 
            disabled={undoStack.length === 0}
            style={{ padding: "5px 10px" }}
          >
            Отменить
          </button>
          
          <button 
            onClick={redo} 
            disabled={redoStack.length === 0}
            style={{ padding: "5px 10px" }}
          >
            Повторить
          </button>
        </div>
      </div>
      
      <div 
        ref={containerRef}
        style={{
          border: "2px solid #ddd",
          borderRadius: "4px",
          width: "100%",
          height: "400px",
          position: "relative",
          overflow: "hidden"
        }}
      >
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            cursor: "crosshair",
            display: "block",
            width: "100%",
            height: "100%"
          }}
        />
      </div>
      
      <div style={{ marginTop: "20px" }}>
        <h4>Проблемы:</h4>
        <ul>
          <li>Canvas пересоздается при каждом рендере</li>
          <li>Изображение теряется при изменении состояния</li>
          <li>Mouse move события не оптимизированы</li>
          <li>Resize операции блокируют UI</li>
          <li>Нет мемоизации для тяжелых операций</li>
        </ul>
      </div>
    </div>
  )
}

export default Problem9
