const prompt = require('prompt-sync')();
const Database = require('./database/Database');
const createReservation = require('./commands/create-reservation/createReservationCommand');
const cancelReservation = require('./commands/cancel-reservation/cancelReservationCommand');
const viewReservations = require('./commands/view-reservations/viewReservationsCommand');

const database = new Database();

function displayMenu() {
  console.log('\n╔════════════════════════════════════════╗');
  console.log('║  Kokoushuoneiden varausrajapinta      ║');
  console.log('╠════════════════════════════════════════╣');
  console.log('║  1. Luo varaus                         ║');
  console.log('║  2. Peruuta varaus                     ║');
  console.log('║  3. Katso varaukset                    ║');
  console.log('║  4. Lopeta sovellus                    ║');
  console.log('╚════════════════════════════════════════╝');
}

function main() {
  console.clear();
  console.log('Tervetuloa kokoushuoneiden varausrajapintaan!');

  while (true) {
    displayMenu();
    const choice = prompt('\nValitse toiminto (1-4): ').trim();

    if (choice === '1') {
      createReservation(database);
    } else if (choice === '2') {
      cancelReservation(database);
    } else if (choice === '3') {
      viewReservations(database);
    } else if (choice === '4') {
      console.log('\nOhjelmasta poistutaan. Arvoisa näkemiin!');
      process.exit(0);
    } else {
      console.log('\n❌ Virhe: Valitse numero 1-4.');
    }
  }
}

main();
