// Importamos el modelo de la Coleccion Ciudades
import Ciudades from "../../database/models/ciudades";
import { buildSortFromArg } from "@entria/graphql-mongo-helpers";

// Creamos los resolvers y exportamos
export default {
  Query: {
    getCiudad: async (_, { filter }) => {
      try {
        const ciudad = await Ciudades.findOne(filter);
        return ciudad;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    getCiudades: async (_, { sortby }) => {
      try {
        const ciudades = await Ciudades.find().sort(buildSortFromArg(sortby));
        return ciudades;
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  }
};
