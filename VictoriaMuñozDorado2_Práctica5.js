// constantes y variables globales

const contenedor = document.getElementById('contenedor');
const mensaje = document.getElementById('mensaje');

let cartas = [];
let cartasgiradas = [];
let puedegirar = true;
let juegoIniciado = false;

let numeros;
var segundos;
var bandera = false;

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




// Para que las cartas salgan cada vez en orden distinto cada vez
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

    // Obtener el elemento HTML para mostrar la cuenta regresiva
    const cuentaRegresivaElemento = document.getElementById("cuentaRegresiva2");

    // Mostrar el elemento de cuenta regresiva y establecer el tiempo inicial
    cuentaRegresivaElemento.style.display = "block";
    cuentaRegresivaElemento.innerHTML = `Tiempo restante: ${tiempoRestante} segundos`;

    // Configurar un intervalo que se ejecuta cada segundo
    const intervalo = setInterval(() => {
      tiempoRestante--;

      // Actualizar el elemento con el tiempo restante si es mayor o igual a cero y la bandera no está activada
      if (tiempoRestante >= 0 && !bandera) {
        cuentaRegresivaElemento.innerHTML = `Tiempo restante: ${tiempoRestante} segundos`;
      } else {
        // Limpiar el intervalo cuando el tiempo restante llega a cero o la bandera está activada
        clearInterval(intervalo);

        if (!bandera) {
          // Llamar a la función finalizarJuego si el tiempo se agota
          finalizarJuego();
          // Rechazar la promesa con un mensaje de tiempo agotado
          reject("¡Tiempo agotado!");
        } else {
          // Resolver la promesa si la bandera es verdadera
          resolve("¡Enhorabuena, has ganado!");
        }
      }
    }, 1000); // El intervalo se ejecuta cada 1000 milisegundos (1 segundo)
  });
}

                                              

// Función que controla las cartas clickadas y las oculta
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
// Función para comprobar si las dos cartas seleccionadas son iguales.
 function comprobariguales() {
  // Obtener los índices de las dos cartas seleccionadas
  const indice1 = cartasgiradas[0];
  const indice2 = cartasgiradas[1];

  // Obtener las referencias de las dos cartas en el DOM
  const carta1 = document.querySelector('.card[data-index="' + indice1 + '"]');
  const carta2 = document.querySelector('.card[data-index="' + indice2 + '"]');

  // Verificar si las cartas tienen el mismo valor
  if (cartas[indice1] === cartas[indice2]) {
    // Si las cartas coinciden, vaciamos el array de cartas seleccionadas y aumentamos el contador
    cartasgiradas = [];
    c++;
  } else {
    // Si las cartas no coinciden, mostramos visualmente las cartas nuevamente
    carta1.classList.remove('hidden');
    carta2.classList.remove('hidden');
    cartasgiradas = [];
  }

  // Reactivar la capacidad de girar tarjetas
  puedegirar = true;

  // Verificar si se han encontrado TODAS las parejas
  if (c == cartas.length / 2) {
    // Ocultar el contenedor de cartas y actualizar banderas y estado del juego
    contenedor.style.display = 'none';
    bandera = true;
    juegoIniciado = false;

    // Comprobar el número de clics y actualizar la visibilidad del contador
    comprobarnumeroclicks();
    const contador = document.querySelector('num-counter-1');
    contador.setVisibility(false);

    // Mostrar el botón de reinicio y agregar el evento para reiniciar el juego
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

  contador.setVisibility(false); //visibilidad del contador de contar clicks
  comprobarnumeroclicks();
  document.getElementById('contenedor').style.display = 'none';
  document.getElementById("botonreinicio").style.display = 'block';
  document.getElementById("botonreinicio").addEventListener("click", reiniciarJuego);

}

//////////////////////////////////////////////////////////// -SETTIMEOUT- //////////////////////////////////////////////////////////////////////

function reiniciarJuego() {

  // Agregar un setTimeout de 1 segundo antes de reiniciar
  setTimeout(() => {
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

  }, 1000);
}

//////////////////////////////////////////////////////////// -WEB COMPONENT- //////////////////////////////////////////////////////////////////////
// Define la clase del componente Counter1 que extiende HTMLElement
class Counter1 extends HTMLElement {
  constructor() {
    super(); // Llama al constructor de la clase base (HTMLElement)
    this.x = 0; // Inicializa la propiedad 'x' del contador a 0
    this.style.display = 'none';  // Oculta el contador por defecto
    
    // Agrega un event listener al contenedor para registrar clics solo si el juego está iniciado y el contador no está oculto
    document.getElementById('contenedor').addEventListener('click', () => {
      if (juegoIniciado && this.style.display !== 'none') {
        this.clicked(); // Llama a la función clicked cuando se registra un clic
      }
    });
  }

  // Incrementa el contador cuando se registra un clic
  clicked() {
    this.x++;
    this.render(); // Llama a la función render para actualizar la visualización del contador
  }

  // Se llama cuando el elemento es conectado al DOM
  connectedCallback() {
    this.render(); // Llama a la función render al conectar el elemento al DOM
  }

  // Actualiza la visualización del contador
  render() {
    this.textContent = 'Clicks: ' + this.x.toString(); // Establece el contenido de texto del contador
  }

  // Establece la visibilidad del contador y ajusta la visibilidad de otro elemento ('cuentaclicks')
  setVisibility(visible) {
    this.style.display = visible ? 'block' : 'none'; // Si visible es true, muestra el contador; de lo contrario, lo oculta
    document.getElementById('cuentaclicks').style.display = this.style.display; // Ajusta la visibilidad de 'cuentaclicks'
  }
}

// Registra el nuevo componente personalizado para su uso en el DOM
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











