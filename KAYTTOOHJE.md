# Käyttöohje - Kokoushuoneiden varausrajapinta

## Sovelluksen käynnistäminen

```bash
npm start
```

Sovellus käynnistyy päävalikolla, jossa näet neljä vaihtoehtoa.

## Päävalikko

```
╔════════════════════════════════════════╗
║  Kokoushuoneiden varausrajapinta      ║
╠════════════════════════════════════════╣
║  1. Luo varaus                         ║
║  2. Peruuta varaus                     ║
║  3. Katso varaukset                    ║
║  4. Lopeta sovellus                    ║
╚════════════════════════════════════════╝
```

## 1. Luo varaus (Vaihtoehto 1)

Valitsemalla vaihtoehdon 1 pääset luomaan uuden varauksen.

### Syöttöjärjestys:

1. **Huoneen ID**: Syötä huoneen tunnistenumero
   - 1001: Kokoushuone A
   - 1002: Kokoushuone B
   - 1003: Kokoushuone C

2. **Henkilön nimi**: Syötä etunimi ja sukunimi välilyönnillä erotettuna
   - Esimerkki: `Matti Meikäläinen`
   - Esimerkki: `Liisa Laineen`

3. **Päivämäärä**: Syötä päivämäärä muodossa DD-MM-YYYY
   - Esimerkki: `30-01-2026`

4. **Aloitusaika**: Syötä kellonaika muodossa HH:mm
   - Esimerkki: `09:00`

5. **Lopetusaika**: Syötä kellonaika muodossa HH:mm
   - Esimerkki: `11:00`

### Validoinnit:

Sovellus tarkistaa seuraavat ehdot:

- ✅ Huone on olemassa
- ✅ Nimi on "etunimi sukunimi" -muodossa
- ✅ Päivämäärä on kelvollinen (DD-MM-YYYY)
- ✅ Varaus on tulevaisuudessa tai tänään
- ✅ Päivä on arkipäivä (ma-pe)
- ✅ Aloitusaika on ennen lopetusaikaa
- ✅ Varaus alkaa klo 08:00 tai myöhemmin
- ✅ Varaus päättyy klo 16:00 tai aikaisemmin
- ✅ Huone ei ole varattu samaan aikaan

### Esimerkkisyöttö:

```
Saatavilla olevat huoneet:
  1001: Kokoushuone A
  1002: Kokoushuone B
  1003: Kokoushuone C

Syötä huoneen ID: 1001
Syötä henkilön nimi (etunimi sukunimi): Matti Meikäläinen
Syötä päivämäärä (DD-MM-YYYY): 30-01-2026
Syötä aloitusaika (HH:mm): 09:00
Syötä lopetusaika (HH:mm): 11:00

✅ Varaus luotu onnistuneesti!
   Varaus ID: 1
   Huone: Kokoushuone A
   Henkilö: Matti Meikäläinen
   Päivämäärä: 30-01-2026
   Aika: 09:00 - 11:00
```

## 2. Peruuta varaus (Vaihtoehto 2)

Valitsemalla vaihtoehdon 2 pääset peruuttamaan olemassa olevan varauksen.

### Prosessi:

1. Sovellus näyttää kaikki olemassa olevat varaukset
2. Syötä peruutettavan varauksen ID

### Esimerkkisyöttö:

```
Olemassa olevat varaukset:
  ID: 1 | Kokoushuone A | Matti Meikäläinen | 30-01-2026 09:00-11:00
  ID: 2 | Kokoushuone B | Liisa Laineen | 30-01-2026 14:00-15:30

Syötä peruutettavan varauksen ID: 1

✅ Varaus peruutettu onnistuneesti!
   Varaus ID: 1
   Huone: Kokoushuone A
   Henkilö: Matti Meikäläinen
   Päivämäärä: 30-01-2026
   Aika: 09:00 - 11:00
```

## 3. Katso varaukset (Vaihtoehto 3)

Valitsemalla vaihtoehdon 3 pääset katsomaan varauksia.

### Vaihtoehdot:

