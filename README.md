# 🏠 REM - Real Estate Manager

**REM (Real Estate Manager)** este o aplicație web full-stack pentru gestionarea anunțurilor imobiliare, dezvoltată în cadrul facultății pentru disciplina **Tehnologii Web**.

Scopul proiectului este de a gestiona anunțuri imobiliare într-un mod modern, intuitiv și eficient, oferind utilizatorilor o experiență completă de căutare, vizualizare și administrare a proprietăților.

---

## 👨‍💻 Echipa de dezvoltare

- **Andrei Balan**  
- **Federica Ghiuzan**

---

## 🚀 Tehnologii utilizate

### Frontend
- **HTML5** - Structura semantică a paginilor
- **CSS3** - Stilizare avansată cu Flexbox, Grid și media queries
- **JavaScript (ES6+)** - Logică client-side și interactivitate
- **Responsive Design** - Compatibilitate pe toate dispozitivele

### Backend
- **Node.js** - Runtime environment pentru JavaScript
- **PostgreSql** - Baza de date relațională

### Integrări
- **Leaflet Maps** - Vizualizare interactivă a locațiilor
- **File Upload** - Sistem de încărcare imagini
- **Authentication** - Sistem de autentificare utilizatori

---

## 📱 Funcționalități principale

### 🏡 Gestionare proprietăți
- **Adăugare anunțuri** - Formulare intuitive cu validare
- **Vizualizare detalii** - Pagini dedicate pentru fiecare proprietate
- **Căutare și filtrare** - Criterii multiple de căutare
- **Galerie foto** - Upload și afișare imagini multiple

### 👤 Sistem utilizatori
- **Înregistrare și autentificare** - Conturi securizate
- **Profil personal** - Gestionare date utilizator
- **Favorite** - Salvare proprietăți preferate

### 🗺️ Localizare
- **Hartă interactivă** - Vizualizare proprietăți pe hartă
- **Căutare după locație** - Filtrare după orașe/localități
- **Coordonate GPS** - Poziționare precisă

### 📊 Interfață responsivă
- **Mobile-first** - Optimizat pentru dispozitive mobile
- **Adaptive layout** - Interfață care se adaptează la orice ecran
- **Touch-friendly** - Controale optimizate pentru touch

---

## 🏗️ Arhitectura aplicației

```
REM/
├── frontend/              # Client-side application
│   ├── index.html        # Landing page
│   ├── index.css         # Global styles
│   ├── index.js          # Main JavaScript logic
│   ├── html/             # Application pages
│   ├── css/              # Page-specific styles
│   └── js/               # Page-specific scripts
├── backend/              # Server-side application
│   ├── server.js         # Express server configuration
│   ├── package.json      # Dependencies and scripts
│   ├── config/           # Database configuration
│   ├── handlers/         # API route handlers
│   └── images/           # Uploaded images storage
└── database/             # Database setup
    ├── create-tables.sql # Database schema
    ├── drop-tables.sql   # Cleanup scripts
    └── script-populare.sql # Sample data
```

---

## 🛠️ Instalare și configurare

### Cerințe preliminare
- **Node.js** (versiunea 14+)
- **PostrgeSql** (versiunea 8.0+)
- **npm** sau **yarn**

### Pași de instalare

1. **Clonarea repository-ului**
   ```bash
   git clone <repository-url>
   cd REM
   ```

2. **Configurarea bazei de date**
   ```sql
   -- Conectează-te la PgAdmin 4 și rulează:
   source database/create-tables.sql
   source database/script-populare.sql
   ```

3. **Instalarea dependințelor backend**
   ```bash
   cd backend
   npm install
   ```

4. **Configurarea conexiunii la baza de date**
   - Editează `backend/config/database.js`
   - Actualizează credențialele PostgreSql

5. **Pornirea serverului**
   ```bash
   cd backend
   npm start
   # Serverul va rula pe http://localhost:3000
   ```

