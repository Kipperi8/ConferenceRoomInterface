const prompt = require('prompt-sync')();

function viewReservations(database) {
  console.log('\n--- Varausten katselu ---\n');

  // Näytä saatavilla olevat huoneet
  const rooms = database.getRooms();
  console.log('Saatavilla olevat huoneet:');
  rooms.forEach(room => {
    console.log(`  ${room.id}: ${room.nimi}`);
  });

  // Kysy huone
  const roomIdInput = prompt('\nSyötä huoneen ID (tai paina Enter nähdäksesi kaikki varaukset): ').trim();

  let roomId = null;

  if (roomIdInput !== '') {
    roomId = parseInt(roomIdInput);
    if (isNaN(roomId)) {
      console.log('\n❌ Virhe: Huoneen ID:n tulee olla numero.');
      return;
    }

    if (!database.getRoomById(roomId)) {
      console.log('\n❌ Virhe: Huonetta ID:llä ' + roomId + ' ei löydy.');
      return;
    }
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
    const dateCompare = a.pvm.localeCompare(b.pvm);
    if (dateCompare !== 0) {
      const [dayA, monthA, yearA] = a.pvm.split('-').map(Number);
      const [dayB, monthB, yearB] = b.pvm.split('-').map(Number);
      const dateA = new Date(yearA, monthA - 1, dayA);
      const dateB = new Date(yearB, monthB - 1, dayB);
      return dateA - dateB;
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
