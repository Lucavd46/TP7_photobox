import { resolveUri } from "./photoloader";

/**
 * Module gallery_ui : affichage d'une galerie de photos sous forme de vignettes.
 */

/**
 * Décode de manière sécurisée les entités HTML.
 */
function decodeHTML(html: string): string {
  if (!html) return "";
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

/**
 * Affiche une galerie de photos dans le conteneur #la_galerie.
 * Chaque vignette est un élément <figure> avec l'attribut data-photoId.
 */
export function display_galerie(galerie: any): void {
  const container = document.getElementById("la_galerie");
  if (!container) return;

  container.innerHTML = "";

  const photos = galerie.photos ?? [];
  for (const item of photos) {
    const photo = item.photo ?? item;
    const links = item.links ?? {};

    // Utiliser le thumbnail s'il existe, sinon l'original, resolved via resolveUri
    let imgSrc = "";
    if (photo.thumbnail && photo.thumbnail.href) {
      imgSrc = resolveUri(photo.thumbnail.href);
    } else if (photo.original && photo.original.href) {
      imgSrc = resolveUri(photo.original.href);
    } else if (links["thumbnail"]) {
      imgSrc = resolveUri(links["thumbnail"].href);
    } else if (links["original"]) {
      imgSrc = resolveUri(links["original"].href);
    } else if (typeof photo.url === "object" && photo.url !== null && photo.url.href) {
      imgSrc = resolveUri(photo.url.href);
    } else if (typeof photo.url === "string") {
      imgSrc = resolveUri(photo.url);
    }

    const figure = document.createElement("figure");
    figure.setAttribute("data-photoId", String(photo.id));

    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = decodeHTML(photo.titre ?? "");

    const figcaption = document.createElement("figcaption");
    figcaption.textContent = decodeHTML(photo.titre ?? "");

    figure.appendChild(img);
    figure.appendChild(figcaption);
    container.appendChild(figure);
  }

  // Activer/Désactiver les boutons de navigation en fonction des liens de pagination disponibles
  const links = galerie.links ?? {};
  const btnFirst = document.getElementById("btn_first") as HTMLButtonElement | null;
  if (btnFirst) btnFirst.disabled = !links.first;

  const btnPrev = document.getElementById("btn_prev") as HTMLButtonElement | null;
  if (btnPrev) btnPrev.disabled = !links.prev;

  const btnNext = document.getElementById("btn_next") as HTMLButtonElement | null;
  if (btnNext) btnNext.disabled = !links.next;

  const btnLast = document.getElementById("btn_last") as HTMLButtonElement | null;
  if (btnLast) btnLast.disabled = !links.last;
}

export default { display_galerie };

