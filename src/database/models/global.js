// Importamos la librería de mongoose
import { Schema, model } from "mongoose";

// Creamos el Schema
const schema = new Schema(
  {
    casos: Number,
    muertes: Number,
    recuperados: Number
  },
  {
    collection: "global",
    timestamps: true
  }
);

// Exportamos el modelo y pasamos el schema
export default model("global", schema);
