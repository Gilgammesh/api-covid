// Importando librerias de mongoose
import mongoose from "mongoose";

// Creamos la conexión a la base de datos
const connection = async () => {
  // Variables de la conexión a la base de datos
  const host = process.env.APP_DB_COVID_HOST || "localhost";
  const port = 27017;
  const driver = process.env.APP_DB_COVID_DRIVER || "mongodb";
  const db = process.env.APP_DB_COVID_NAME || "covid";
  const opt = "retryWrites=true&w=majority";
  const user = process.env.APP_DB_COVID_USER || "";
  const pass = process.env.APP_DB_COVID_PASS || "";
  const uri = `${driver}://${host}:${port}/${db}?${opt}`;

  // Creamos las opciones
  const options = {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    user: user,
    pass: pass
  };

  // nos conectamos a la BD y pasamos la uri y las opciones
  try {
    await mongoose.connect(uri, options);
    console.log("Conexión a MongoDb exitosa!!".blue.bold);
  } catch (error) {
    console.error(error);
  }
};

// Exportamos la conexión
export default connection;
