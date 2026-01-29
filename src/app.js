const inquirer = require('inquirer');
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

async function main() {
  console.clear();
  console.log('Tervetuloa kokoushuoneiden varausrajapintaan!');

  while (true) {
    displayMenu();
    const answer = await inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'Valitse toiminto:',
        choices: [
          { name: '1. Luo varaus', value: '1' },
          { name: '2. Peruuta varaus', value: '2' },
          { name: '3. Katso varaukset', value: '3' },
          { name: '4. Lopeta sovellus', value: '4' }
        ]
      }
    ]);

    if (answer.choice === '1') {
      await createReservation(database);
    } else if (answer.choice === '2') {
      await cancelReservation(database);
    } else if (answer.choice === '3') {
      await viewReservations(database);
    } else if (answer.choice === '4') {
      console.log('\nOhjelmasta poistutaan. Arvoisa näkemiin!');
      process.exit(0);
    }
  }
}

main();
