# client/Dockerfile
FROM node:18

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Serve the production build using a static file server
RUN npm install -g serve

EXPOSE 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
