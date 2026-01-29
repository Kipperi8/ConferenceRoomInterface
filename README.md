# Kokoushuoneiden varausrajapinta

Interaktiivinen Node.js-pohjainen CLI-sovellus kokoushuoneiden varausten hallintaan.

## Ominaisuudet

- **Varauksen luonti**: Varaa huone tietylle aikavälille
- **Varauksen peruutus**: Poista olemassa oleva varaus
- **Varausten katselu**: Listaa varaukset huoneittain tai kaikki kerralla

## Validoinnit

- Varaukset eivät saa mennä päällekkäin
- Varaukset eivät voi sijoittua menneisyyteen
- Aloitusaika on oltava ennen lopetusaikaa
- Varauksia voi tehdä vain arkipäiville (ma-pe)
- Varaukset on oltava klo 08:00 - 16:00 välillä
- Henkilön nimi tulee olla muodossa "etunimi sukunimi"

## Asennus

```bash
npm install
```

## Käyttö

```bash
npm start
```

Sovellus käynnistyy interaktiivisessa tilassa, jossa voit valita toimintoja valikosta.

## Päivämäärä- ja aikamuodot

- **Päivämäärä**: DD-MM-YYYY (esim. 30-01-2026)
- **Aika**: HH:mm (esim. 09:00)

## Huoneet

- Kokoushuone A (ID: 1001)
- Kokoushuone B (ID: 1002)
- Kokoushuone C (ID: 1003)

## Kansiorakenne

```
src/
├── app.js                              # Sovelluksen pääohjelma
├── commands/
│   ├── create-reservation/            # Varauksen luonti
│   │   └── createReservationCommand.js
│   ├── cancel-reservation/            # Varauksen peruutus
│   │   └── cancelReservationCommand.js
│   └── view-reservations/             # Varausten katselu
│       └── viewReservationsCommand.js
├── database/
│   └── Database.js                    # Muistinvarainen tietokanta
├── models/
│   ├── Room.js                        # Huone-luokka
│   └── Reservation.js                 # Varaus-luokka
├── validation/
│   └── ReservationValidator.js        # Varausten validointi
└── utils/
    └── DateTimeUtils.js               # Päivämäärä- ja aikafunktiot
```
