// Importamos las librerias
import axios from "axios";
import cheerio from "cheerio";

// Importamos los helpers para insertar a la base de datos
import { upsertCasos, upsertPaises, upsertCiudades } from "./upsertdb";
import { addSchemaLevelResolveFunction } from "graphql-tools";

/********************************************************************************/
/* Scraping con Cheerio */
/********************************************************************************/

// Obtenemos todos los casos
const getall = setInterval(async () => {
  let response;
  try {
    response = await axios.get("https://www.worldometers.info/coronavirus/");
    if (response.status !== 200) {
      console.log("ERROR");
    }
  } catch (err) {
    return null;
  }

  // almacenamos los datos analizados en result
  const result = {};

  // Obtenemos el HTML y analizamos las tasas de mortalidad
  const html = cheerio.load(response.data);
  html(".maincounter-number").filter((i, el) => {
    let count = el.children[0].next.children[0].data || "0";
    count = parseInt(count.replace(/,/g, "") || "0", 10);
    if (i === 0) {
      result.casos = count;
    } else if (i === 1) {
      result.muertes = count;
      0;
    } else {
      result.recuperados = count;
    }
  });
  const isUpsert = await upsertCasos(result);
  if (isUpsert) {
    console.log("Actualizado los casos globales");
  } else {
    console.log("NO se pudo actualizar");
  }
}, 120000); // cada 2 minutos = 1200 segundos = 120000 milisegundos

// Obtenemos los datos de los paises
const getcountries = setInterval(async () => {
  let response;
  try {
    response = await axios.get("https://www.worldometers.info/coronavirus/");
    if (response.status !== 200) {
      console.log("Error", response.status);
    }
  } catch (err) {
    return null;
  }

  // almacenamos los datos analizados en result
  const result = [];

  // Obtenemos el HTML y analizamos las tasas de mortalidad
  const html = cheerio.load(response.data);
  const countriesTable = html("table#main_table_countries");
  const countriesTableCells = countriesTable
    .children("tbody")
    .children("tr")
    .children("td");

  // Este formato dependera de las columnas de la tabla del sitio web
  const totalColumns = 9;
  const countryColIndex = 0;
  const casesColIndex = 1;
  const todayCasesColIndex = 2;
  const deathsColIndex = 3;
  const todayDeathsColIndex = 4;
  const curedColIndex = 5;
  const activeCasesColIndex = 6;
  const criticalColIndex = 7;

  // Omitimos la última columna de la tabla que viene a ser el total
  for (let i = 0; i < countriesTableCells.length - totalColumns; i += 1) {
    const cell = countriesTableCells[i];

    // Obtenemos País
    if (i % totalColumns === countryColIndex) {
      let country;
      if (cell.children[0].data.trim() === "") {
        country = cell.children[1].children[0].data;
      } else {
        country = cell.children[0].data;
      }
      country = country.trim();
      result.push({ country: country });
    }
    // Obtenemos los casos
    if (i % totalColumns === casesColIndex) {
      let cases = cell.children[0].data || "";
      result[result.length - 1].casos = parseInt(
        cases.trim().replace(/,/g, "") || "0",
        10
      );
    }
    // Obtenemos los casos del día o nuevos casos
    if (i % totalColumns === todayCasesColIndex) {
      let cases = cell.children[0].data || "";
      result[result.length - 1].casosHoy = parseInt(
        cases.trim().replace(/,/g, "") || "0",
        10
      );
    }
    // Obtenemos las muertes
    if (i % totalColumns === deathsColIndex) {
      let deaths = cell.children[0].data || "";
      result[result.length - 1].muertes = parseInt(
        deaths.trim().replace(/,/g, "") || "0",
        10
      );
    }
    // Obtenemos las muertes del día
    if (i % totalColumns === todayDeathsColIndex) {
      let deaths = cell.children[0].data || "";
      result[result.length - 1].muertesHoy = parseInt(
        deaths.trim().replace(/,/g, "") || "0",
        10
      );
    }
    // Obtenemos los recuperados
    if (i % totalColumns === curedColIndex) {
      let cured = cell.children[0].data || "";
      result[result.length - 1].recuperados = parseInt(
        cured.trim().replace(/,/g, "") || 0,
        10
      );
    }
    // Obtenemos los casos activos
    if (i % totalColumns === activeCasesColIndex) {
      let actives = cell.children[0].data || "";
      result[result.length - 1].casosActivos = parseInt(
        actives.trim().replace(/,/g, "") || 0,
        10
      );
    }
    // Obtenemos los críticos
    if (i % totalColumns === criticalColIndex) {
      let critical = cell.children[0].data || "";
      result[result.length - 1].casosCriticos = parseInt(
        critical.trim().replace(/,/g, "") || "0",
        10
      );
    }
  }
  const isUpsert = await upsertPaises(result);
  if (isUpsert) {
    console.log("Actualizado los casos de los paises");
  } else {
    console.log("NO se pudo actualizar");
  }
}, 60000); // cada 1 minuto = 60 segundos = 60000 milisegundos

// Obtenemos todos los casos de Perú
const getPeru = setInterval(async () => {
  let response;
  try {
    response = await axios.get(
      "https://erianvc.github.io/API/COVID-Peru/data/localCases.json"
    );
    if (response.status !== 200) {
      console.log("ERROR");
    }
  } catch (err) {
    console.error(err);
    return null;
  }
  // almacenamos los datos analizados en result
  const result = response.data.details;

  const isUpsert = await upsertCiudades(result);
  if (isUpsert) {
    console.log("Actualizado las ciudades");
  } else {
    console.log("NO se pudo actualizar");
  }
}, 60000); // cada 1 minuto = 60 segundos = 60000 milisegundos

module.exports = {
  //getall,
  //getcountries,
  getPeru
};
