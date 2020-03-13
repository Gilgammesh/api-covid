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
    console.log(error);
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
        const newPais = new Paises(result);
        await newPais.save();
      }
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};
