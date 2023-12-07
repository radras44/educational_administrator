#Características

## Autenticación con gmail:
La aplicación se autentica a través de auth2.0 en firebase haciendo uso del proveedor de google, también verifica que el correo pertenezca al dominio de la institución educativa en cuestión

![imagen](https://github.com/radras44/educational_administrator/assets/97988334/92ee5ef8-a093-4775-b779-8d7f45c69c04)

## Modelamiento de la base de datos

La aplicación está pensada para administrativos, no para estudiantes, por lo que se agregó la tabla estudiantes aparte y no como un rol, esta decisión también se tomó en base a la diferencia de columnas entre los estudiantes y los demás roles.

![diagrama entidad relacion LBA_plataform](https://github.com/radras44/educational_administrator/assets/97988334/cee2995c-6dd4-4750-9050-1962e40d9acd)

## Panel de Administración:

![imagen](https://github.com/radras44/educational_administrator/assets/97988334/7354ec9f-c892-4e93-b5df-b428326ad648)

El panel cuanta, con varias secciones, estas se renderizaran dependiendo de los permisos que tenga el usuario, esto también ocurre con el menú lateral

![imagen](https://github.com/radras44/educational_administrator/assets/97988334/e81ef54b-fdc0-4928-9f49-5b18f586b404)

## Filtros
Los filtros son componentes reutilizables, estos solicitaran cierta información que debe cumplir con ciertos tipos de datos específicos para poder utilizarse, algo similar pasa con la "ordenar por":

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
![imagen](https://github.com/radras44/educational_administrator/assets/97988334/7d3607b7-5050-4f0d-be17-7319acf44c9b)

## Tablas
Las tablas también son componentes reutilizables en los que se deben definir acciones y campos en forma de arrays:
```javascript
{
                roles && roles.length > 0 &&
                    <PanelPage.Table
                        data={roles}
                        options={[
                            { icon: <Edit />, action: editRole },
                            { icon: <Delete />, action: deleteRole }
                        ]}
                        keysToShow={["id", "rol","nivel"]}
                        keyLabels={["id", "rol","nivel"]}
                    /> 
            }
```
![imagen](https://github.com/radras44/educational_administrator/assets/97988334/f4f90952-efc9-46ea-9633-09d89ff5603b)

## Modals
La aplicación se basa en modals/menus emergentes, tanto para la edición, creación y demás formularios, aquí unos ejemplos de esto:
![imagen](https://github.com/radras44/educational_administrator/assets/97988334/edebef91-ca49-4dff-a70f-8f7a3d9be711)
![imagen](https://github.com/radras44/educational_administrator/assets/97988334/4ac556f9-948a-4bac-ad71-d4011d7f533e)
![imagen](https://github.com/radras44/educational_administrator/assets/97988334/46f29926-01e9-4e43-a462-95bc5ad48f1d)


## Sincronización e importación de estudiantes
Para no tener que editar ni agregar estudiantes, la aplicación cuenta con un sistema de sincronización manual, se debe seguir los siguientes pasos

- Descargar el Excel con la nómina de matrículas desde la plataforma del SIGE
- Ir al panel de estudiantes y apretar el icono de sincronización
- importar el archivo Excel descargado 
- Se le informara los cambios que se van a realizar y podrá elegir cuales ejecutar
- En caso de que falle, se hará un backroll y se enviara un error

![imagen](https://github.com/radras44/educational_administrator/assets/97988334/b93033d0-a452-4aa8-8b3c-e281cbb99fb0)

## Libreta de notas

Para ingresar notas se hace a través de la evaluación que corresponde a una clase y curso específicos, se hará una petición solicitando información de las notas asociadas con esa evaluación, estas notas estarán a su vez relacionadas con un alumno especifico, por defecto cada vez que se cree una nueva evaluación, se crearán las nota con valor nulo para todos los alumnos en la clase correspondiente a la evaluación.

![imagen](https://github.com/radras44/educational_administrator/assets/97988334/e126fe73-6581-499e-807e-05c8cf1d9c88)


## Diseño responsivo

![imagen](https://github.com/radras44/educational_administrator/assets/97988334/d1c8bb78-4219-4246-b8f8-5a5217488602)
![imagen](https://github.com/radras44/educational_administrator/assets/97988334/b6197807-e298-4f2e-a979-aefceaac7253)

# Instalacion
### cliente:
.env.local: "archivo que aloja las variables de entorno en el client con next"

la clave pública se puede obtener en la consola de firebase: https://firebase.google.com/?gad_source=1&gclid=EAIaIQobChMItpuFoKT8ggMVQyitBh11xg5pEAAYASAAEgJnhfD_BwE&gclsrc=aw.ds&hl=es-419

mi proyecto => descripción general(engranaje) => configuración de proyecto


### servidor:
.env : "archivo que aloja las variables de entorno del servidor"
src/private/firebaseConfig.json : archivo que aloja clave privada de firebase

la clave privada se puede obtener en la consola de firebase:
mi proyecto => descripción general(engranaje) => configuración del proyecto => cuentas de servicio => generar nueva clave privada

### Data de prueba
La aplicación tiene la función de sincronizar manualmente con los estudiantes en el SIGE
-Si necesita data de prueba puede ver el archivo Excel que está en el directorio assets

