# API - Coronavirus Información

![coronavirus](https://github.com/Gilgammesh/api-covid/blob/master/public/img/bg.jpg)

Una Api sencilla, para obtener los casos de coronavirus haciendo un scraping a la web oficial "https://www.worldometers.info/coronavirus/"

## Tecnologías

- Nodejs + Express
- Mongodb + Mongoose
- Graphql + Apollo
- Cheerio

## Cómo empezar

**Clonamos el proyecto en nuestra máquina local**

```sh
$ git clone https://github.com/Gilgammesh/api-covid.git
```

**Entramos a la carpeta**

```sh
$ cd api-covid
```

**Instalamos las dependencias**

```sh
$ npm install
```

**Instalamos las dependencias de desarrollo**

```sh
$ npm install -D
```

**Inicializamos el Proyecto**

```sh
$ npm run dev
```

**Esto arrancara el proyecto en:**  
http://localhost:4000/graphql

## Realizando las consultas

**Ingresamos a http://localhost:4000/graphql**
Y usamos el Playground de Apollo para realizar las consultas

<table>
<tr>
<td> Descripción </td> <td> Query </td> <td> Respuesta </td>
</tr>
<tr>
<td> Obtener todos los casos globales </td>
<td>
```javascript
query {
  getGlobal {
    casos
    muertes
    recuperados
  }
}
```
</td>
<td>
```javascript
{
  "data": {
    "getGlobal": {
      "casos": 155812,
      "muertes": 5814,
      "recuperados": 74268
    }
  }
}
```
</td>
</tr>
<tr>
<td> Obtener los casos de todos los Paises </td>
<td>
```javascript
query {
  getPaises(sortby: [{ field: "pais", direction: ASC }]) {
    pais
    casos
    casosHoy
    muertes
    muertesHoy
    recuperados
    casosActivos
    casosCriticos
  }
}
```
</td>
<td>
```javascript
{
  "data": {
    "getPaises": [
      {
        "pais": "Afganistán",
        "casos": 11,
        "casosHoy": 4,
        "muertes": 0,
        "muertesHoy": 0,
        "recuperados": 0,
        "casosActivos": 11,
        "casosCriticos": 0
      },
      {
        "pais": "Albania",
        "casos": 38,
        "casosHoy": 5,
        "muertes": 1,
        "muertesHoy": 0,
        "recuperados": 0,
        "casosActivos": 37,
        "casosCriticos": 2
      },
      ........
    ]
  }
}
```
</td>
</tr>
<tr>
<td> Obtener los casos de un País </td>
<td>
```javascript
query {
  getPais(filter: { pais: "Peru" }) {
    pais
    casos
    casosHoy
    muertes
    muertesHoy
    recuperados
    casosActivos
    casosCriticos
  }
}
```
</td>
<td>
```javascript
{
  "data": {
    "getPais": {
      "pais": "Peru",
      "casos": 38,
      "casosHoy": 0,
      "muertes": 0,
      "muertesHoy": 0,
      "recuperados": 0,
      "casosActivos": 38,
      "casosCriticos": 0
    }
  }
}
```
</td>
</tr>
</table>

## Producción

** Visitános en nuestra web oficial **
https://covid.santandertech.com

## Autor

- Nombre : Carlos Santander
- Empresa : SANTANDERTECH SAC
- Correo : santandertechsac@gmail.com
- Web : https://www.santandertech.com

![autor](https://github.com/Gilgammesh/api-covid/blob/master/public/img/autor.jpg)
