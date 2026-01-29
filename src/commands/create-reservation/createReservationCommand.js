const prompt = require('prompt-sync')();
const Reservation = require('../../models/Reservation');
const ReservationValidator = require('../../validation/ReservationValidator');
const DateTimeUtils = require('../../utils/DateTimeUtils');

function createReservation(database) {
  console.log('\n--- Varauksen luonti ---\n');

  // Näytä saatavilla olevat huoneet
  const rooms = database.getRooms();
  console.log('Saatavilla olevat huoneet:');
  rooms.forEach(room => {
    console.log(`  ${room.id}: ${room.nimi}`);
  });

  // Kysy huone
  const roomIdInput = prompt('\nSyötä huoneen ID: ');
  const roomId = parseInt(roomIdInput);

  if (isNaN(roomId)) {
    console.log('\n❌ Virhe: Huoneen ID:n tulee olla numero.');
    return;
  }

  // Kysy henkilön nimi
  const nimi = prompt('Syötä henkilön nimi (etunimi sukunimi): ').trim();

  // Kysy päivämäärä
  const pvm = prompt('Syötä päivämäärä (DD-MM-YYYY): ').trim();

  // Kysy aloitusaika
  const aloitusaika = prompt('Syötä aloitusaika (HH:mm): ').trim();

  // Kysy lopetusaika
  const lopetusaika = prompt('Syötä lopetusaika (HH:mm): ').trim();

  // Validoi varaus
  const validator = new ReservationValidator(database);
  const validationResult = validator.validate(roomId, nimi, pvm, aloitusaika, lopetusaika);

  if (!validationResult.valid) {
    console.log(`\n❌ Virhe: ${validationResult.error}`);
    return;
  }

  // Luo varaus
  const reservation = new Reservation(null, roomId, nimi, pvm, aloitusaika, lopetusaika);
  const savedReservation = database.addReservation(reservation);

  const room = database.getRoomById(roomId);
  console.log(`\n✅ Varaus luotu onnistuneesti!`);
  console.log(`   Varaus ID: ${savedReservation.id}`);
  console.log(`   Huone: ${room.nimi}`);
  console.log(`   Henkilö: ${savedReservation.nimi}`);
  console.log(`   Päivämäärä: ${savedReservation.pvm}`);
  console.log(`   Aika: ${savedReservation.aloitusaika} - ${savedReservation.lopetusaika}`);
}

module.exports = createReservation;
