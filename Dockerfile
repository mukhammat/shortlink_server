# Используем официальное изображение Node.js
FROM node:18

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы
COPY . .

# Открываем порт приложения
EXPOSE 5001

# Запуск приложения
CMD ["npm", "start"]


