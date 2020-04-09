// Importamos las librerias
import axios from "axios";
import cheerio from "cheerio";

// Importamos los modelos
import Paises from "../database/models/paises";

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
  const url = "https://www.worldometers.info/coronavirus/";
  try {
    response = await axios.get(url);
    if (response.status !== 200) {
      console.error("Error", response.status);
    }
  } catch (err) {
    console.error("Falló URL ==> " + url);
    return null;
  }

  // almacenamos los datos analizados en result
  const result = {};

  // Obtenemos el HTML y analizamos las tasas de mortalidad
  const html = cheerio.load(response.data);
  const maincounter = html("div.maincounter-number span");
  await maincounter.filter((i, el) => {    
    let count = el.children[0].data || "0";
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
  const url = "https://www.worldometers.info/coronavirus/";
  try {
    response = await axios.get(url);
    if (response.status !== 200) {
      console.error("Error", response.status);
    }
  } catch (err) {
    console.error("Falló URL ==> " + url);
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
  const totalColumns = 13;
  const countryColIndex = 0;
  const casesColIndex = 1;
  const todayCasesColIndex = 2;
  const deathsColIndex = 3;
  const todayDeathsColIndex = 4;
  const curedColIndex = 5;
  const activeCasesColIndex = 6;
  const criticalColIndex = 7;

  // Omitimos la última columna de la tabla que viene a ser el total
  for (let i = totalColumns; i < countriesTableCells.length - totalColumns; i ++) {
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
}, 3000); // cada 1 minuto = 60 segundos = 60000 milisegundos

// Obtenemos los casos del Perú y Regiones (Gobierno)
export const getPeruRegionesGob = setInterval(async () => {
  let response;
  const url = "https://www.gob.pe/8662";
  try {
    response = await axios.get(url);
    if (response.status !== 200) {
      console.error("Error", response.status);
    }
  } catch (err) {
    console.error("Falló URL ==> " + url);
    return null;
  }

  // Obtenemos el HTML
  const html = cheerio.load(response.data);
  const section = html("section");
  const div = section.children("div");
  const divPeru = div[1].children[0];
  const casos = divPeru.children[0].children[1].children[0].data;
  const descartados = divPeru.children[1].children[1].children[0].data;
  const peru = await Paises.findOne({pais: "Peru"});
  const result = {
    casos_: peru.casos_ >= casos ? peru.casos_ : casos,
    casosDescartados: descartados
  };

  if (div[1].children[1]) {
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
        console.log("Actualizado casos de Perú y regiones (Gobierno)");
      } else {
        console.log("NO se pudo actualizar");
      }
    } else {
      console.log("NO se pudo actualizar");
    }
  } else {
    const isUpsert1 = await upsertPais("Peru", result);
    if (isUpsert1) {
      console.log("Actualizado casos de Perú y regiones (Gobierno)");
    } else {
      console.log("NO se pudo actualizar");
    }
  }
}, 60000); // cada 1 minuto = 60 segundos = 60000 milisegundos}

// Obtenemos los casos del Perú (La República)
export const getPeruRep = setInterval(async () => {
  let response;
  const url = "https://larepublica.pe/coronavirus-en-el-peru/";
  try {
    response = await axios.get(url);
    if (response.status !== 200) {
      console.error("Error", response.status);
    }
  } catch (err) {
    console.error("Falló URL ==> " + url);
    return null;
  }

  // Obtenemos el HTML
  const html = cheerio.load(response.data, { xmlMode: true });
  const div = html("body script:not([src])");
  const cadena = div[8].children[0].data;
  const cadena1 = cadena.split('{\\"source\\":\\"coronavirus\\"}":');
  const cadena2 = cadena1[1].split("}};")[0];
  const obj = await JSON.parse(cadena2);

  const peru = obj.data.data[1];

  const peruObj = peru[0];
  const infectados = parseInt(peruObj.infectados, 10);
  const fallecidos = parseInt(peruObj.fallecidos, 10);
  const curados = parseInt(peruObj.curados, 10);
  const casos = infectados;
  const muertes = fallecidos;
  const recuperados = curados;

  const peru_ = await Paises.findOne({ pais: "Peru" });

  const result = {
    casos_: peru_.casos_ >= casos ? peru_.casos_ : casos,
    muertes_: peru_.muertes_ >= muertes ? peru_.muertes_ : muertes,
    recuperados_:
      peru_.recuperados_ >= recuperados ? peru_.recuperados_ : recuperados
  };

  const isUpsert = await upsertPais("Peru", result);
  if (isUpsert) {
    console.log("Actualizado casos de Perú y regiones (Republica)");
  } else {
    console.log("NO se pudo actualizar");
  }
}, 60000); // cada 1 minuto = 60 segundos = 60000 milisegundos}

// Obtenemos los casos del Perú y Regiones (La República)
export const getPeruRegionesRep = setInterval(async () => {
  let response;
  const url =
    "https://content-sheets.googleapis.com/v4/spreadsheets/1rwL-7YO32y6Q1HKmpKPVslojSTjD29XhLOmKOPaMA7I/values/A31:E57?access_token=AIzaSyBX7qxcPfD6AFjCbEqvv8R7GLZ9HQ4j3lo&key=AIzaSyBX7qxcPfD6AFjCbEqvv8R7GLZ9HQ4j3lo";
  try {
    response = await axios.get(url);
    if (response.status !== 200) {
      console.error("Error", response.status);
    }
  } catch (err) {
    console.error("Falló URL ==> " + url);
    return null;
  }

  const values = response.data.values;

  // almacenamos los datos analizados en results
  const result = [];

  await values.map((ele, i) => {
    if (i === 0) {
      return;
    }
    if (i === values.length - 1) {
      return;
    }
    if (ele.length === 0 || ele.length === null) {
      return;
    }
    result.push({
      region: ele[0].trim(),
      casos: parseInt(ele[1], 10),
      muertes: parseInt(ele[2], 10)
    });
  });

  const isUpsert = await upsertRegiones(result);
  if (isUpsert) {
    console.log("Actualizado casos de Regiones del Perú (Republica)");
  } else {
    console.log("NO se pudo actualizar");
  }
}, 60000); // cada 1 minuto = 60 segundos = 60000 milisegundos}
