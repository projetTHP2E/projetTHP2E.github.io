// Données intégrées (basées sur vos fichiers CSV)
const DATA = {
  energie: {
    facteurEmission: 0.0324, // kgCO2/kWh
    consoDefaut: 4278 // kWh/an
  },
  materiaux: {
    'acier': { facteur: 2210, distance: 600 },
    'bois': { facteur: 40, distance: 1100 },
    'béton': { facteur: 695, distance: 200 },
    'verre': { facteur: 1528, distance: 500 }
  },
  transport: {
    facteur: 0.186 // kgCO2e/km (valeur de votre CSV Transport)
  }
};

let compteur = 0;

/**
 * Ajoute une nouvelle ligne de matériau au formulaire
 */
function ajouterLigne() {
  compteur++;
  const container = document.getElementById("materiauxContainer");
  
  const ligne = document.createElement("div");
  ligne.className = "ligne-materiau";
  ligne.innerHTML = `
    <div class="materiau-header">
      <div class="materiau-number">Matériau #${compteur}</div>
      <button type="button" class="remove-button" title="Supprimer ce matériau">×</button>
    </div>
    <div class="materiau-inputs">
      <div class="input-group">
        <label>Type de matériau</label>
        <select name="materiau" required>
          <option value="">-- Choisir un matériau --</option>
          ${Object.keys(DATA.materiaux).map(m => 
            `<option value="${m}">${m.charAt(0).toUpperCase() + m.slice(1)}</option>`
          ).join("")}
        </select>
      </div>
      <div class="input-group">
        <label>
          Masse (kg)
          <div class="tooltip-icon" data-tooltip="Indiquez la masse en kilogrammes du matériau utilisé">?</div>
        </label>
        <input type="number" name="masse" placeholder="0" required min="0" step="0.01">
      </div>
      <div class="input-group">
        <label>
          Distance (km)
          <div class="tooltip-icon" data-tooltip="Distance de transport du matériau. Si vide, la distance de référence sera utilisée">?</div>
        </label>
        <input type="number" name="distance" placeholder="Auto" min="0" step="0.1">
      </div>
    </div>
  `;
  
  container.appendChild(ligne);
  
  // Ajouter l'événement de suppression au nouveau bouton
  const removeBtn = ligne.querySelector('.remove-button');
  removeBtn.addEventListener('click', function() {
    supprimerLigne(this);
  });
}

/**
 * Supprime une ligne de matériau
 */
function supprimerLigne(button) {
  const ligne = button.closest('.ligne-materiau');
  ligne.remove();
  
  // Réorganiser les numéros des matériaux restants
  reorganiserNumeros();
}

/**
 * Réorganise les numéros des matériaux après suppression
 */
function reorganiserNumeros() {
  const lignes = document.querySelectorAll('.ligne-materiau');
  lignes.forEach((ligne, index) => {
    const numeroElement = ligne.querySelector('.materiau-number');
    numeroElement.textContent = `Matériau #${index + 1}`;
  });
  compteur = lignes.length;
}

/**
 * Calcule les émissions de CO2 basées sur les données du formulaire
 */
function calculerEmissions() {
  // Calcul de la consommation énergétique
  const consoInput = parseFloat(document.getElementById('conso').value);
  const conso = isNaN(consoInput) || consoInput === 0 ? DATA.energie.consoDefaut : consoInput;
  let totalCO2 = conso * DATA.energie.facteurEmission;

  let detailsCalcul = {
    energie: {
      consommation: conso,
      emission: conso * DATA.energie.facteurEmission
    },
    materiaux: [],
    total: 0
  };

  // Calcul des matériaux
  const lignes = document.querySelectorAll(".ligne-materiau");
  lignes.forEach((ligne, index) => {
    const materiau = ligne.querySelector("select[name='materiau']").value.toLowerCase();
    const masse = parseFloat(ligne.querySelector("input[name='masse']").value) || 0;
    const distanceInput = parseFloat(ligne.querySelector("input[name='distance']").value);
    
    if (materiau && DATA.materiaux[materiau] && masse > 0) {
      const data = DATA.materiaux[materiau];
      const distance = isNaN(distanceInput) ? data.distance : distanceInput;
      const masseTonne = masse / 1000;
      
      // Émission du matériau + transport
      const emissionMateriau = masseTonne * data.facteur;
      const emissionTransport = distance * DATA.transport.facteur * masseTonne;
      const emissionTotale = emissionMateriau + emissionTransport;
      
      totalCO2 += emissionTotale;
      
      // Stocker les détails pour debug si nécessaire
      detailsCalcul.materiaux.push({
        nom: materiau,
        masse: masse,
        distance: distance,
        emissionMateriau: emissionMateriau,
        emissionTransport: emissionTransport,
        emissionTotale: emissionTotale
      });
    }
  });

  detailsCalcul.total = totalCO2;
  return detailsCalcul;
}

/**
 * Affiche le résultat du calcul
 */
function afficherResultat(resultat) {
  document.getElementById("resultatValue").textContent = resultat.total.toFixed(2);
  document.getElementById("resultatSection").style.display = "block";
  document.getElementById("emptyState").style.display = "none";

  // Scroll fluide vers le résultat
  document.getElementById("resultatSection").scrollIntoView({ 
    behavior: "smooth",
    block: "center"
  });
}

/**
 * Valide les données du formulaire
 */
function validerFormulaire() {
  const lignes = document.querySelectorAll(".ligne-materiau");
  let erreurs = [];

  lignes.forEach((ligne, index) => {
    const materiau = ligne.querySelector("select[name='materiau']").value;
    const masse = ligne.querySelector("input[name='masse']").value;
    
    if (!materiau) {
      erreurs.push(`Matériau #${index + 1}: Veuillez sélectionner un type de matériau`);
    }
    
    if (!masse || parseFloat(masse) <= 0) {
      erreurs.push(`Matériau #${index + 1}: Veuillez indiquer une masse valide`);
    }
  });

  if (erreurs.length > 0) {
    alert("Erreurs de validation:\n" + erreurs.join("\n"));
    return false;
  }

  return true;
}

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", function() {
  // Ajouter une première ligne par défaut
  ajouterLigne();

  // Gestionnaire pour le bouton d'ajout de matériau
  document.getElementById("addMaterialBtn").addEventListener("click", ajouterLigne);

  // Gestionnaire de soumission du formulaire
  document.getElementById("ecoForm").addEventListener("submit", function(e) {
    e.preventDefault();

    // Validation
    if (!validerFormulaire()) {
      return;
    }

    // Calcul des émissions
    const resultat = calculerEmissions();
    
    // Affichage du résultat
    afficherResultat(resultat);
    
    // Log pour debug (optionnel)
    console.log("Détails du calcul:", resultat);
  });
});