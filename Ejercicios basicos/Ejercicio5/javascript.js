const bucleFor = document.getElementById("for");
const bucleWhile = document.getElementById("while");
const bucleDo = document.getElementById("do");

var numero = 10;
var i = 1;
var lineaFor = "";
var lineaWhile = "";
var lineaDo = "";

document.addEventListener("DOMContentLoaded", () => {

for (let index = 1; index <= numero; index++) {
    if(index != numero)
    {
        lineaFor += (index + ", ");
    }else
    {
        lineaFor += index;
    }
}

while (i <= numero) {
    if(i != numero)
        {
            lineaWhile += (i + ", ");
        }else
        {
            lineaWhile += i;
        }  
    i++
}

i = 1;

do {
    if(i != numero)
        {
            lineaDo += (i + ", ");
        }else
        {
            lineaDo += i;
        }  
    i++
} while (i<= numero);

bucleFor.textContent = `Bucle for "${lineaFor}"`;
bucleWhile.textContent = `Bucle while "${lineaWhile}"`;
bucleDo.textContent = `Bucle do "${lineaDo}"`;

})
