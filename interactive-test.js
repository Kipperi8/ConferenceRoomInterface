const prompt = require('prompt-sync')();
const Database = require('./src/database/Database');
const createReservation = require('./src/commands/create-reservation/createReservationCommand');
const cancelReservation = require('./src/commands/cancel-reservation/cancelReservationCommand');
const viewReservations = require('./src/commands/view-reservations/viewReservationsCommand');

const database = new Database();

// Simuloi käyttäjän syöttöä
const inputs = [
  '1',           // Valitse "Luo varaus"
  '1001',        // Huone ID
  'Matti Meikäläinen', // Henkilö
  '30-01-2026',  // Päivämäärä
  '09:00',       // Aloitusaika
  '11:00',       // Lopetusaika
  '1',           // Valitse "Luo varaus"
  '1002',        // Huone ID
  'Liisa Laineen', // Henkilö
  '30-01-2026',  // Päivämäärä
  '14:00',       // Aloitusaika
  '15:30',       // Lopetusaika
  '3',           // Valitse "Katso varaukset"
  '1001',        // Huone ID
  '3',           // Valitse "Katso varaukset"
  '',            // Näytä kaikki
  '2',           // Valitse "Peruuta varaus"
  '1',           // Poista varaus ID 1
  '4'            // Lopeta
];

let inputIndex = 0;

// Korvaa prompt alkuperäisellä prompt:illä
const originalPrompt = prompt;
prompt.history = [];

// Simuloi prompt-input
global.promptInput = () => {
  if (inputIndex < inputs.length) {
    const input = inputs[inputIndex];
    inputIndex++;
    console.log(input);
    return input;
  }
  return '';
};

// Korvaa prompt-funktion
require.cache[require.resolve('prompt-sync')].exports = () => {
  return global.promptInput;
};

console.log('=== INTERAKTIIVINEN TESTI ===\n');

// Suorita testit
createReservation(database);
console.log('\n--- Seuraava testi: Toinen varaus ---\n');
createReservation(database);
console.log('\n--- Seuraava testi: Varausten katselu huoneittain ---\n');
viewReservations(database);
console.log('\n--- Seuraava testi: Kaikki varaukset ---\n');
viewReservations(database);
console.log('\n--- Seuraava testi: Varauksen peruutus ---\n');
cancelReservation(database);

console.log('\n=== KAIKKI INTERAKTIIVISET TESTIT SUORITETTU ===');
