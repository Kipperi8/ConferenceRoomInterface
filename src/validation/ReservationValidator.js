const DateTimeUtils = require('../utils/DateTimeUtils');
const Reservation = require('../models/Reservation');

class ReservationValidator {
  constructor(database) {
    this.database = database;
  }

  validate(roomId, nimi, pvm, aloitusaika, lopetusaika, existingReservations = []) {
    // Tarkista huoneen olemassaolo
    if (!this.database.getRoomById(roomId)) {
      return { valid: false, error: 'Huonetta ei löydy.' };
    }

    // Tarkista henkilön nimi (etunimi sukunimi)
    if (!this.isValidName(nimi)) {
      return { valid: false, error: 'Henkilön nimi tulee olla muodossa "etunimi sukunimi".' };
    }

    // Tarkista päivämäärä
    const dateObj = DateTimeUtils.parseDate(pvm);
    if (!dateObj) {
      return { valid: false, error: 'Virheellinen päivämäärä. Käytä muotoa DD-MM-YYYY.' };
    }

    // Tarkista, että päivä on tulevaisuudessa tai tänään
    if (!DateTimeUtils.isFutureOrToday(dateObj)) {
      return { valid: false, error: 'Varaus ei voi sijoittua menneisyyteen.' };
    }

    // Tarkista, että päivä on arkipäivä
    if (!DateTimeUtils.isWeekday(dateObj)) {
      return { valid: false, error: 'Varauksia voi tehdä vain arkipäiville (ma-pe).' };
    }

    // Tarkista ajat
    const startTimeMinutes = DateTimeUtils.parseTime(aloitusaika);
    if (startTimeMinutes === null) {
      return { valid: false, error: 'Virheellinen aloitusaika. Käytä muotoa HH:mm.' };
    }

    const endTimeMinutes = DateTimeUtils.parseTime(lopetusaika);
    if (endTimeMinutes === null) {
      return { valid: false, error: 'Virheellinen lopetusaika. Käytä muotoa HH:mm.' };
    }

    // Tarkista, että aloitusaika on ennen lopetusaikaa
    if (startTimeMinutes >= endTimeMinutes) {
      return { valid: false, error: 'Aloitusajan tulee olla ennen lopetusaikaa.' };
    }

    // Tarkista aukioloajat (08:00 - 16:00)
    if (startTimeMinutes < 8 * 60) {
      return { valid: false, error: 'Varaus ei voi alkaa ennen klo 08:00.' };
    }

    if (endTimeMinutes > 16 * 60) {
      return { valid: false, error: 'Varaus ei voi loppua klo 16:00 jälkeen.' };
    }

    // Tarkista päällekkäiset varaukset
    const roomReservations = existingReservations.length > 0 
      ? existingReservations 
      : this.database.getReservationsByRoom(roomId);

    for (const reservation of roomReservations) {
      if (reservation.pvm === pvm) {
        const existingStart = DateTimeUtils.parseTime(reservation.aloitusaika);
        const existingEnd = DateTimeUtils.parseTime(reservation.lopetusaika);

        // Tarkista päällekkäisyys
        if (startTimeMinutes < existingEnd && endTimeMinutes > existingStart) {
          return { valid: false, error: `Huone on jo varattu välille ${reservation.aloitusaika} - ${reservation.lopetusaika}.` };
        }
      }
    }

    return { valid: true };
  }

  isValidName(nimi) {
    // Tarkista, että nimi sisältää vähintään kaksi sanaa (etunimi ja sukunimi)
    const parts = nimi.trim().split(/\s+/);
    if (parts.length < 2) {
      return false;
    }

    // Tarkista, että kaikki osat ovat kirjaimia (ja mahdollisesti väliviivoja)
    for (const part of parts) {
      if (!/^[a-zA-Z\u00C0-\u00FF-]+$/.test(part)) {
        return false;
      }
    }

    return true;
  }
}

module.exports = ReservationValidator;