6. **Accesarea aplicației**
   - Deschide `frontend/index.html` în browser
   - Sau servește frontend-ul cu un server local (exȘ http://localhost/REM/randomaf/frontend/#html/home.html)

---

## 📚 Structura paginilor

### 🏠 **Home** (`home.html`)
- Pagina principală cu căutare și filtrare
- Grid de carduri cu proprietăți
- Sistem de paginare

### 🔍 **Detalii proprietate** (`detalii.html`)
- Informații complete despre proprietate
- Galerie foto interactivă
- Localizare pe hartă
- Buton de adăugare la favorite

### ➕ **Adăugare proprietate** (`add-imobile.html`)
- Formular complet cu validare
- Upload imagini multiple
- Selecție locație pe hartă
- Preview în timp real

### ❤️ **Favorite** (`favorites.html`)
- Lista proprietăților salvate
- Opțiuni de gestionare
- Acces rapid la detalii

### 🗺️ **Hartă** (`map.html`)
- Vizualizare toate proprietățile
- Filtrare pe hartă
- Popups informative

### 👤 **Profil** (`profile.html`)
- Informații utilizator
- Istoric activitate
- Setări cont

### 🔐 **Autentificare** (`auth.html`)
- Login și register
- Validare formulare
- Recuperare parolă

---

## 🎨 Design responsiv

### Breakpoints utilizate
- **Mobile**: `< 768px`
- **Tablet**: `768px - 1024px`
- **Desktop**: `> 1024px`

### Caracteristici responsive
- **Layout adaptiv** - Grid și Flexbox
- **Meniu hamburger** - Navigare mobilă
- **Touch gestures** - Swipe și tap
- **Optimizare imagini** - Diferite rezoluții
- **Typography scalabilă** - Unități relative

---

## 📋 API Endpoints

### Proprietăți
- `GET /api/imobile` - Lista toate proprietățile
- `GET /api/imobile/:id` - Detalii proprietate
- `POST /api/imobile` - Adaugă proprietate nouă
- `PUT /api/imobile/:id` - Actualizează proprietate
- `DELETE /api/imobile/:id` - Șterge proprietate

### Utilizatori
- `POST /api/auth/register` - Înregistrare utilizator
- `POST /api/auth/login` - Autentificare
- `GET /api/users/profile` - Profil utilizator
- `PUT /api/users/profile` - Actualizare profil

### Favorite
- `GET /api/favorites` - Lista favorite utilizator
- `POST /api/favorites` - Adaugă la favorite
- `DELETE /api/favorites/:id` - Elimină din favorite

### Imagini
- `POST /api/images/upload` - Upload imagine
- `GET /api/images/:filename` - Servire imagine

---

## 🎓 Obiective educaționale

Acest proiect demonstrează:

### **Frontend Development**
- ✅ Structuri HTML semantice
- ✅ CSS modern (Flexbox, Grid, Media Queries)
- ✅ JavaScript ES6+ și DOM manipulation
- ✅ Responsive Web Design
- ✅ User Experience (UX) principles

### **Backend Development**
- ✅ Server Node.js cu Express
- ✅ RESTful API design
- ✅ Conectivitate bază de date
- ✅ Gestionare fișiere și imagini
- ✅ Securitate și validare

### **Database Management**
- ✅ Design schema relațională
- ✅ Queries SQL complexe
- ✅ Indexare și optimizare
- ✅ Backup și recovery

### **Integration Skills**
- ✅ Frontend-Backend communication
- ✅ Third-party APIs (Maps)
- ✅ File handling și storage
- ✅ Error handling și debugging

---

## 🔍 Funcționalități avansate

### **Căutare inteligentă**
- Full-text search în descrieri
- Filtrare combinată (preț, tip, locație)
- Sortare multiplă
- Autocomplete pentru locații

### **Optimizare performanță**
- Lazy loading pentru imagini
- Paginare server-side
- Caching strategii
- Minificare assets

### **Security features**
- Input validation și sanitization
- SQL injection prevention
- File upload restrictions
- Session management

### **User experience**
- Loading states și feedback
- Error handling elegant
- Keyboard navigation
- Accessibility features

---

> **REM - Real Estate Manager** reprezintă aplicarea practică a tehnologiilor web moderne într-un context real, demonstrând competențele achiziționate în dezvoltarea aplicațiilor full-stack.

