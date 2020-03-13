// Importamos la librería de mongoose
import { Schema, model } from "mongoose";

// Creamos el Schema
const schema = new Schema(
  {
    pais: String,
    paisEs: String,
    casos: Number,
    casosHoy: Number,
    muertes: Number,
    muertesHoy: Number,
    recuperados: Number,
    casosActivos: Number,
    casosCriticos: Number
  },
  {
    collection: "paises",
    timestamps: true
  }
);

// Exportamos el modelo y pasamos el schema
export default model("paises", schema);
