const Room = require('../models/Room');
const Reservation = require('../models/Reservation');

class Database {
  constructor() {
    this.rooms = [
      new Room(1001, 'Kokoushuone A'),
      new Room(1002, 'Kokoushuone B'),
      new Room(1003, 'Kokoushuone C')
    ];
    this.reservations = [];
    this.nextReservationId = 1;
  }

  getRooms() {
    return this.rooms;
  }

  getRoomById(id) {
    return this.rooms.find(room => room.id === id);
  }

  addReservation(reservation) {
    reservation.id = this.nextReservationId++;
    this.reservations.push(reservation);
    return reservation;
  }

  getReservationsByRoom(roomId) {
    return this.reservations.filter(res => res.huone_id === roomId);
  }

  getReservationById(id) {
    return this.reservations.find(res => res.id === id);
  }

  cancelReservation(id) {
    const index = this.reservations.findIndex(res => res.id === id);
    if (index !== -1) {
      this.reservations.splice(index, 1);
      return true;
    }
    return false;
  }

  getAllReservations() {
    return this.reservations;
  }
}

module.exports = Database;
