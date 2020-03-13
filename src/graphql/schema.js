// Importamos las librerias de GraphQL
import { makeExecutableSchema, mergeSchemas } from "graphql-tools";
import { fileLoader, mergeTypes, mergeResolvers } from "merge-graphql-schemas";
// Libreria de path
import { join } from "path";

// TypeDefs
const arrayTypeDefs = fileLoader(join(__dirname, "./typeDefs"), {
  extensions: [".gql"]
});
const typeDefs = mergeTypes(arrayTypeDefs);

// Resolvers
const arrayResolvers = fileLoader(join(__dirname, "./resolvers"), {
  extensions: [".js"]
});
const resolvers = mergeResolvers(arrayResolvers);

// Creamos un Schema, le pasamos los typeDefs y los resolvers. Luego exportamos
export default new makeExecutableSchema({
  typeDefs: typeDefs,
  resolvers: resolvers
});
