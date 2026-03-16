# використовуємо офіційний Node образ
FROM node:20

# робоча папка в контейнері
WORKDIR /app

# копіюємо package.json
COPY package*.json ./

# встановлюємо залежності
RUN npm install

# копіюємо весь проект
COPY . .

# порт який використовує сервер
EXPOSE 3000

# команда запуску
CMD ["npm", "start"]