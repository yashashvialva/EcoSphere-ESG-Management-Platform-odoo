FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

EXPOSE 3000

# Vite needs to be bound to 0.0.0.0 to be accessible from outside the container
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
