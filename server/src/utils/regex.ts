//expresiones regulares para la validacion de datos

const emailDom = /@(bicentenarioancud\.cl|alumnos\.bicentenarioancud\.cl)$/;
const studentEmail = /@alumnos\.bicentenarioancud\.cl$/;
const userEmail = /@bicentenarioancud\.cl$/;
const endWithVocal = /[aeiou]$/i
const rut = /^\d{7,9}-[\dkK]$/
const nombre = /^[\p{L}\s]+$/u;
const username = /^[^\W_]+$/i
export default {
    rut : rut,
    emailDom : emailDom,
    studentEmail : studentEmail,
    userEmail : userEmail,
    endWithVocal : endWithVocal,
    nombre,
    username : username
}