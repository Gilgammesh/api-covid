// Importamos el modelo de la Coleccion Global
import Global from "../../database/models/global";

// Creamos los resolvers y exportamos
export default {
  Query: {
    getGlobal: async () => {
      try {
        const global = await Global.findOne();
        return global;
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  }
};
