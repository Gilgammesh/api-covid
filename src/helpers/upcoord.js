// Importamos la data json de las coordenadas (latitud y longitud)
import data from "./data.json";
// Importamos
import { upsertPaisesCoord } from "./upsertdb";

const updateCoord = () => {
  setInterval(async () => {
    await data.forEach(async result => {
      await upsertPaisesCoord(result);
    });

    console.log("Coordenadas actualizadas");
  }, 3600000); // cada 1 hora = cada 60 minutos = 36000 segundos = 3600000 milisegundos
};

export default updateCoord;
