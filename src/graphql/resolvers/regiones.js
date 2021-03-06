// Importamos el modelo de la Coleccion Peru
import Regiones from "../../database/models/regiones";
import { buildSortFromArg } from "@entria/graphql-mongo-helpers";

// Creamos los resolvers y exportamos
export default {
  Query: {
    getRegion: async (_, { filter }, { decode }) => {
      if (!decode) {
        throw new Error("Se necesita autorización");
      }
      try {
        const region = await Regiones.findOne(filter);
        return region;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    getRegiones: async (_, { sortby }, { decode }) => {
      if (!decode) {
        throw new Error("Se necesita autorización");
      }
      try {
        const regiones = await Regiones.find({ casos: { $gt: 0 } }).sort(
          buildSortFromArg(sortby)
        );
        return regiones;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
    getRegiones_: async (_, { sortby }, { decode }) => {
      if (!decode) {
        throw new Error("Se necesita autorización");
      }
      try {
        const regiones = await Regiones.find({ casos: { $eq: 0 } }).sort(
          buildSortFromArg(sortby)
        );
        return regiones;
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  },
};
