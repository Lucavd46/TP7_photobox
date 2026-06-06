import Handlebars from "handlebars";
import { resolveUri } from "./photoloader";

/**
 * Module UI : affichage d'une photo, de sa catégorie et de ses commentaires
 * dans le DOM à l'aide de templates Handlebars.
 */

/**
 * Décode de manière sécurisée les entités HTML (ex: &#39; en ').
 */
function decodeHTML(html: string): string {
  if (!html) return "";
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

/**
 * Compile et retourne le template Handlebars défini dans le HTML (#photoTemplate).
 */
function getPhotoTemplate(): ReturnType<typeof Handlebars.compile> {
  const templateEl = document.getElementById("photoTemplate");
  if (!templateEl) throw new Error("Template #photoTemplate introuvable");
  return Handlebars.compile(templateEl.innerHTML);
}

/**
 * Affiche une photo dans la section #la_photo en utilisant le template Handlebars.
 * Reçoit un objet photo tel que retourné par l'API.
 */
export function displayPicture(photo: any, links?: any): void {
  const section = document.getElementById("la_photo");
  if (!section) return;

  // Résoudre l'URL de l'image via resolveUri
  let photoUrl = "";
  if (typeof photo.url === "object" && photo.url !== null && photo.url.href) {
    photoUrl = resolveUri(photo.url.href);
  } else if (typeof photo.url === "string") {
    photoUrl = resolveUri(photo.url);
  } else if (links && links["original"]) {
    photoUrl = resolveUri(links["original"].href);
  }

  const template = getPhotoTemplate();
  section.innerHTML = template({
    ...photo,
    titre: decodeHTML(photo.titre ?? ""),
    description: decodeHTML(photo.descr ?? photo.description ?? ""),
    photoUrl: photoUrl,
  });
}

/**
 * Affiche le nom de la catégorie dans l'élément #la_categorie.
 */
export function displayCategorie(categorie: any): void {
  const el = document.getElementById("la_categorie");
  if (!el) return;
  el.textContent = `categorie : ${decodeHTML(categorie.nom ?? "N/A")}`;
}

/**
 * Affiche la liste des commentaires dans #les_commentaires.
 * Chaque commentaire est un élément <li>.
 */
export function displayCommentaires(commentaires: any[]): void {
  const ul = document.getElementById("les_commentaires");
  if (!ul) return;
  ul.innerHTML = "";
  for (const c of commentaires) {
    const li = document.createElement("li");
    const pseudo = decodeHTML(c.pseudo ?? "anonyme");
    const text = decodeHTML(c.content ?? c.titre ?? "");
    li.textContent = `${pseudo} : ${text}`;
    ul.appendChild(li);
  }
}

export default { displayPicture, displayCategorie, displayCommentaires };

