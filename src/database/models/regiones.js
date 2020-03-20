// Importamos la librería de mongoose
import { Schema, model } from "mongoose";

// Creamos el Schema
const schema = new Schema(
  {
    region: String,
    casos: Number,
    muertes: Number,
    recuperados: Number,
    latitud: Number,
    longitud: Number
  },
  {
    collection: "regiones",
    timestamps: true
  }
);

// Exportamos el modelo y pasamos el schema
export default model("regiones", schema);