1. **Tietyn huoneen varaukset**: Syötä huoneen ID
2. **Kaikki varaukset**: Paina Enter (tyhjä syöttö)

### Esimerkkisyöttö - Huoneittain:

```
Saatavilla olevat huoneet:
  1001: Kokoushuone A
  1002: Kokoushuone B
  1003: Kokoushuone C

Syötä huoneen ID (tai paina Enter nähdäksesi kaikki varaukset): 1001

--- Kokoushuone A varaukset ---

ID: 1   | 30-01-2026 | 09:00 - 11:00 | Kokoushuone A | Matti Meikäläinen
ID: 3   | 31-01-2026 | 10:00 - 12:00 | Kokoushuone A | John Smith
```

### Esimerkkisyöttö - Kaikki varaukset:

```
Saatavilla olevat huoneet:
  1001: Kokoushuone A
  1002: Kokoushuone B
  1003: Kokoushuone C

Syötä huoneen ID (tai paina Enter nähdäksesi kaikki varaukset): 

--- Kaikki varaukset ---

ID: 1   | 30-01-2026 | 09:00 - 11:00 | Kokoushuone A | Matti Meikäläinen
ID: 2   | 30-01-2026 | 14:00 - 15:30 | Kokoushuone B | Liisa Laineen
ID: 3   | 31-01-2026 | 10:00 - 12:00 | Kokoushuone A | John Smith
```

## 4. Lopeta sovellus (Vaihtoehto 4)

Valitsemalla vaihtoehdon 4 suljet sovelluksen.

```
Ohjelmasta poistutaan. Arvoisa näkemiin!
```

## Virheviestit

### Huone on jo varattu

```
❌ Virhe: Huone on jo varattu välille 10:00 - 11:00.
```

**Ratkaisu**: Valitse eri aika tai eri huone.

### Varaus menneisyydessä

```
❌ Virhe: Varaus ei voi sijoittua menneisyyteen.
```

**Ratkaisu**: Valitse tulevaisuuden päivämäärä.

### Viikonloppu

```
❌ Virhe: Varauksia voi tehdä vain arkipäiville (ma-pe).
```

**Ratkaisu**: Valitse arkipäivä (maanantai-perjantai).

### Aukioloaikojen ulkopuolella

```
❌ Virhe: Varaus ei voi alkaa ennen klo 08:00.
❌ Virhe: Varaus ei voi loppua klo 16:00 jälkeen.
```

**Ratkaisu**: Valitse aika klo 08:00 - 16:00 välillä.

### Virheellinen nimi

```
❌ Virhe: Henkilön nimi tulee olla muodossa "etunimi sukunimi".
```

**Ratkaisu**: Syötä sekä etunimi että sukunimi.

## Testaaminen

Sovelluksesta löytyy testiskriptejä kehitystä ja validointia varten:

### Yksikkötestit

```bash
node test.js
```

Testaa kaikki validoinnit yksittäin.

### Integraatiotestit

```bash
node integration-test.js
```

Testaa realistisia käyttäjäskenaarioita.

## Kansiorakenne

```
ConferenceRoomInterface/
├── package.json
├── README.md
├── KAYTTOOHJE.md
├── src/
│   ├── app.js                          # Pääohjelma
│   ├── database/
│   │   └── Database.js                 # Muistinvarainen tietokanta
│   ├── models/
│   │   ├── Room.js                     # Huone-malli
│   │   └── Reservation.js              # Varaus-malli
│   ├── commands/
│   │   ├── create-reservation/
│   │   │   └── createReservationCommand.js
│   │   ├── cancel-reservation/
│   │   │   └── cancelReservationCommand.js
│   │   └── view-reservations/
│   │       └── viewReservationsCommand.js
│   ├── validation/
│   │   └── ReservationValidator.js     # Varausten validointi
│   └── utils/
│       └── DateTimeUtils.js            # Päivämäärä- ja aikafunktiot
├── test.js                             # Yksikkötestit
└── integration-test.js                 # Integraatiotestit
```
