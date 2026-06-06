import photoloader from "./photoloader";
import { API_BASE } from "./config";

/**
 * Module gallery : chargement et pagination des galeries de photos.
 */

type GalleryLinks = {
  next?: { href: string };
  prev?: { href: string };
  first?: { href: string };
  last?: { href: string };
  [k: string]: { href: string } | undefined;
};

export type GalleryData = {
  photos: any[];
  links: GalleryLinks;
  count?: number;
  size?: number;
};

/** Données de la galerie courante */
let currentGallery: GalleryData = { photos: [], links: {} };

/**
 * Charge une page de galerie depuis une URI et stocke les données.
 */
async function loadFromUri(uri: string): Promise<GalleryData> {
  const data = await photoloader.loadResource(uri);
  currentGallery = {
    photos: data.photos ?? [],
    links: data.links ?? {},
    count: data.count,
    size: data.size,
  };
  return currentGallery;
}

/**
 * Charge la galerie initiale (première page de photos).
 * Si aucune URI n'est fournie, utilise le point d'entrée par défaut de l'API.
 */
export async function load(uri?: string): Promise<GalleryData> {
  return loadFromUri(uri ?? `${API_BASE}/photos`);
}

/**
 * Charge la page suivante de la galerie.
 */
export async function next(): Promise<GalleryData> {
  if (!currentGallery.links.next) throw new Error("Pas de page suivante");
  return loadFromUri(currentGallery.links.next.href);
}

/**
 * Charge la page précédente de la galerie.
 */
export async function prev(): Promise<GalleryData> {
  if (!currentGallery.links.prev) throw new Error("Pas de page précédente");
  return loadFromUri(currentGallery.links.prev.href);
}

/**
 * Charge la première page de la galerie.
 */
export async function first(): Promise<GalleryData> {
  if (!currentGallery.links.first) throw new Error("Pas de première page");
  return loadFromUri(currentGallery.links.first.href);
}

/**
 * Charge la dernière page de la galerie.
 */
export async function last(): Promise<GalleryData> {
  if (!currentGallery.links.last) throw new Error("Pas de dernière page");
  return loadFromUri(currentGallery.links.last.href);
}

export default { load, next, prev, first, last };
