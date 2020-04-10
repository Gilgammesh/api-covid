// Importamos el modelo de la Coleccion Paises
import Paises from "../../database/models/paises";
import { buildSortFromArg } from "@entria/graphql-mongo-helpers";

// Creamos los resolvers y exportamos
export default {
  Query: {
    getPais: async (_, { filter }, { decode }) => {
      if (!decode) {
        throw new Error("Se necesita autorización");
      }
      try {
        const pais = await Paises.findOne(filter);
        return pais;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    getPaises: async (_, { sortby }, { decode }) => {
      if (!decode) {
        throw new Error("Se necesita autorización");
      }
      try {
        const paises = await Paises.find().sort(buildSortFromArg(sortby));
        return paises;
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  }
};
