// constantes y variables globales

const contenedor = document.getElementById('contenedor');
const mensaje = document.getElementById('mensaje');

let cartas = [];
let cartasgiradas = [];
let puedegirar = true;
let juegoIniciado = false;

let numeros;
var segundos;

// Según la dificultad elegida dse aplica un array diferente con una longitud de numeros, tiempo y distribucion de las cartas distinta
function establecerDificultad(difficulty) {
  let cartasporfila, cartasporcolumna;

  if (difficulty === 'bajo') {
    numeros = ['1', '2', '3', '4', '5', '6', '7', '8'];
    cartasporfila = 4;
    cartasporcolumna = 4;
    segundos = 15;
  } else if (difficulty === 'medio') {
    numeros = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18'];
    cartasporfila = 6;
    cartasporcolumna = 6;
    segundos = 40;
  } else if (difficulty === 'alto') {
    numeros = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32'];
    cartasporfila = 8;
    cartasporcolumna = 8;
    segundos = 120;
  }

  inicializar(cartasporfila, cartasporcolumna);
}

// 
function inicializar(cartasporfila, cartasporcolumna) {
  var elementoFrases = document.getElementsByClassName('frases')[0];

  if (elementoFrases) {
    elementoFrases.style.display = 'none';
  }

// hacemos que desaparezcan los elementos de la pantalla de inicio
  document.getElementById('mensaje').style.display = 'none';
  document.getElementById('seleccionarDificultad').style.display = 'none';
  document.getElementById('botontexto').style.display = 'none';
  document.getElementById('texto').style.display = 'none';
  document.querySelector('h1').style.display = 'none';
  // document.body.style.backgroundImage = 'url("aa.jpg")';  // Me planteé la opción de cambiarle el fondo cuando comenzara el juego pero no me convencía el resultado.


  
//  Mostramos una cuenta atrás 3, 2, 1...
  mostrarCuentaRegresiva().then(() => {
    contenedor.style.display = 'grid';
    contenedor.style.gridTemplateColumns = `repeat(${cartasporfila}, 1fr)`;
    contenedor.style.gridTemplateRows = `repeat(${cartasporcolumna}, 1fr)`;
    contenedor.style.gridGap = '10px'; // Ajusta el espacio entre las celdas del grid

    barajarcartas(); // Baraja y mezcla las cartas para que salgan cada vez en una posición diferente
    mostrarmensaje('Encuentra todos los pares de tarjetas.');
  });
}

//////////////////////////////////////////////////////////// -PROMESA- //////////////////////////////////////////////////////////////////////
                                                  // SetInterval y clearInterval
function mostrarCuentaRegresiva() {
  // Crear una promesa que se resolverá cuando la cuenta regresiva haya terminado
  return new Promise((resolve) => {
    // Inicializar el contador en 2 porque en el mensaje inicial ya tenemos el 3
    let contador = 2;

    const cuentaRegresivaElemento = document.getElementById("cuentaRegresiva");

    cuentaRegresivaElemento.style.display = "block";
    cuentaRegresivaElemento.innerHTML = `Comenzando en 3`;    //contenido inicial

    // Establecer un intervalo que se ejecuta cada segundo
    const intervalo = setInterval(() => {
      // Actualizar el contenido con el valor actual del contador
      cuentaRegresivaElemento.innerHTML = `Comenzando en ${contador}`;
      contador--;

      // Verificar si el contador es menor que 0
      if (contador < 0) {
        // Limpiar el intervalo y ocultar el elemento
        clearInterval(intervalo);
        cuentaRegresivaElemento.innerHTML = "";
        cuentaRegresivaElemento.style.display = "none";
        // Resolver la promesa
        resolve();
      }
    }, 1000); // El intervalo se ejecuta cada 1000 milisegundos (1 segundo)
  });
}




// Para que las cartas salgan cada vez en orden distinto
function barajarcartas() {
  document.getElementById('mensaje').style.display = 'block';
  document.getElementById('cuentaclicks').style.display = 'block';

  // Crear una copia de las cartas duplicadas. Tenemos un array con los simbolos duplicados
  const todascartas = numeros.concat(numeros); //numeros.concat(numeros.slice())  --> otra opción

  // Barajar las cartas
  for (let i = 0; i < todascartas.length; i++) {
    const randomIndex = Math.floor(Math.random() * todascartas.length);
    // Intercambiar elementos usando una variable temporal
    const aux = todascartas[i];
    todascartas[i] = todascartas[randomIndex];
    todascartas[randomIndex] = aux;
  }

  // Asignar el array barajado a la variable cartas
  cartas = todascartas;
  devolvercartas();
  juegoIniciado = true;

// Contador del contador de clicks del componente web 
  const contador = document.querySelector('num-counter-1');
  contador.setVisibility(true);
}



