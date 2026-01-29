const inquirer = require('inquirer');
const Reservation = require('../../models/Reservation');
const ReservationValidator = require('../../validation/ReservationValidator');
const DateTimeUtils = require('../../utils/DateTimeUtils');

async function createReservation(database) {
  console.log('\n--- Varauksen luonti ---\n');

  // Näytä saatavilla olevat huoneet
  const rooms = database.getRooms();
  console.log('Saatavilla olevat huoneet:');
  rooms.forEach(room => {
    console.log(`  ${room.id}: ${room.nimi}`);
  });

  // Kysy tiedot
  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'roomId',
      message: 'Syötä huoneen ID:',
      validate: (input) => {
        const id = parseInt(input);
        if (isNaN(id)) {
          return 'Huoneen ID:n tulee olla numero.';
        }
        if (!database.getRoomById(id)) {
          return 'Huonetta ei löydy.';
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'nimi',
      message: 'Syötä henkilön nimi (etunimi sukunimi):',
      validate: (input) => {
        const parts = input.trim().split(/\s+/);
        if (parts.length < 2) {
          return 'Nimi tulee olla muodossa "etunimi sukunimi".';
        }
        for (const part of parts) {
          if (!/^[a-zA-Z\u00C0-\u00FF-]+$/.test(part)) {
            return 'Nimi saa sisältää vain kirjaimia.';
          }
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'pvm',
      message: 'Syötä päivämäärä (DD-MM-YYYY):',
      validate: (input) => {
        const dateObj = DateTimeUtils.parseDate(input);
        if (!dateObj) {
          return 'Virheellinen päivämäärä. Käytä muotoa DD-MM-YYYY.';
        }
        if (!DateTimeUtils.isFutureOrToday(dateObj)) {
          return 'Varaus ei voi sijoittua menneisyyteen.';
        }
        if (!DateTimeUtils.isWeekday(dateObj)) {
          return 'Varauksia voi tehdä vain arkipäiville (ma-pe).';
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'aloitusaika',
      message: 'Syötä aloitusaika (HH:mm):',
      validate: (input) => {
        const minutes = DateTimeUtils.parseTime(input);
        if (minutes === null) {
          return 'Virheellinen aika. Käytä muotoa HH:mm.';
        }
        if (minutes < 8 * 60) {
          return 'Varaus ei voi alkaa ennen klo 08:00.';
        }
        return true;
      }
    },
    {
      type: 'input',
      name: 'lopetusaika',
      message: 'Syötä lopetusaika (HH:mm):',
      validate: (input) => {
        const minutes = DateTimeUtils.parseTime(input);
        if (minutes === null) {
          return 'Virheellinen aika. Käytä muotoa HH:mm.';
        }
        if (minutes > 16 * 60) {
          return 'Varaus ei voi loppua klo 16:00 jälkeen.';
        }
        return true;
      }
    }
  ]);

  const roomId = parseInt(answers.roomId);
  const { nimi, pvm, aloitusaika, lopetusaika } = answers;

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
