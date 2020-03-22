// Importamos la librería de mongoose
import { Schema, model } from "mongoose";

// Creamos el Schema
const schema = new Schema(
  {
    country: String,   
    pais: String, 
    casos: Number,
    casos_: Number,
    casosHoy: Number,
    muertes: Number,
    muertes_: Number,
    muertesHoy: Number,
    recuperados: Number,
    recuperados_: Number,
    casosActivos: Number,
    casosCriticos: Number,
    casosDescartados: Number,    
    bandera: String,
    latitud: Number,
    longitud: Number,
    poligono: [[[Number, Number]]]
  },
  {
    collection: "paises",
    timestamps: true
  }
);

// Exportamos el modelo y pasamos el schema
export default model("paises", schema);
