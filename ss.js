const contenedor = document.getElementById('contenedor');
const mensaje = document.getElementById('mensaje');
const symbols = ['1', '2', '3', '4', '5', '6', '7', '8'];
let cards = [];
let flippedCards = [];
let canFlip = true;


function establecerDificultad() {
  inicializar();
  contenedor.style.display = 'flex';
  document.getElementById('seleccionarDificultad').style.display = 'none';
  document.getElementById('botontexto').style.display = 'none';
}

function inicializar() {
  barajarcartas();
  mostrarmensaje('Encuentra todos los pares de tarjetas.');
}




function barajarcartas() 
{
    // Crear una copia de las cartas duplicadas. Tenemos un array con los simbolos duplicados
    const todascartas = symbols.concat(symbols); //symbols.concat(symbols.slice())

    // Barajar las cartas
    for (let i = 0; i < todascartas.length; i++) 
    {
        const randomIndex = Math.floor(Math.random() * todascartas.length); // esta línea de código genera un índice aleatorio dentro del rango de los elementos no procesados en el array allCards.
        // Intercambiar elementos usando una variable temporal
        const aux = todascartas[i];
        todascartas[i] = todascartas[randomIndex];
        todascartas[randomIndex] = aux;
    }

    // Asignar el array barajado a la variable cards
    cards = todascartas;

    // Renderizar las cartas
    devolvercartas();
}

function devolvercartas() {
  contenedor.innerHTML = '';

  for (let x = 0; x < cards.length; x++) {
  const symbol = cards[x];

  const card = document.createElement('div');
  card.classList.add('card'); // le añadimos una clase
  card.textContent = symbol;
  card.setAttribute('data-index', x);
  card.addEventListener('click', flipCard);

    contenedor.appendChild(card);
  }
}


// Función para girar una tarjeta
function flipCard(event) {
  // Verificar si se puede girar una tarjeta
  if (!canFlip) {
      return; // Si no se puede, salir de la función
  }

  // Obtener la tarjeta clicada
  const clickedCard = event.target;

  // Obtener el índice de la tarjeta clicada
  const index = parseInt(clickedCard.getAttribute('data-index'));

  // Evitar hacer clic en tarjetas ya giradas
  if (flippedCards.includes(index)) {
      return; // Si la tarjeta ya está volteada, salir de la función
  }

  // Ocultar visualmente la tarjeta clicada
  clickedCard.classList.add('hidden');

  // Registrar la tarjeta como volteada
  flippedCards.push(index);

  // Verificar si se han volteado dos tarjetas
  if (flippedCards.length === 2) {
      canFlip = false; // Desactivar la capacidad de voltear temporalmente
      comprobariguales();
  }
  }


  function comprobariguales() {
    const index1 = flippedCards[0];
    const index2 = flippedCards[1];
    const card1 = document.querySelector('.card[data-index="' + index1 + '"]');
    const card2 = document.querySelector('.card[data-index="' + index2 + '"]');

    if (cards[index1] === cards[index2]) // si las cartas coinciden vaciamos el array.
    {
        flippedCards = [];
    }
    else // si no coinciden
    {
        card1.classList.remove('hidden');
        card2.classList.remove('hidden');
        flippedCards = [];
    }

    canFlip = true;

    if (flippedCards.length === cards.length) {
      mostrarmensaje("¡Felicidades! Has encontrado todos los pares."); // por alguna razón no funciona
    }
}

function mostrarmensaje(text) {
  mensaje.textContent = text;
}

function mostrarOcultarTexto() {
    var textoElemento = document.getElementById('texto');
    textoElemento.style.display = (textoElemento.style.display === 'none') ? 'block' : 'none';
  }