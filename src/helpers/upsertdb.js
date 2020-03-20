// Importamos la libreria de Translate de Google
import translate from "translate-google";
// Importamos los modelos
import Global from "../database/models/global";
import Paises from "../database/models/paises";
import Regiones from "../database/models/regiones";

export const upsertGlobal = async result => {
  try {
    const global = await Global.findOne();
    if (global) {
      await Global.findOneAndUpdate({}, { $set: result });
    } else {
      const newGlobal = new Global(result);
      await newGlobal.save();
    }
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const upsertPais = async (pais, result) => {
  try {
    await Paises.findOneAndUpdate({ country: pais }, { $set: result });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const upsertPaises = async results => {
  try {
    await results.forEach(async result => {
      const pais = await Paises.findOne({ country: result.country });
      if (pais) {
        await Paises.findOneAndUpdate(
          { country: result.country },
          { $set: result }
        );
      } else {
        // Convertirmos los nombres de Paises a Español
        translate(result.country, { to: "es" })
          .then(res => {
            result.pais = res;
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
      { country: result.name },
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

export const upsertRegiones = async results => {
  try {
    await results.forEach(async result => {
      const region = await Regiones.findOne({ region: result.region });
      if (region) {
        await Regiones.findOneAndUpdate(
          { region: result.region },
          { $set: result }
        );
      } else {
        const newRegion = new Regiones(result);
        await newRegion.save();
      }
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};
