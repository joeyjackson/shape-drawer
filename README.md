# shape-drawer
Drawing application using the MERN stack

## Installing Dependencies
```
npm install
cd react-app && npm install
cd ..
```

## Configuration
Create a `.env` file based on the provided `.sample-env` file. Use this to provide serving details, mongo configuration, and credentials.

## Running the Application
### Development
```
npm run build
npm run docker-build-mongodb
npm run dev
```
This will run 2 servers that watch for changes on the frontend and backend:
* http://localhost:3000 will hot-reload changes to the frontend (react-app)
* http://localhost:3001 will hot-reload changes to the backend - frontend changes will not be reflected here as it serves the `build` react page


### Serving Locally
NOTE: Will require a running mongodb that the app is configured to connect to (e.g. `npm run dev:mongodb`)
```
npm run build
npm run serve
```
To stop the server:
```
npm run stop
```


### Docker:
```
npm run docker-build-nc
docker compose up -d
```