## Running via Electon Executable

The executable has already been created and is inside release folder for windows machine 

- Double click on Jignyasa.exe to start the software. 


## Running from source code. 

Open Terminal 1 for server:
```bash
cd server
npm install
npm run seed
npm start
```

Open Terminal 2 for client:
```bash
cd client
npm install
npm run dev
```

Open http://localhost:5173 in your browser. 

## Running with docker

### Pre-requisites
- Docker
- Docker compose

Start the docker engine

Open terminal and open the root of this project
```bash
docker-compose up --build
```

Open http://localhost:5173 in your browser. 

