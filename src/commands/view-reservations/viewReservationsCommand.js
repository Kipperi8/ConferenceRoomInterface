const inquirer = require('inquirer');

async function viewReservations(database) {
  console.log('\n--- Varausten katselu ---\n');

  // Näytä saatavilla olevat huoneet
  const rooms = database.getRooms();
  console.log('Saatavilla olevat huoneet:');
  rooms.forEach(room => {
    console.log(`  ${room.id}: ${room.nimi}`);
  });

  // Kysy huone
  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: 'roomId',
      message: 'Syötä huoneen ID (tai paina Enter nähdäksesi kaikki varaukset):',
      validate: (input) => {
        if (input === '') {
          return true;
        }
        const id = parseInt(input);
        if (isNaN(id)) {
          return 'Huoneen ID:n tulee olla numero.';
        }
        if (!database.getRoomById(id)) {
          return `Huonetta ID:llä ${id} ei löydy.`;
        }
        return true;
      }
    }
  ]);

  const roomIdInput = answer.roomId;
  let roomId = null;

  if (roomIdInput !== '') {
    roomId = parseInt(roomIdInput);
  }

  let reservations;

  if (roomId) {
    reservations = database.getReservationsByRoom(roomId);
    const room = database.getRoomById(roomId);
    console.log(`\n--- ${room.nimi} varaukset ---\n`);
  } else {
    reservations = database.getAllReservations();
    console.log('\n--- Kaikki varaukset ---\n');
  }

  if (reservations.length === 0) {
    console.log('Varauksia ei ole olemassa.');
    return;
  }

  // Järjestä varaukset päivämäärän ja aloitusajan mukaan
  reservations.sort((a, b) => {
    const [dayA, monthA, yearA] = a.pvm.split('-').map(Number);
    const [dayB, monthB, yearB] = b.pvm.split('-').map(Number);
    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);
    const dateCompare = dateA - dateB;
    if (dateCompare !== 0) {
      return dateCompare;
    }
    return a.aloitusaika.localeCompare(b.aloitusaika);
  });

  // Näytä varaukset
  reservations.forEach(reservation => {
    const room = database.getRoomById(reservation.huone_id);
    console.log(`ID: ${String(reservation.id).padEnd(3)} | ${String(reservation.pvm).padEnd(10)} | ${String(reservation.aloitusaika).padEnd(5)} - ${String(reservation.lopetusaika).padEnd(5)} | ${room.nimi.padEnd(16)} | ${reservation.nimi}`);
  });
}

module.exports = viewReservations;
