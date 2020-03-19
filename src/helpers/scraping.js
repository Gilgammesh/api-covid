// Importamos las librerias
import axios from "axios";
import cheerio from "cheerio";

// Importamos los helpers para insertar a la base de datos
import {
  upsertGlobal,
  upsertPaises,
  upsertPais,
  upsertRegiones
} from "./upsertdb";

/********************************************************************************/
/* Scraping con Cheerio */
/********************************************************************************/

// Obtenemos todos los casos
export const getall = setInterval(async () => {
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
  const isUpsert = await upsertGlobal(result);
  if (isUpsert) {
    console.log("Actualizado los casos globales");
  } else {
    console.log("NO se pudo actualizar");
  }
}, 60000); // cada 1 minuto = 60 segundos = 60000 milisegundos

// Obtenemos los datos de los paises
export const getcountries = setInterval(async () => {
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

  const countriesTable = html("table#main_table_countries_today");
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
      let country =
        cell.children[0].data || cell.children[0].children[0].data || "";
      country = country.trim();
      result.push({ country: country });
    }
    // Obtenemos los casos
    if (i % totalColumns === casesColIndex) {
      let cases;
      if (cell.children[0]) {
        cases = cell.children[0].data || "";
      } else {
        cases = "";
      }
      result[result.length - 1].casos = parseInt(
        cases.trim().replace(/,/g, "") || "0",
        10
      );
    }
    // Obtenemos los casos del día o nuevos casos
    if (i % totalColumns === todayCasesColIndex) {
      let cases;
      if (cell.children[0]) {
        cases = cell.children[0].data || "";
      } else {
        cases = "";
      }
      result[result.length - 1].casosHoy = parseInt(
        cases.trim().replace(/,/g, "") || "0",
        10
      );
    }
    // Obtenemos las muertes
    if (i % totalColumns === deathsColIndex) {
      let deaths;
      if (cell.children[0]) {
        deaths = cell.children[0].data || "";
      } else {
        deaths = "";
      }
      result[result.length - 1].muertes = parseInt(
        deaths.trim().replace(/,/g, "") || "0",
        10
      );
    }
    // Obtenemos las muertes del día
    if (i % totalColumns === todayDeathsColIndex) {
      let deaths;
      if (cell.children[0]) {
        deaths = cell.children[0].data || "";
      } else {
        deaths = "";
      }
      result[result.length - 1].muertesHoy = parseInt(
        deaths.trim().replace(/,/g, "") || "0",
        10
      );
    }
    // Obtenemos los recuperados
    if (i % totalColumns === curedColIndex) {
      let cured;
      if (cell.children[0]) {
        cured = cell.children[0].data || "";
      } else {
        cured = "";
      }
      result[result.length - 1].recuperados = parseInt(
        cured.trim().replace(/,/g, "") || 0,
        10
      );
    }
    // Obtenemos los casos activos
    if (i % totalColumns === activeCasesColIndex) {
      let actives;
      if (cell.children[0]) {
        actives = cell.children[0].data || "";
      } else {
        actives = "";
      }
      result[result.length - 1].casosActivos = parseInt(
        actives.trim().replace(/,/g, "") || 0,
        10
      );
    }
    // Obtenemos los críticos
    if (i % totalColumns === criticalColIndex) {
      let critical;
      if (cell.children[0]) {
        critical = cell.children[0].data || "";
      } else {
        critical = "";
      }
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

// Obtenemos los casos del Perú y Regiones
export const getRegiones = setInterval(async () => {
  let response;
  try {
    response = await axios.get("https://www.gob.pe/8662");
    if (response.status !== 200) {
      console.log("ERROR");
    }
  } catch (err) {
    console.error(err);
    return null;
  }

  // Obtenemos el HTML y analizamos las tasas de mortalidad
  const html = cheerio.load(response.data);
  const section = html("section");
  const div = section.children("div");
  const divPeru = div[1].children[0];
  const casos = divPeru.children[0].children[1].children[0].data;
  const descartados = divPeru.children[1].children[1].children[0].data;
  const result = {
    casos_: casos,
    casosDescartados: descartados
  };
  const divRegiones = div[1].children[1];
  // almacenamos los datos analizados en result
  const results = [];
  for (let i = 1; i < divRegiones.children.length; i++) {
    const cadena = divRegiones.children[i].children[0].children[0].data;
    const array = cadena.split(":");
    results.push({
      region: array[0].trim(),
      casos: parseInt(array[1].trim(), 10)
    });
  }
  const isUpsert1 = await upsertPais("Peru", result);
  if (isUpsert1) {
    const isUpsert2 = await upsertRegiones(results);
    if (isUpsert2) {
      console.log("Actualizado casos de Perú y regiones");
    } else {
      console.log("NO se pudo actualizar");
    }
  } else {
    console.log("NO se pudo actualizar");
  }
}, 60000); // cada 1 minuto = 60 segundos = 60000 milisegundos}
