// Importamos las librerias
import express, { json, urlencoded } from "express";
import { createServer } from "http";
import cors from "cors";
import cookieParser from "cookie-parser";
import { textSync } from "figlet";
import os from "os";
import dotenv from "dotenv";
import { join } from "path";
import "colors";
import { ApolloServer } from "apollo-server-express";
import schema from "./graphql/schema";
import dbconnection from "./database/connection";

import insertCoord from "./helpers/insertcoord";

// Inicializamos las variables de entorno
dotenv.config();

// Inicializamos servidor express
const app = express();

// Middlewares
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use("*", cors());
app.use(express.static(join(__dirname, "../public")));

// Variables generales de la Api
const appHost = process.env.APP_COVID_HOST || "http://localhost";
const appPort = 4000;
const appNombre = "API Coronavirus Info";
const appAutor = process.env.APP_AUTOR || "SANTANDERTECH";

// Inicializamos servidor de Apollo
const server = new ApolloServer({
  schema: schema,
  introspection: true,
  playground: true
});
server.applyMiddleware({ app });

// Ruta estática
app.use("/", (req, res) => {
  res.redirect("/");
});

// Conectamos a la base de datos
dbconnection();

// Ejecutamos nuestras funciones de Scraping
import "./helpers/scraping";

// Insertamos las coordenadas (única vez)
//insertCoord();

// Creamos servidor HTTP
const httpServer = createServer(app);

// Arrancamos el servidor
httpServer.listen(appPort, () => {
  console.log(textSync(appAutor).blue.bold);
  console.log(
    "*********************************************************************************"
      .rainbow
  );
  console.log(appNombre.magenta.bold);
  console.log(
    `🚀  ${os.platform().toUpperCase()} Servidor, listo en : `.yellow.bold +
      `${appHost}:${appPort}/graphql`.white.bold
  );
  console.log(
    "*********************************************************************************"
      .rainbow
  );
});
