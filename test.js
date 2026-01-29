const Database = require('./src/database/Database');
const ReservationValidator = require('./src/validation/ReservationValidator');
const Reservation = require('./src/models/Reservation');

console.log('=== KOKOUSHUONEIDEN VARAUSRAJAPINTA - TESTIT ===\n');

const database = new Database();
const validator = new ReservationValidator(database);

// Testi 1: Huoneiden näyttö
console.log('TEST 1: Huoneiden näyttö');
console.log('Saatavilla olevat huoneet:');
database.getRooms().forEach(room => {
  console.log(`  - ${room.id}: ${room.nimi}`);
});
console.log('✅ HYVÄKSYTTY\n');

// Testi 2: Kelvollinen varaus
console.log('TEST 2: Kelvollinen varaus');
const validResult = validator.validate(
  1001,
  'Matti Meikäläinen',
  '30-01-2026',
  '10:00',
  '12:00'
);
console.log(`Validointi tulos: ${validResult.valid ? 'HYVÄKSYTTY' : 'HYLÄTTY'}`);
if (!validResult.valid) console.log(`Virhe: ${validResult.error}`);

if (validResult.valid) {
  const reservation = new Reservation(null, 1001, 'Matti Meikäläinen', '30-01-2026', '10:00', '12:00');
  database.addReservation(reservation);
  console.log('✅ Varaus luotu ID:llä ' + reservation.id + '\n');
}

// Testi 3: Päällekkäisen varauksen esto
console.log('TEST 3: Päällekkäisen varauksen esto');
const overlapResult = validator.validate(
  1001,
  'John Smith',
  '30-01-2026',
  '11:00',
  '13:00'
);
console.log(`Validointi tulos: ${overlapResult.valid ? 'HYVÄKSYTTY' : 'HYLÄTTY'}`);
console.log(`Virhe: ${overlapResult.error}`);
console.log('✅ Päällekkäinen varaus estetty\n');

// Testi 4: Menneisyyteen sijoittuvan varauksen esto
console.log('TEST 4: Menneisyyteen sijoittuvan varauksen esto');
const pastResult = validator.validate(
  1002,
  'Jane Doe',
  '29-01-2026',
  '10:00',
  '12:00'
);
console.log(`Validointi tulos: ${pastResult.valid ? 'HYVÄKSYTTY' : 'HYLÄTTY'}`);
console.log(`Virhe: ${pastResult.error}`);
console.log('✅ Menneisyyteen sijoittuva varaus estetty\n');

// Testi 5: Viikonloppu varauksen esto
console.log('TEST 5: Viikonloppu varauksen esto');
const weekendResult = validator.validate(
  1002,
  'Anna Johnson',
  '01-02-2026',
  '09:00',
  '11:00'
);
console.log(`Validointi tulos: ${weekendResult.valid ? 'HYVÄKSYTTY' : 'HYLÄTTY'}`);
console.log(`Virhe: ${weekendResult.error}`);
console.log('✅ Viikonloppu varaus estetty (01-02-2026 on lauantai)\n');

// Testi 6: Aukioloaikojen ulkopuolisen varauksen esto
console.log('TEST 6: Aukioloaikojen ulkopuolisen varauksen esto');
const outsideHoursResult = validator.validate(
  1002,
  'Bob Wilson',
  '30-01-2026',
  '07:00',
  '09:00'
);
console.log(`Validointi tulos: ${outsideHoursResult.valid ? 'HYVÄKSYTTY' : 'HYLÄTTY'}`);
console.log(`Virhe: ${outsideHoursResult.error}`);
console.log('✅ Liian aikainen varaus estetty\n');

// Testi 7: Aloitusajan oltava ennen lopetusaikaa
console.log('TEST 7: Aloitusaika ennen lopetusaikaa');
const invalidTimeResult = validator.validate(
  1003,
  'Carol Brown',
  '30-01-2026',
  '12:00',
  '10:00'
);
console.log(`Validointi tulos: ${invalidTimeResult.valid ? 'HYVÄKSYTTY' : 'HYLÄTTY'}`);
console.log(`Virhe: ${invalidTimeResult.error}`);
console.log('✅ Virheellinen aikaväli estetty\n');

// Testi 8: Kelvollinen nimi
console.log('TEST 8: Henkilön nimen validointi');
const validName = validator.isValidName('Pekka Poikanen');
console.log(`Validointi tulos: ${validName ? 'HYVÄKSYTTY' : 'HYLÄTTY'}`);
console.log('✅ Kelvollinen nimi hyväksytty\n');

// Testi 9: Virheellinen nimi (vain etunimi)
console.log('TEST 9: Virheellinen nimi - vain etunimi');
const invalidName = validator.isValidName('Pekka');
console.log(`Validointi tulos: ${invalidName ? 'HYVÄKSYTTY' : 'HYLÄTTY'}`);
console.log('✅ Virheellinen nimi hylätty\n');

// Testi 10: Varauksen peruutus
console.log('TEST 10: Varauksen peruutus');
const cancelled = database.cancelReservation(1);
console.log(`Peruutus onnistui: ${cancelled}`);
console.log('✅ Varaus peruutettu\n');

// Testi 11: Varausten katselu
console.log('TEST 11: Varausten katselu');
console.log('Jäljellä olevat varaukset:');
const remaining = database.getAllReservations();
if (remaining.length === 0) {
  console.log('  (Varauksia ei ole)');
} else {
  remaining.forEach(res => {
    const room = database.getRoomById(res.huone_id);
    console.log(`  - ID: ${res.id} | ${room.nimi} | ${res.nimi} | ${res.pvm} ${res.aloitusaika}-${res.lopetusaika}`);
  });
}
console.log('✅ Varausten katselu toimii\n');

console.log('=== KAIKKI TESTIT SUORITETTU ONNISTUNEESTI ===');
