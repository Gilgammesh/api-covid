// Importamos el modelo de la Coleccion Paises
import Paises from "../../database/models/paises";

// Creamos los resolvers y exportamos
export default {
  Query: {
    getPais: async (_, { nombre }) => {
      try {
        const pais = await Paises.findOne({ paisEs: nombre });
        return pais;
      } catch (error) {
        console.log(error);
        return null;
      }
    },
    getPaises: async () => {
      try {
        const paises = await Paises.find();
        return paises;
      } catch (error) {
        console.log(error);
        return null;
      }
    }
  }
};
