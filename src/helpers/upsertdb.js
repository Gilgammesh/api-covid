// Importamos la libreria de Translate de Google
import translate from "translate-google";
// Importamos los modelos
import Casos from "../database/models/casos";
import Paises from "../database/models/paises";

export const upsertCasos = async result => {
  try {
    const casos = await Casos.findOne();
    if (casos) {
      await Casos.findOneAndUpdate({}, { $set: result });
    } else {
      const newCasos = new Casos(result);
      await newCasos.save();
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const upsertPaises = async results => {
  try {
    await results.forEach(async result => {
      const pais = await Paises.findOne({ pais: result.pais });
      if (pais) {
        await Paises.findOneAndUpdate({ pais: result.pais }, { $set: result });
      } else {
        // Convertirmos los nombres de Paises a Español
        translate(result.pais, { to: "es" })
          .then(res => {
            result.paisEs = res;
            const newPais = new Paises(result);
            newPais.save();
          })
          .catch(err => {
            console.error(err);
          });
      }
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const upsertPaisesCoord = async result => {
  try {
    await Paises.findOneAndUpdate(
      { pais: result.name },
      {
        $set: {
          bandera: result.country,
          latitud: result.latitude,
          longitud: result.longitude
        }
      }
    );
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
