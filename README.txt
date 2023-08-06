Archivos a configurar para poder usar las apps:

--------------------------------------------------------//
client:
.env.local: "archivo que aloja las variables de entorno en el client con next"

la clave publica se puede obtener en la consola de firebase:
miproyecto => descripcion general(engranaje) => configuracion de proyecto

--------------------------------------------------------//
servidor:
.env : "archivo que aloja las variables de entorno del servidor"
src/private/firebaseConfig.json : archivo que aloja clave privada de firebase

la clave privada se puede obtener en la consola de firebase:
miproyecto => descripcion general(engranaje) => configuracion del proyecto => cuentas de servicio => generar nueva clave privada


La aplicacion tiene la funcion de sincronizar manualmente con los estudiantes en el SIGE
por lo que si necesita data de prueba puede descargar el excel que provee el sigue con todos los estudiante
cambiar el formato a xlsx y sincronizarlo o exportarlos, ahi sale para marcar las acciones que desea realizar
en caso contrario, puede usar el archivo sql adjunto en el repositorio

NOTAS:
Falta agregar el distinguir entre clases que son electivas, esta el atributo, pero esto depende mucho de la institucion por lo que no lo he hecho, la idea seria agregar un atributo manytomany llamado Electivos en la tabla estudiantes
luego al solicitar los alumnos acordes a una evaluacion verificar si la clase es electiva o no, en caso de serlo buscar si el id de la evaluacion si encuentra dentro de "electivos" en cada estudiante

obtener alumnos de curso => filtrar en caso de la evaluacion ser de una clase electiva => el resto
obviamente hay otros enfoques para esto, como hacer que cada alumno tenga que inscribirse en cada clase