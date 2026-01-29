const prompt = require('prompt-sync')();

function cancelReservation(database) {
  console.log('\n--- Varauksen peruutus ---\n');

  // Näytä kaikki varaukset
  const allReservations = database.getAllReservations();

  if (allReservations.length === 0) {
    console.log('Varauksia ei ole olemassa.');
    return;
  }

  console.log('Olemassa olevat varaukset:');
  allReservations.forEach(reservation => {
    const room = database.getRoomById(reservation.huone_id);
    console.log(`  ID: ${reservation.id} | ${room.nimi} | ${reservation.nimi} | ${reservation.pvm} ${reservation.aloitusaika}-${reservation.lopetusaika}`);
  });

  // Kysy varauksen ID
  const reservationIdInput = prompt('\nSyötä peruutettavan varauksen ID: ');
  const reservationId = parseInt(reservationIdInput);

  if (isNaN(reservationId)) {
    console.log('\n❌ Virhe: Varauksen ID:n tulee olla numero.');
    return;
  }

  // Tarkista, että varaus olemassa
  const reservation = database.getReservationById(reservationId);
  if (!reservation) {
    console.log('\n❌ Virhe: Varausta ID:llä ' + reservationId + ' ei löydy.');
    return;
  }

  // Peruuta varaus
  const success = database.cancelReservation(reservationId);

  if (success) {
    const room = database.getRoomById(reservation.huone_id);
    console.log(`\n✅ Varaus peruutettu onnistuneesti!`);
    console.log(`   Varaus ID: ${reservation.id}`);
    console.log(`   Huone: ${room.nimi}`);
    console.log(`   Henkilö: ${reservation.nimi}`);
    console.log(`   Päivämäärä: ${reservation.pvm}`);
    console.log(`   Aika: ${reservation.aloitusaika} - ${reservation.lopetusaika}`);
  } else {
    console.log('\n❌ Virhe: Varauksen peruutus epäonnistui.');
  }
}

module.exports = cancelReservation;
