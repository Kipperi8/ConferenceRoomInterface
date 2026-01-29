#!/usr/bin/env node

const Database = require('./src/database/Database');
const Reservation = require('./src/models/Reservation');
const ReservationValidator = require('./src/validation/ReservationValidator');

console.log('=== INTEGRAATIOTESTIT ===\n');

const database = new Database();
const validator = new ReservationValidator(database);

// Skenario 1: Luo kaksi varausta eri huoneisiin samalle päivälle
console.log('SKENARIO 1: Kaksi varausta eri huoneisiin');
console.log('-------------------------------------------');

const res1 = validator.validate(1001, 'Matti Meikäläinen', '30-01-2026', '09:00', '11:00');
if (res1.valid) {
  const reservation1 = new Reservation(null, 1001, 'Matti Meikäläinen', '30-01-2026', '09:00', '11:00');
  const saved1 = database.addReservation(reservation1);
  console.log(`✅ Varaus 1 luotu: ID ${saved1.id}, Kokoushuone A, 09:00-11:00`);
}

const res2 = validator.validate(1002, 'Liisa Laineen', '30-01-2026', '09:00', '11:00');
if (res2.valid) {
  const reservation2 = new Reservation(null, 1002, 'Liisa Laineen', '30-01-2026', '09:00', '11:00');
  const saved2 = database.addReservation(reservation2);
  console.log(`✅ Varaus 2 luotu: ID ${saved2.id}, Kokoushuone B, 09:00-11:00`);
}

// Skenario 2: Yritä luoda päällekkäinen varaus
console.log('\nSKENAARAIO 2: Päällekkäisen varauksen esto');
console.log('-------------------------------------------');

const res3 = validator.validate(1001, 'John Smith', '30-01-2026', '10:00', '12:00');
if (!res3.valid) {
  console.log(`❌ Päällekkäinen varaus estetty: ${res3.error}`);
}

// Skenario 3: Katso varaukset huoneittain
console.log('\nSKENAARAIO 3: Varausten katselu huoneittain');
console.log('-------------------------------------------');

const room1Reservations = database.getReservationsByRoom(1001);
console.log(`Kokoushuone A (ID 1001) - ${room1Reservations.length} varaus(ta):`);
room1Reservations.forEach(res => {
  console.log(`  - ${res.nimi}: ${res.pvm} ${res.aloitusaika}-${res.lopetusaika}`);
});

const room2Reservations = database.getReservationsByRoom(1002);
console.log(`\nKokoushuone B (ID 1002) - ${room2Reservations.length} varaus(ta):`);
room2Reservations.forEach(res => {
  console.log(`  - ${res.nimi}: ${res.pvm} ${res.aloitusaika}-${res.lopetusaika}`);
});

// Skenario 4: Peruuta varaus
console.log('\nSKENAARAIO 4: Varauksen peruutus');
console.log('-------------------------------------------');

const success = database.cancelReservation(1);
if (success) {
  console.log(`✅ Varaus ID 1 peruutettu onnistuneesti`);
  console.log(`Jäljellä olevat varaukset: ${database.getAllReservations().length}`);
}

// Skenario 5: Tarkista, että varaus poistui
console.log('\nSKENAARAIO 5: Varausten katselu peruutuksen jälkeen');
console.log('-------------------------------------------');

const room1ReservationsAfter = database.getReservationsByRoom(1001);
console.log(`Kokoushuone A (ID 1001) - ${room1ReservationsAfter.length} varaus(ta):`);
if (room1ReservationsAfter.length === 0) {
  console.log('  (Varauksia ei ole)');
}

// Skenario 6: Lisää varaus samaan aikaväliin
console.log('\nSKENAARAIO 6: Samaan aikaväliin uusi varaus');
console.log('-------------------------------------------');

const res4 = validator.validate(1001, 'Anna Johnson', '30-01-2026', '09:30', '10:30');
if (res4.valid) {
  const reservation4 = new Reservation(null, 1001, 'Anna Johnson', '30-01-2026', '09:30', '10:30');
  const saved4 = database.addReservation(reservation4);
  console.log(`✅ Varaus luotu: ID ${saved4.id}, Kokoushuone A, 09:30-10:30`);
} else {
  console.log(`❌ Varaus hylätty: ${res4.error}`);
}

console.log('\n=== INTEGRAATIOTESTIT SUORITETTU ===');
