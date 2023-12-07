#Caracteristicas

### Autenticacion con gmail:
La aplicacion se autentica a travez de auth2.0 en firebase haciendo uso del provedor de google, tambien verifica que el correo pertenezca al dominio de la institucion educativa en cuestion

![imagen](https://github.com/radras44/educational_administrator/assets/97988334/92ee5ef8-a093-4775-b779-8d7f45c69c04)

### Modelamiento de la base de datos

![diagrama entidad relacion LBA_plataform](https://github.com/radras44/educational_administrator/assets/97988334/cee2995c-6dd4-4750-9050-1962e40d9acd)

La aplicacion esta pensada para administrativos, no para estudiantes, por lo que se agrego la tabla estudiantes aparte y no como un rol, esta desicion tambien se tomo en base a la diferencia de columnas entre los estudiantes y los demas roles.

## Panel de Administracion:

![imagen](https://github.com/radras44/educational_administrator/assets/97988334/7354ec9f-c892-4e93-b5df-b428326ad648)

El panel cuanta con varias secciones, estas se renderizaran dependiendo de los permisos que tenga el usuario, esto tambien ocurre con el menu lateral

![imagen](https://github.com/radras44/educational_administrator/assets/97988334/e81ef54b-fdc0-4928-9f49-5b18f586b404)

### Filtros
Los filtros son componentes reutilizables, estos solicitaran cierta informacion que debe cumplir con ciertos tipos de datos especificos para poder utilizarse, algo similar pasa con la "ordenar por":

```javascript
   {
                        props.staticEntities.cursos &&
                            <FilterByCurso
                                cursos={props.staticEntities.cursos}
                                setFilters={setFilters}
                                filters={filters}
                            />
                    }
                    {
                        props.staticEntities.generos &&
                            <FilterByGenero
                                generos={props.staticEntities.generos}
                                setFilters={setFilters}
                                filters={filters}
                            />
                    }
                    <OrderBy
                        orders={orders}
                        setFilters={setFilters}
                        filters={filters}
                    />

```
![imagen](https://github.com/radras44/educational_administrator/assets/97988334/07adb96a-d3ec-4ae2-bd98-a68a93c17c6d)

## Sincronizacion
Para no tener que editar ni agregar estudiantes, la aplicacion cuenta con un sistema de sincronizacion manual, se debe seguir los siguientes pasos

- Descargar el excel con la nomina de matriculas desde la plataforma del SIGE
- Ir al panel de estudiantes y apretar el icono de sincronizacion
- importar el archivo excel descargado 
- Se le informara los cambios que se van a realizar y podra elegir cuales ejecutar

![imagen](https://github.com/radras44/educational_administrator/assets/97988334/21077f8a-de62-45c6-b774-4b0965b2cfaa)

# Instalacion
### cliente:
.env.local: "archivo que aloja las variables de entorno en el client con next"

la clave publica se puede obtener en la consola de firebase: https://firebase.google.com/?gad_source=1&gclid=EAIaIQobChMItpuFoKT8ggMVQyitBh11xg5pEAAYASAAEgJnhfD_BwE&gclsrc=aw.ds&hl=es-419

miproyecto => descripcion general(engranaje) => configuracion de proyecto


### servidor:
.env : "archivo que aloja las variables de entorno del servidor"
src/private/firebaseConfig.json : archivo que aloja clave privada de firebase

la clave privada se puede obtener en la consola de firebase:
miproyecto => descripcion general(engranaje) => configuracion del proyecto => cuentas de servicio => generar nueva clave privada

### Data de prueba
La aplicacion tiene la funcion de sincronizar manualmente con los estudiantes en el SIGE
-Si necesita data de prueba puede ver el archivo excel que esta en el directorio assets