// creamos los divs de las cartas y los posicionamos
function devolvercartas() {
  contenedor.innerHTML = '';

  for (let x = 0; x < cartas.length; x++) {
    const num = cartas[x];

    const card = document.createElement('div');
    card.classList.add('card'); // le añadimos una clase
    card.textContent = num;
    card.setAttribute('data-index', x);
    card.addEventListener('click', girarcarta);

    contenedor.appendChild(card);
  }
  ajustarMargenes();

  iniciarCuentaAtras(segundos)
  .then((mensaje) => {

    mostrarmensaje(mensaje);

  })
  .catch((error) => {

    mostrarmensaje(error);
    
  });


}




//////////////////////////////////////////////////////////// -PROMESA- //////////////////////////////////////////////////////////////////////
                                                  // SetInterval y clearInterval
function iniciarCuentaAtras(tiempo) {
return new Promise((resolve, reject) => {
let tiempoRestante = tiempo;

const cuentaRegresivaElemento = document.getElementById("cuentaRegresiva2");

cuentaRegresivaElemento.style.display = "block";
cuentaRegresivaElemento.innerHTML = `Tiempo restante: ${tiempoRestante} segundos`;

const intervalo = setInterval(() => {
tiempoRestante--;

if (tiempoRestante >= 0 && !bandera) {
cuentaRegresivaElemento.innerHTML = `Tiempo restante: ${tiempoRestante} segundos`;
} else {
clearInterval(intervalo);

if (!bandera) {
// cuentaRegresivaElemento.innerHTML = "¡Tiempo agotado!";
finalizarJuego();
// Rechaza la promesa con un mensaje de tiempo agotado
reject("¡Tiempo agotado!");
} else {
// Resuelve la promesa si la bandera es verdadera
resolve("¡Enhorabuena, has ganado!");
}
}
}, 1000);
});
}
                                                  
// Desaparece las cartas
function ajustarMargenes() {
  const tarjetas = document.querySelectorAll('.card');
  tarjetas.forEach((tarjeta, index) => {
    if (cartasgiradas.includes(index)) {
      tarjeta.classList.add('hidden');
    }
  });
}

// Función para girar una tarjeta
function girarcarta(event) {
  // Verificar si se puede girar una tarjeta
  if (!puedegirar) {
    return; // Si no se puede, salir de la función
  }

  // Obtener la tarjeta clicada
  const clickedCard = event.target;

  // Obtener el índice de la tarjeta clicada
  const index = parseInt(clickedCard.getAttribute('data-index'));

  // Evitar hacer clic en tarjetas ya giradas
  if (cartasgiradas.includes(index)) {
    return; // Si la tarjeta ya está volteada, salir de la función
  }

  // Ocultar visualmente la tarjeta clicada
  clickedCard.classList.add('hidden');

  // Registrar la tarjeta como volteada
  cartasgiradas.push(index);

  // Verificar si se han volteado dos tarjetas
  if (cartasgiradas.length === 2) {
    puedegirar = false; // Desactivar la capacidad de voltear temporalmente
    comprobariguales();
  }
}



let c = 0;
var bandera = false;
function comprobariguales() {
  const indice1 = cartasgiradas[0];
  const indice2 = cartasgiradas[1];
  const carta1 = document.querySelector('.card[data-index="' + indice1 + '"]');
  const carta2 = document.querySelector('.card[data-index="' + indice2 + '"]');

  if (cartas[indice1] === cartas[indice2]) {
    // si las cartas coinciden vaciamos el array.
    cartasgiradas = [];
    c++;
  } else {
    // si no coinciden
    carta1.classList.remove('hidden');
    carta2.classList.remove('hidden');
    cartasgiradas = [];
  }


  puedegirar = true;

  if (c == cartas.length/2) {
    contenedor.style.display = 'none';
    bandera = true;
    juegoIniciado = false;

    comprobarnumeroclicks();
    const contador = document.querySelector('num-counter-1');
    contador.setVisibility(false);
    document.getElementById("botonreinicio").style.display = 'block';
    document.getElementById("botonreinicio").addEventListener("click", reiniciarJuego);
  }
}


