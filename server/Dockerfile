FROM node:18

WORKDIR /app

# Only copy package files first for better layer caching
COPY package*.json ./

# Install deps in Linux environment
RUN npm install

# Now copy the rest of the code
COPY . .

# Build TypeScript (both server and scripts)
RUN npm run build
RUN npm run seed

EXPOSE 3001
CMD ["node", "dist/server.js"]
