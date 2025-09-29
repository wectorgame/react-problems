import React, { createContext, useContext, useState, useMemo, memo } from 'react';

// Контекст пересоздается при каждом рендере
const UserContext = createContext<{
  user: { name: string; email: string; age: number };
  updateUser: (user: { name: string; email: string; age: number }) => void;
  theme: string;
  toggleTheme: () => void;
}>({
  user: { name: '', email: '', age: 0 },
  updateUser: () => {},
  theme: 'light',
  toggleTheme: () => {}
});

// ❌ ПРОБЛЕМА: Этот компонент перерендеривается при любом изменении контекста
const UserProfile = memo(() => {
  console.log('UserProfile перерендерился!');
  const { user, updateUser } = useContext(UserContext);
  
  return (
    <div style={{ padding: '10px', border: '1px solid #ccc', margin: '5px' }}>
      <h3>Профиль пользователя</h3>
      <p>Имя: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Возраст: {user.age}</p>
      <button onClick={() => updateUser({ ...user, age: user.age + 1 })}>
        Увеличить возраст
      </button>
    </div>
  );
});

// Этот компонент тоже перерендеривается при изменении темы
const ThemeDisplay = memo(() => {
  console.log('ThemeDisplay перерендерился!');
  const { theme, toggleTheme } = useContext(UserContext);
  
  return (
    <div style={{ padding: '10px', border: '1px solid #ccc', margin: '5px' }}>
      <h3>Тема</h3>
      <p>Текущая тема: {theme}</p>
      <button onClick={toggleTheme}>
        Переключить тему
      </button>
    </div>
  );
});

// ❌ ПРОБЛЕМА: Этот компонент перерендеривается при любом изменении контекста
const UserSettings = memo(() => {
  console.log('UserSettings перерендерился!');
  const { user, updateUser } = useContext(UserContext);
  
  return (
    <div style={{ padding: '10px', border: '1px solid #ccc', margin: '5px' }}>
      <h3>Настройки пользователя</h3>
      <input 
        type="text" 
        value={user.name}
        onChange={(e) => updateUser({ ...user, name: e.target.value })}
        placeholder="Имя"
        style={{ margin: '5px', padding: '5px' }}
      />
      <input 
        type="email" 
        value={user.email}
        onChange={(e) => updateUser({ ...user, email: e.target.value })}
        placeholder="Email"
        style={{ margin: '5px', padding: '5px' }}
      />
    </div>
  );
});

const Problem5 = () => {
  const [user, setUser] = useState({ name: 'Иван', email: 'ivan@example.com', age: 25 });
  const [theme, setTheme] = useState('light');
  const [otherState, setOtherState] = useState(0);

  // Объект контекста создается заново при каждом рендере
  const contextValue = {
    user,
    updateUser: setUser,
    theme,
    toggleTheme: () => setTheme(theme === 'light' ? 'dark' : 'light')
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Задача 5: Оптимизация Context API</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <p>Все компоненты, использующие контекст, перерендериваются при любом изменении контекста, 
        даже если они используют только часть данных. Откройте консоль и измените любое поле - 
        увидите лишние перерендеры!</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => setOtherState(s => s + 1)}>
          Изменить другое состояние: {otherState}
        </button>
      </div>

      <UserContext.Provider value={contextValue}>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <UserProfile />
          <ThemeDisplay />
          <UserSettings />
        </div>
      </UserContext.Provider>

    </div>
  );
};

export default Problem5;
