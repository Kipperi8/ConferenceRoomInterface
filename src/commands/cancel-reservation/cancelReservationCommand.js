const inquirer = require('inquirer');

async function cancelReservation(database) {
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
  const answer = await inquirer.prompt([
    {
      type: 'input',
      name: 'reservationId',
      message: '\nSyötä peruutettavan varauksen ID:',
      validate: (input) => {
        const id = parseInt(input);
        if (isNaN(id)) {
          return 'Varauksen ID:n tulee olla numero.';
        }
        const reservation = database.getReservationById(id);
        if (!reservation) {
          return `Varausta ID:llä ${id} ei löydy.`;
        }
        return true;
      }
    }
  ]);

  const reservationId = parseInt(answer.reservationId);
  const reservation = database.getReservationById(reservationId);

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
