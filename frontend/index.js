window.addEventListener('DOMContentLoaded', function() {
  const navbar = document.getElementById('navbar');
  const menuBtn = document.getElementById('menuBtn');
  const Btn = document.getElementById('Btn');
  const mainDiv = document.querySelector('div[style^="margin-left"]');
  const localitatiOrase = {
  "alba-iulia": ["Centru", "Partos", "Ampoi", "Cetate", "Tolstoi", "Barabant", "Micesti", "Oarda"],
  "arad": ["Centru", "Aurel Vlaicu", "Grădiște", "Micălaca", "Gai", "Bujac", "Sânnicolau Mic", "Vladimirescu"],
  "bacau": ["Centru", "Nord", "Sud", "Serbanesti", "Gheraiesti", "Izvoare", "Letea", "Mioritei"],
  "baia-mare": ["Centru", "Valea Roșie", "Vasile Alecsandri", "Săsar", "Ferneziu", "Griviței", "Gara", "Recea"],
  "bistrita": ["Centru", "Unirea", "Subcetate", "Viisoara", "Sigmir", "Slatinita", "Ghinda"],
  "botosani": ["Centru", "Parcul Tineretului", "Cătămărăști", "Pacea", "Tudora", "Curtești"],
  "braila": ["Centru", "Viziru", "Hipodrom", "Chercea", "Obor", "Radu Negru", "Lacu Dulce"],
  "brasov": ["Centru", "Tractorul", "Răcădău", "Bartolomeu", "Noua", "Astra", "Schei", "Stupini"],
  "bucuresti": [
    "Sector 1", "Sector 2", "Sector 3", "Sector 4", "Sector 5", "Sector 6",
    "Băneasa", "Aviatorilor", "Cotroceni", "Drumul Taberei", "Militari", "Titan", "Berceni", "Colentina"
  ],
  "buzau": ["Centru", "Micro 14", "Micro 5", "Dorobanți", "Bălcescu", "Simileasca", "Broșteni"],
  "calafat": ["Centru", "Basarabi", "Ciupercenii Vechi", "Golenți"],
  "calarași": ["Centru", "Mircea Vodă", "Oborul Nou", "Măgureni", "Dumbrava", "Ostroveni"],
  "campina": ["Centru", "Slobozia", "Voila", "Câmpinița", "Turnătorie"],
  "campulung": ["Centru", "Grui", "Vișoi", "Valea Româneștilor", "Schei"],
  "cluj-napoca": ["Centru", "Mănăștur", "Gheorgheni", "Grigorescu", "Zorilor", "Bună Ziua", "Iris", "Someșeni"],
  "constanta": ["Centru", "Tomis Nord", "Tomis III", "Faleză Nord", "Inel II", "Palas", "Coiciu", "Km 4-5"],
  "craiova": ["Centru", "Rovine", "Brazda lui Novac", "Lăpuș", "Valea Roșie", "Craiovița Nouă", "Bariera Vâlcii"],
  "deva": ["Centru", "Micro 15", "Micro 16", "Micro 4", "Micro 5", "Aurel Vlaicu", "Grigorescu"],
  "drobeta-turnu-severin": ["Centru", "Crihala", "Schela", "Gura Văii", "Dudașu", "Banovița"],
  "focsani": ["Centru", "Sud", "Nord", "Obor", "Bahne", "Gara", "Mândrești"],
  "galati": ["Centru", "Mazepa", "Micro 19", "Micro 21", "Micro 40", "Țiglina", "Dunărea"],
  "giurgiu": ["Centru", "Tineretului", "Smârda", "Oinacu", "Steaua Dunării"],
  "iasi": ["Centru", "Copou", "Tătărași", "Nicolina", "Păcurari", "CUG", "Galata", "Dacia"],
  "medias": ["Centru", "Gura Câmpului", "Vitrometan", "După Zid", "Moșnei"],
  "miercurea-ciuc": ["Centru", "Szécseny", "Spicului", "Nagymező", "Harghita"],
  "oradea": ["Centru", "Rogerius", "Nufărul", "Ioșia", "Velența", "Oncea", "Episcopia"],
  "petrosani": ["Centru", "Aeroport", "Colonie", "Dâlja", "Sașa", "Livezeni"],
  "piatra-neamt": ["Centru", "Dărmănești", "Precista", "Mărăței", "Văleni", "Ciritei"],
  "pitesti": ["Centru", "Trivale", "Găvana", "Prundu", "Războieni", "Eremia Grigorescu"],
  "ploiesti": ["Centru", "Nord", "Sud", "Vest", "Malul Roșu", "Bariera București", "Mimiu"],
  "ramnicu-valcea": ["Centru", "Nord", "Ostroveni", "Traian", "Petrișor", "Căzănești"],
  "ramnicu-sarat": ["Centru", "Anghel Saligny", "Podgoria", "Bariera Focșani"],
  "reghin": ["Centru", "Apalina", "Iernuțeni", "Dedrad", "Breaza"],
  "resita": ["Centru", "Govândari", "Lunca Bârzavei", "Muncitoresc", "Dealul Crucii"],
  "roman": ["Centru", "Favorit", "Petru Rareș", "Mihai Viteazu", "Nicolae Bălcescu"],
  "rosiorii-de-vede": ["Centru", "Spitalului", "Nord", "Sud", "Est"],
  "satu-mare": ["Centru", "Micro 17", "Micro 16", "Carpați", "Soarelui", "Horea"],
  "sibiu": ["Centru", "Ștrand", "Vasile Aaron", "Hipodrom", "Turnișor", "Terezian", "Lazaret"],
  "sighetu-marmatiei": ["Centru", "Valea Cufundoasă", "Iapa", "Șugău", "Lazu Baciului"],
  "slatina": ["Centru", "Progresul", "Steaua", "Clocociov", "Cireașov"],
  "slobozia": ["Centru", "Gării Noi", "Mihai Viteazu", "Sud", "Vest"],
  "suceava": ["Centru", "Burdujeni", "Obcini", "Ițcani", "George Enescu", "Areni"],
  "targoviste": ["Centru", "Micro 6", "Micro 9", "Priseaca", "Sagricom"],
  "targu-jiu": ["Centru", "9 Mai", "Debarcader", "Griviței", "Bârsești"],
  "targu-mures": ["Centru", "Dâmbul Pietros", "Unirii", "Tudor", "Aleea Carpați", "Cornișa"],
  "targu-neamt": ["Centru", "Blebea", "Condreni", "Humulești", "Ozana"],
  "targu-secuiesc": ["Centru", "Fabricii", "Kanta", "Molnar János", "Turia"],
  "timisoara": ["Centru", "Soarelui", "Girocului", "Circumvalațiunii", "Lipovei", "Aradului", "Mehala", "Iosefin"],
  "turda": ["Centru", "Oprișani", "Micro 3", "Poiana", "Turda Nouă"],
  "turnu-magurele": ["Centru", "Odaia", "Magurele", "Combinat"],
  "urziceni": ["Centru", "Tineretului", "Sud", "Vest", "Est"],
  "vaslui": ["Centru", "Moara Grecilor", "Gara", "Rediu", "Bălteni"],
  "zalau": ["Centru", "Dumbrava Nord", "Brădet", "Porolissum", "Meseș"],
  "zarnesti": ["Centru", "Tohanu Vechi", "Tohanu Nou", "Prund", "Bălăceanca"]
};

  const orasSelect = document.getElementById('orasSelect');
  const localitateSelect = document.getElementById('localitateSelect');

  orasSelect.addEventListener('change', function() {
    const oras = this.value;
    localitateSelect.innerHTML = '<option value="">Alege localitatea</option>';
    if (localitatiOrase[oras]) {
      localitatiOrase[oras].forEach(loc => {
        const opt = document.createElement('option');
        opt.value = loc;
        opt.textContent = loc;
        localitateSelect.appendChild(opt);
      });
      localitateSelect.disabled = false;
    } else {
      localitateSelect.disabled = true;
    }
  });
  
  // Pentru filtrare, citește valorile bifate la submit:
  document.getElementById('filtersForm').addEventListener('submit', function(e) {
    // ...
    const checked = Array.from(document.querySelectorAll('input[name="localitati"]:checked')).map(cb => cb.value);
    // checked conține localitățile selectate pentru filtrare
    // ...
  });


  fetch('http://localhost:3001/api/imobile')
    .then(res => res.json())
    .then(anunturi => {
      const container = document.querySelector('.imobile-cards');
      if (!container) return;
      container.innerHTML = '';
      anunturi.forEach(card => {
        console.log(card.imagine);
        console.log(card.tranzactie);
        container.innerHTML += `
          <div class="imobil-card">
            <div class="imobil-card-img" style="background-image:url('http://localhost:3001/${card.imagine ? card.imagine : 'uploads/default.jpg'}');">
              <button class="imobil-like-btn" title="Favorite">&#10084;</button>
              <div class="imobil-card-labels">
                <div class="imobil-pret">${card.pret ? card.pret + ' €' : ''}</div>
                <div class="imobil-tip">${card.tranzactie === 'vanzare' ? 'De vânzare' : card.tranzactie === 'inchiriat' ? 'De închiriat' : ''}</div>
              </div>
            </div>
            <div class="imobil-card-body">
              <div class="imobil-titlu">${card.titlu}</div>
              <div class="imobil-locatie">
                <span class="icon-locatie">📍</span>
                ${card.locatie}
              </div>
              <div class="imobil-info">
                <span class="imobil-mp">${card.suprafata || '-'} mp</span>
                <span class="imobil-id">ID: ${card.id}</span>
              </div>
              <button class="imobil-detalii-btn">Vezi detalii</button>
            </div>
          </div>
        `;

        container.querySelectorAll('.imobil-detalii-btn').forEach((btn, idx) => {
      btn.addEventListener('click', function() {
        const cardId = anunturi[idx].id;
        window.location.href = `html/detalii.html?id=${cardId}`;
      });
    });
      });
    })
    .catch(err => {
      const container = document.querySelector('.imobile-cards');
      if (container) container.innerHTML = '<p style="color:red">Eroare la încărcarea anunțurilor!</p>';
      console.error(err);
    });



});