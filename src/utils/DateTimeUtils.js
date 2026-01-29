class DateTimeUtils {
  // Muuntaa DD-MM-YYYY muodosta Date-objektiksi
  static parseDate(dateString) {
    const parts = dateString.split('-');
    if (parts.length !== 3) return null;
    
    const day = parseInt(parts[0]);
    const month = parseInt(parts[1]);
    const year = parseInt(parts[2]);

    if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
    if (month < 1 || month > 12) return null;
    if (day < 1 || day > 31) return null;

    return new Date(year, month - 1, day);
  }

  // Muuntaa HH:mm muodosta minuuteiksi päivän alusta
  static parseTime(timeString) {
    const parts = timeString.split(':');
    if (parts.length !== 2) return null;

    const hours = parseInt(parts[0]);
    const minutes = parseInt(parts[1]);

    if (isNaN(hours) || isNaN(minutes)) return null;
    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) return null;

    return hours * 60 + minutes;
  }

  // Muuntaa minuutit HH:mm muotoon
  static minutesToTimeString(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
  }

  // Tarkistaa, onko päivä arkipäivä (ma-pe)
  static isWeekday(date) {
    const dayOfWeek = date.getDay();
    return dayOfWeek >= 1 && dayOfWeek <= 5;
  }

  // Tarkistaa, onko päivämäärä tulevaisuudessa tai tänään
  static isFutureOrToday(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date >= today;
  }

  // Muuntaa Date-objektin DD-MM-YYYY muotoon
  static dateToString(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
}

module.exports = DateTimeUtils;
