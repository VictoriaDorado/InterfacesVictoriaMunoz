const contenedor = document.getElementById('contenedor');
const mensaje = document.getElementById('mensaje');
const symbols = ['1', '2', '3', '4', '5', '6', '7', '8'];

function establecerDificultad() {
  inicializar();
  contenedor.style.display = 'flex';
  document.getElementById('seleccionarDificultad').style.display = 'none';
  document.getElementById('texto').style.display = 'none';
}

function inicializar() {
  devolvercartas();
  mostrarmensaje('Encuentra todos los pares de tarjetas.');
}

function devolvercartas() {
  contenedor.innerHTML = '';

  for (let x = 0; x < symbols.length; x++) {
    const symbol = symbols[x];

    const card = document.createElement('div');
    card.classList.add('card');
    card.textContent = symbol;
    card.addEventListener('click', () => flipCard(card));

    contenedor.appendChild(card);
  }
}

function flipCard(card) {
  // Implementar la lógica de voltear la tarjeta si es necesario
  console.log('Voltear tarjeta:', card.textContent);
}

function mostrarmensaje(text) {
  mensaje.textContent = text;
}