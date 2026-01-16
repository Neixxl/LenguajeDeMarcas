
// === BOTONES ===
const CE = document.getElementById("CE");
const C = document.getElementById("C");
const DEL = document.getElementById("DEL");
const div = document.getElementById("div");
const mult = document.getElementById("mult");
const resta = document.getElementById("resta");
const suma = document.getElementById("suma");
const uno = document.getElementById("uno");
const dos = document.getElementById("dos");
const tres = document.getElementById("tres");
const cuatro = document.getElementById("cuatro");
const cinco = document.getElementById("cinco");
const seis = document.getElementById("seis");
const siete = document.getElementById("siete");
const ocho = document.getElementById("ocho");
const nueve = document.getElementById("nueve");
const cero = document.getElementById("cero");
const igual = document.getElementById("igual");
const punto = document.getElementById("punto");
const resultado = document.getElementById("resultado");

// === PANTALLA ===
const pantalla = document.getElementById("pantalla");
let text = pantalla.innerText



document.addEventListener("DOMContentLoaded", () => {

if(DEL){DEL.addEventListener("click", () => {pantalla.textContent.charAt(0) = "0";});}
if(CE){CE.addEventListener("click", () => {pantalla.textContent = "";});}    
if(uno){uno.addEventListener("click", () => {pantalla.textContent += "1";});}
if(dos){dos.addEventListener("click", () => {pantalla.textContent += "2";});}
if(tres){tres.addEventListener("click", () => {pantalla.textContent += "3";});} 
if(cuatro){cuatro.addEventListener("click", () => {pantalla.textContent += "4";});}
if(cinco){cinco.addEventListener("click", () => {pantalla.textContent += "5";});}
if(seis){seis.addEventListener("click", () => {pantalla.textContent += "6";});}
if(siete){siete.addEventListener("click", () => {pantalla.textContent += "7";});}
if(ocho){ocho.addEventListener("click", () => {pantalla.textContent += "8";});}
if(nueve){nueve.addEventListener("click", () => {pantalla.textContent += "9";});}
if(cero){cero.addEventListener("click", () => {pantalla.textContent += "0";});}

});
