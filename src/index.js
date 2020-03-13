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
import { getall, getcountries } from "./helpers/scraping";

// Inicializamos las variables de entorno
dotenv.config();

// Inicializamos servidor express
const app = express();

// Middlewares
app.use(json()); // Hace un parse de las application/json
app.use(urlencoded({ extended: false })); // Decodifica los datos enviados desde un formulario
app.use(cookieParser()); // Hace un parse de las Cookies en los HTTP request al servidor
app.use("*", cors()); // Permite acceder a recursos del servidor desde otros dominios (frontend)
app.use(express.static(join(__dirname, "../public"))); // Establecemos una ruta estática

// Variables generales de la Api
export const appHost = process.env.APP_COVID_HOST;
export const appPort = 4000;
export const appGql = "graphql";
export const appNombre = "API Coronavirus Info";
export const appAutor = process.env.APP_AUTOR;

// Inicializamos servidor de Apollo
const server = new ApolloServer({
  schema: schema, // Pasamos el schema de GraphQL al servidor
  introspection: true, // Habilita instrospeccion de schema
  playground: true // Habilita el playground de apollo
});
server.applyMiddleware({ app });

// Ruta estática
app.use("/", (req, res) => {
  res.redirect("/"); // Redireccionamos cualquier dirección a nuestra ruta estática
});

// Conectamos a la base de datos
await dbconnection();

// Ejecutamos nuestras funciones de Scraping
await getall();
await getcountries();

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
      `${appHost}:${appPort}/${rutagql}`.white.bold
  );
  console.log(
    "*********************************************************************************"
      .rainbow
  );
});
