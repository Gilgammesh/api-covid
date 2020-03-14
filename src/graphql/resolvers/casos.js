// Importamos el modelo de la Coleccion Casos
import Casos from "../../database/models/casos";

// Creamos los resolvers y exportamos
export default {
  Query: {
    getGlobal: async () => {
      try {
        const global = await Casos.findOne();
        return global;
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  }
};
