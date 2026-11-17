# Kota Radja Dinteloord — website

Een statische, single-page website voor Chinees-Indisch restaurant Kota Radja in Dinteloord.

## Lokaal bekijken

Open `index.html` direct in de browser, of start een lokale server:

```bash
python3 -m http.server 8000
```

Ga daarna naar <http://localhost:8000>.

## Publiceren

Upload de volledige map naar een statische hostingomgeving. Er is geen buildstap, database of server-side code nodig.

Belangrijk bij publicatie:

1. **Domein:** de canonical, Open Graph-URL's, structured data, `robots.txt` en `sitemap.xml` gaan uit van `https://kotaradjadinteloord.nl/`. Pas deze aan als de site op een ander domein komt.
2. **HTTPS:** publiceer bij voorkeur op HTTPS en laat `http://` en `www.` doorverwijzen naar één canonical URL.
3. **Google Search Console:** verifieer het domein, dien `https://kotaradjadinteloord.nl/sitemap.xml` in en vraag indexering aan voor de homepage.
4. **Google Bedrijfsprofiel:** houd naam, adres, telefoonnummer en openingstijden daar exact gelijk aan de website (NAP-consistentie).
5. **Controleer na livegang:** test de pagina met de Rich Results Test en de URL Inspection-tool van Google.

## Inbegrepen voor vindbaarheid

- Unieke Nederlandse title en meta description
- Canonical, `hreflang`, robots- en Open Graph/Twitter-metadata
- Restaurant-structured data (adres, telefoon, openingstijden, menu)
- Semantische HTML met één H1 en duidelijke koppenstructuur
- `robots.txt` en `sitemap.xml` (inclusief menu-afbeeldingen)
- Mobielvriendelijke, snelle self-hosted fonts en geoptimaliseerde WebP-afbeeldingen
- Toegankelijke navigatie, skip-link, focusstijlen en een native menu-dialoog

## Bestanden

- `index.html` — inhoud en structured data
- `styles.css` — vormgeving en responsive layout
- `script.js` — openingsstatus, navigatie, menu-dialoog en animaties
- `assets/images/` — menukaart- en kaartafbeeldingen
- `assets/menukaart-kota-radja.pdf` — downloadbare menukaart
- `robots.txt`, `sitemap.xml`, `site.webmanifest` — technische SEO en app-metadata

## Beeldmateriaal

Geen stockfoto's. De site gebruikt alleen de originele menukaartafbeeldingen en het OpenStreetMap-kaartbeeld.
