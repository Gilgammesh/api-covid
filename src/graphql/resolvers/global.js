// Importamos el modelo de la Coleccion Global
import Global from "../../database/models/global";

// Creamos los resolvers y exportamos
export default {
  Query: {
    getGlobal: async (_, {}, { decode }) => {
      if (!decode) {
        throw new Error("Se necesita autorización");
      }
      try {
        const global = await Global.findOne();
        return global;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  },
};
