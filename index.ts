import photoloader from "./lib/photoloader";
import { DEFAULT_PHOTO_ID } from "./lib/config";
import ui from "./lib/ui";
import gallery from "./lib/gallery";
import { display_galerie } from "./lib/gallery_ui";

/**
 * Charge la catégorie d'une photo à partir de ses liens.
 * Retourne une promesse qui se résout avec les données de la catégorie.
 */
async function loadPhotoCategorie(data: any): Promise<any> {
  if (!data.links || !data.links["categorie"]) {
    throw new Error("Pas de lien catégorie disponible");
  }
  return photoloader.loadResource(data.links["categorie"].href);
}

/**
 * Charge les commentaires d'une photo à partir de ses liens.
 * Retourne une promesse qui se résout avec les données des commentaires.
 */
async function loadPhotoCommentaires(data: any): Promise<any> {
  if (!data.links || !data.links["comments"]) {
    throw new Error("Pas de lien commentaires disponible");
  }
  return photoloader.loadResource(data.links["comments"].href);
}

/**
 * Récupère une photo, l'affiche dans le DOM avec sa catégorie et ses commentaires.
 */
async function getPicture(id: number | string): Promise<void> {
  const h1 = document.querySelector("h1");
  if (h1) h1.textContent = `Photo : ${id}`;

  try {
    const data = await photoloader.loadPicture(id);
    const photo = data.photo;

    // Étape 2 : afficher la photo dans le DOM (Handlebars)
    ui.displayPicture(photo, data.links);

    // Étape 3a : charger et afficher la catégorie
    try {
      const catData = await loadPhotoCategorie(data);
      ui.displayCategorie(catData.categorie);
    } catch (e) {
      console.error("Erreur chargement catégorie :", e);
    }

    // Étape 3f : charger et afficher les commentaires
    try {
      const comData = await loadPhotoCommentaires(data);
      ui.displayCommentaires(comData.comments ?? []);
    } catch (e) {
      console.error("Erreur chargement commentaires :", e);
    }
  } catch (e) {
    console.error("Erreur lors du chargement de la photo :", e);
  }
}

/** Retourne l'ID de photo à partir du hash courant, ou la valeur par défaut */
function getIdFromHash(): string {
  return window.location.hash ? window.location.hash.substring(1) : DEFAULT_PHOTO_ID;
}

// ===== Chargement initial de la photo =====
getPicture(getIdFromHash());

// Rechargement automatique si le hash change
window.addEventListener("hashchange", () => {
  getPicture(getIdFromHash());
});

// ===== Exercice 2 & 3 : Galerie =====

/** Charge et affiche une galerie */
async function loadAndDisplayGallery(action: () => Promise<any>): Promise<void> {
  try {
    const g = await action();
    display_galerie(g);
  } catch (e) {
    console.error("Erreur galerie :", e);
  }
}

// Bouton charger la galerie
const btnGalerie = document.getElementById("btn_galerie");
if (btnGalerie) {
  btnGalerie.addEventListener("click", () => loadAndDisplayGallery(() => gallery.load()));
}

// Boutons de navigation
const btnNext = document.getElementById("btn_next");
if (btnNext) btnNext.addEventListener("click", () => loadAndDisplayGallery(() => gallery.next()));

const btnPrev = document.getElementById("btn_prev");
if (btnPrev) btnPrev.addEventListener("click", () => loadAndDisplayGallery(() => gallery.prev()));

const btnFirst = document.getElementById("btn_first");
if (btnFirst) btnFirst.addEventListener("click", () => loadAndDisplayGallery(() => gallery.first()));

const btnLast = document.getElementById("btn_last");
if (btnLast) btnLast.addEventListener("click", () => loadAndDisplayGallery(() => gallery.last()));

// Clic sur une vignette → afficher la photo correspondante
const galerieContainer = document.getElementById("la_galerie");
if (galerieContainer) {
  galerieContainer.addEventListener("click", (e: Event) => {
    const target = e.target as HTMLElement;
    const figure = target.closest("figure[data-photoId]") as HTMLElement | null;
    if (figure) {
      const photoId = figure.getAttribute("data-photoId");
      if (photoId) {
        window.location.hash = `#${photoId}`;
      }
    }
  });
}
