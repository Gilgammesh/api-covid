// Importamos la data json de las coordenadas (latitud y longitud)
import data from "./data.json";
// Importamos 
import { upsertPaisesCoord } from "./upsertdb";

const parsecsv = async () => {
  await data.forEach(async result => {
    await upsertPaisesCoord(result);
  });
};

export default parsecsv;
