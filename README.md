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

+----------------------------------+
| Descripción                      |  
+----------------------------------+
| Obtener todos los casos globales |  
+----------------------------------+--



Obtener todos los casos globales
```javascript
query {
  getGlobal {
    casos
    muertes
    recuperados
  }
}
```


## Autor

* Nombre  :   Carlos Santander
* Empresa :   SANTANDERTECH SAC
* Correo  :   santandertechsac@gmail.com
* Web     :   http://www.santandertech.com

![autor](https://github.com/Gilgammesh/api-covid/blob/master/public/img/autor.jpg)