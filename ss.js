const contenedor = document.getElementById('contenedor');
const mensaje = document.getElementById('mensaje');

let cartas = [];
let cartasgiradas = [];
let puedegirar = true;

let numeros;
var segundos;

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
    segundos = 60;
  }

  inicializar(cartasporfila, cartasporcolumna);
}

function inicializar(cartasporfila, cartasporcolumna) {
  var elementoFrases = document.getElementsByClassName('frases')[0];

  if (elementoFrases) {
    elementoFrases.style.display = 'none';
  }

  document.getElementById('mensaje').style.display = 'none';
  document.getElementById('seleccionarDificultad').style.display = 'none';
  document.getElementById('botontexto').style.display = 'none';
  mostrarCuentaRegresiva().then(() => {
    contenedor.style.display = 'grid';
    contenedor.style.gridTemplateColumns = `repeat(${cartasporfila}, 1fr)`;
    contenedor.style.gridTemplateRows = `repeat(${cartasporcolumna}, 1fr)`;
    contenedor.style.gridGap = '10px'; // Ajusta el espacio entre las celdas del grid

    barajarcartas();
    mostrarmensaje('Encuentra todos los pares de tarjetas.');
  });
}

function mostrarCuentaRegresiva() {
  return new Promise((resolve) => {
    let contador = 2;

    const cuentaRegresivaElemento = document.getElementById("cuentaRegresiva");

    cuentaRegresivaElemento.style.display = "block";
    cuentaRegresivaElemento.innerHTML = `Comenzando en 3`;

    const intervalo = setInterval(() => {
      cuentaRegresivaElemento.innerHTML = `Comenzando en ${contador}`;
      contador--;

      if (contador < 0) {
        clearInterval(intervalo);
        cuentaRegresivaElemento.innerHTML = "";
        cuentaRegresivaElemento.style.display = "none";
        resolve();
      }
    }, 1000);
  });
}

function barajarcartas() {
  document.getElementById('mensaje').style.display = 'block';
  // Crear una copia de las cartas duplicadas. Tenemos un array con los simbolos duplicados
  const todascartas = numeros.concat(numeros); //numeros.concat(numeros.slice())

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

  // Renderizar las cartas
  devolvercartas();
}


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

  // Agrega esta llamada a la nueva función al final de devolvercartas
  iniciarCuentaAtras(segundos); // Aquí puedes ajustar el tiempo límite del juego en segundos
}

// Agrega esta función al final del código
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


  ////////////////////////////////////////////////////////////////////////////////////////////////////
  console.log("Valor de c:", c); // Agrega este mensaje de consola
  console.log("longitud de cartas:", cartas.length/2); // Agrega este mensaje de consola
////////////////////////////////////////////////////////////////////////////////////////////////////
  

  puedegirar = true;

  if (c == cartas.length/2) {
    // alert('holaaaaaaa');
    contenedor.style.display = 'none';
    mostrarmensaje("¡Felicidades! Has encontrado todos los pares."); 
    bandera = true;
    document.getElementById("botonreinicio").style.display('block');
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



function iniciarCuentaAtras(tiempo) {
  return new Promise((resolve) => {
    let tiempoRestante = tiempo;

    const cuentaRegresivaElemento = document.getElementById("cuentaRegresiva2");

    cuentaRegresivaElemento.style.display = "block";
    cuentaRegresivaElemento.innerHTML = `Tiempo restante: ${tiempoRestante} segundos`;

    const intervalo = setInterval(() => {
      tiempoRestante--;

      if (tiempoRestante >= 0 && !bandera) { // Modifica la condición
        cuentaRegresivaElemento.innerHTML = `Tiempo restante: ${tiempoRestante} segundos`;
      } else {
        clearInterval(intervalo);
        
        if (!bandera) {
          cuentaRegresivaElemento.innerHTML = "¡Tiempo agotado!";
          finalizarJuego(); // Llama a la función para finalizar el juego solo si la bandera es falsa
        }
        resolve(); // Resuelve la promesa después de mostrar el mensaje de tiempo agotado
      }
    }, 1000);
  });
}


function finalizarJuego() {
  // Agrega aquí la lógica para manejar el final del juego
  // Puedes reiniciar el juego, mostrar un mensaje adicional, etc.
  // Por ejemplo: reiniciarJuego();

  document.getElementById('contenedor').style.display = 'none';
  document.getElementById('mensaje').textContent = 'Game Over';
  document.getElementById("botonreinicio").style.display('block');
  document.getElementById("botonreinicio").addEventListener("click", reiniciarJuego);

}

function reiniciarJuego() {
  // Restablecer variables a su estado inicial
  cartas = [];
  cartasgiradas = [];
  puedegirar = true;
  numeros = [];
  segundos = 0;
  c = 0;
  bandera = false;

  // Restablecer elementos del DOM
  contenedor.innerHTML = '';
  contenedor.style.display = 'none';
  mensaje.style.display = 'none';
  document.getElementById('seleccionarDificultad').style.display = 'block';
  document.getElementById('botontexto').style.display = 'block';

  // Llamar a la función para seleccionar la dificultad
  // Esto dependerá de cómo hayas implementado tu interfaz de usuario
  // Puedes llamar a 'establecerDificultad' con la dificultad predeterminada o mostrar un menú para que el jugador seleccione la dificultad.
  // Por ejemplo: establecerDificultad('medio');
}