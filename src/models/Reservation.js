class Reservation {
  constructor(id, huone_id, nimi, pvm, aloitusaika, lopetusaika) {
    this.id = id;
    this.huone_id = huone_id;
    this.nimi = nimi;
    this.pvm = pvm;
    this.aloitusaika = aloitusaika;
    this.lopetusaika = lopetusaika;
  }
}

module.exports = Reservation;