function mostrarmensaje(text) {
  mensaje.textContent = text;
}

function mostrarOcultarTexto() {
  var textoElemento = document.getElementById('texto');
  textoElemento.style.display = (textoElemento.style.display === 'none') ? 'block' : 'none';
}



function finalizarJuego() {

  juegoIniciado = false;
  const contador = document.querySelector('num-counter-1');

  contador.setVisibility(false);
  comprobarnumeroclicks();
  document.getElementById('contenedor').style.display = 'none';
  document.getElementById("botonreinicio").style.display = 'block';
  document.getElementById("botonreinicio").addEventListener("click", reiniciarJuego);

}

function reiniciarJuego() {

  // Agregar un setTimeout de 1 segundo antes de reiniciar
  setTimeout(() => {
    reiniciarJuegoInternal();
  }, 1000);
}

function reiniciarJuegoInternal() {
  // Restablecer variables a su estado inicial
  cartas = [];
  cartasgiradas = [];
  puedegirar = true;
  numeros = [];
  segundos = 0;
  c = 0;
  bandera = false;

  // Reiniciar el contador de clics
  const contador = document.querySelector('num-counter-1');
  contador.x = 0;
  contador.render(); // Renderiza el contador con el nuevo valor

  // Restablecer elementos del DOM
  contenedor.innerHTML = '';
  contenedor.style.display = 'none';
  mensaje.style.display = 'none';
  document.getElementById('seleccionarDificultad').style.display = 'block';
  document.getElementById('botontexto').style.display = 'block';
  document.querySelector('.frases').style.display = 'block';
  document.getElementById('mensaje').style.display = 'block';
  document.getElementById('mensaje').textContent = '';
  document.getElementById('numeroclicks').style.display = 'none';
  document.getElementById("botonreinicio").style.display = 'none';
  document.getElementById("cuentaRegresiva2").style.display = 'none';
  document.getElementById('texto').style.display = 'none';
  document.querySelector('h1').style.display = 'block';

}









//////////////////////////////////////////////////// WEB COMPONENT ////////////////////////////////////////////////////////////

class Counter1 extends HTMLElement {
  constructor() {
    super();
    this.x = 0;
    this.style.display = 'none';  // Oculta el contador por defecto
    
    document.getElementById('contenedor').addEventListener('click', () => {

      if (juegoIniciado && this.style.display !== 'none') {
        this.clicked();
      }
    });
  }

  clicked() {
    this.x++;
    this.render();
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.textContent = 'Clicks: '+this.x.toString();
  }

  setVisibility(visible) {
    this.style.display = visible ? 'block' : 'none';
    document.getElementById('cuentaclicks').style.display = this.style.display;
  }
}

window.customElements.define('num-counter-1', Counter1);



function comprobarnumeroclicks() {
  // Obtén una referencia al contador
  const contador = document.querySelector('num-counter-1');

  // Recupera el número de clics
  const numeroDeClics = contador.x;

  // Comparar el número de clics con la cantidad de cartas
  if (numeroDeClics + 1 === cartas.length) {
    // Si son iguales, mostrar mensaje de juego completado con máxima puntuación
    document.getElementById('numeroclicks').textContent = `Has hecho el mismo número de clicks que cartas hay: ${numeroDeClics + 1}.`;

    // Establecer la visibilidad del mensaje
    document.getElementById('numeroclicks').style.display = 'block';
  } else if (numeroDeClics + 1 > cartas.length) {
    // Si hay más clics que cartas, mostrar mensaje de puedes hacerlo mejor
    var clicksextra = (numeroDeClics + 1) - cartas.length;
    document.getElementById('numeroclicks').textContent = `Optimiza el número de clicks. Has hecho ${clicksextra} clicks de más.`;

    // Establecer la visibilidad del mensaje
    document.getElementById('numeroclicks').style.display = 'block';
  } else {
    // Si no se cumplen las condiciones anteriores, ocultar el mensaje
    document.getElementById('numeroclicks').style.display = 'none';
    document.getElementById('cuentaclicks').style.display = 'none';
  }

  console.log('Número de clicks:', numeroDeClics);
}











