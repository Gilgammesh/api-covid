// Importamos la librería de mongoose
import { Schema, model } from "mongoose";

// Creamos el Schema
const schema = new Schema(
  {
    ciudad: String,    
    casos: Number,
    latitud: Number,
    longitud: Number
  },
  {
    collection: "ciudades",
    timestamps: true
  }
);

// Exportamos el modelo y pasamos el schema
export default model("ciudades", schema);
