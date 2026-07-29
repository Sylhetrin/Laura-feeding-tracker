# 🍼 Laura — Śledzenie karmień

Prosta aplikacja PWA do monitorowania karmienia niemowlęcia mlekiem modyfikowanym,
zaprojektowana do obsługi jedną ręką podczas karmienia. Dodanie karmienia zajmuje
maksymalnie dwa kliknięcia. Działa offline, dane trzymane są wyłącznie lokalnie na
urządzeniu (`localStorage`) — bez backendu, bez konta, bez wysyłania danych gdziekolwiek.

## Ważna uwaga o WHO

Ustawiony w aplikacji odstęp między karmieniami (domyślnie 3h) to **plan wybrany przez
rodziców** — nie oficjalny harmonogram WHO. WHO zaleca przede wszystkim karmienie zgodnie
z sygnałami głodu dziecka (*responsive feeding*). Ekran "Informacje" w aplikacji wyjaśnia
to wprost i linkuje do oficjalnych zaleceń WHO. Ostrzeżenia w aplikacji to przypomnienia,
nie diagnoza medyczna — w razie wątpliwości skonsultuj się z pediatrą lub położną.

## Stos technologiczny

- React 19 + TypeScript (strict mode)
- Vite
- Tailwind CSS v4
- Recharts (wykres 24h)
- React Router (HashRouter — kompatybilny z GitHub Pages)
- `vite-plugin-pwa` (offline, instalacja na ekranie głównym)
- ESLint + Prettier
- Dane w `localStorage`, eksport/import CSV

## Funkcje

- **Ekran główny** — ostatnie karmienie, licznik do następnego (radialny "ring" jak
  w Apple Health, zmienia kolor z niebieskiego na czerwony po przekroczeniu czasu),
  duży przycisk "Nakarmiono", szybkie "Powtórz ostatnie karmienie" (1 kliknięcie).
- **Dodawanie karmienia** — siatka porcji 50–200 ml (+5/−5), domyślnie 120 ml, zapis
  w 2 kliknięciach, opcjonalne znaczniki (odbiła / ulewała / zasnęła / niedokończona).
- **Historia** — lista karmień z edycją i usuwaniem, pogrupowana wg dnia.
- **Wykres 24h** — plan rodziców (niebieska linia) vs. rzeczywiste karmienia (różowa),
  przewijany poziomo na telefonie.
- **Statystyki** — liczba karmień dzisiaj, suma ml, średnia porcja, najdłuższa/najkrótsza
  przerwa, średni odstęp.
- **Ustawienia** — imię dziecka, domyślna porcja/odstęp, motyw jasny/ciemny/auto, format
  czasu 24h/12h, kolory wykresu, eksport/import CSV, czyszczenie historii.
- **Tryb ciemny i jasny**, responsywny układ pionowy/poziomy.

## Uruchomienie lokalne

Wymagany [Node.js](https://nodejs.org/) 20+.

```bash
npm install
npm run dev
```

Aplikacja będzie dostępna pod `http://localhost:5173`.

Inne przydatne komendy:

```bash
npm run build     # build produkcyjny do ./dist
npm run preview   # podgląd builda produkcyjnego lokalnie
npm run lint      # ESLint
npm run format    # Prettier — formatuje cały projekt
```

## Wdrożenie na GitHub Pages

Projekt zawiera gotowy workflow GitHub Actions (`.github/workflows/deploy.yml`), który
automatycznie buduje i publikuje aplikację po każdym pushu do gałęzi `main`.

### Jednorazowa konfiguracja repozytorium

1. Utwórz nowe repozytorium na GitHub i wypchnij do niego ten projekt:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<twoja-nazwa>/<nazwa-repo>.git
   git push -u origin main
   ```

2. W repozytorium na GitHub wejdź w **Settings → Pages**.
3. W sekcji **Build and deployment** ustaw **Source** na **GitHub Actions**.
4. Wypchnij dowolną zmianę do `main` (albo uruchom workflow ręcznie w zakładce
   **Actions → Deploy to GitHub Pages → Run workflow**) — aplikacja pojawi się pod adresem
   `https://<twoja-nazwa>.github.io/<nazwa-repo>/`.

Konfiguracja Vite (`base: './'`) używa ścieżek względnych, więc działa niezależnie od
nazwy repozytorium — nie trzeba niczego ręcznie dostosowywać.

### Instalacja na telefonie

Po otwarciu opublikowanego adresu w przeglądarce telefonu:

- **iOS (Safari):** przycisk Udostępnij → *Dodaj do ekranu początkowego*.
- **Android (Chrome):** menu (⋮) → *Dodaj do ekranu głównego* / *Zainstaluj aplikację*.

Od tego momentu aplikacja działa jak natywna, również offline.

## Struktura projektu

```
src/
  components/     # RingCountdown (licznik), BottomNav
  context/        # AppState — stan globalny + localStorage
  screens/        # Ekrany: Home, AddFeeding, History, Chart, Stats, Settings, Info
  utils/          # time.ts, stats.ts, storage.ts
  types.ts        # Typy Feeding, Settings
public/
  icons/          # Ikony PWA
.github/workflows/
  deploy.yml      # Automatyczny deploy na GitHub Pages
```

## Dane i prywatność

Wszystkie dane (karmienia, ustawienia) są przechowywane wyłącznie w `localStorage`
przeglądarki na urządzeniu. Nic nie jest wysyłane na żaden serwer. Eksport/import CSV
w Ustawieniach pozwala na ręczne tworzenie kopii zapasowej lub przenoszenie danych
między urządzeniami.
