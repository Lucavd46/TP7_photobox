import { API_BASE } from "./config";

/**
 * Structure des liens retournés par l'API
 */
export type ApiLinks = Record<string, { href: string }>;

/**
 * Données d'une photo retournées par l'API
 */
export type PhotoData = {
  photo: {
    id: number;
    titre?: string;
    description?: string;
    type?: string;
    file?: string;
    width?: number;
    height?: number;
    url?: { href?: string } | string;
  };
  links?: ApiLinks;
  [k: string]: unknown;
};

function toErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

/**
 * Résout une URI relative (chemin serveur) en URL absolue.
 * L'API retourne des chemins comme "/www/canals5/phox/api/photos/1"
 * qui doivent être préfixés par l'origin du serveur.
 */
export function resolveUri(uri: string): string {
  if (uri.startsWith("http://") || uri.startsWith("https://")) {
    return uri;
  }
  // Extraire l'origin du serveur depuis API_BASE
  const origin = new URL(API_BASE).origin;
  return origin + (uri.startsWith("/") ? uri : `/${uri}`);
}

/**
 * Charge les données d'une photo par son identifiant.
 */
export async function loadPicture(idPicture: number | string): Promise<PhotoData> {
  const id = typeof idPicture === "string" ? Number(idPicture) : idPicture;
  if (!Number.isFinite(id) || id <= 0) {
    throw new Error(`Identifiant photo invalide: ${String(idPicture)}`);
  }

  const url = `${API_BASE}/photos/${id}`;

  let res: Response;
  try {
    res = await fetch(url, { credentials: "include" });
  } catch (e) {
    throw new Error(`Erreur réseau (fetch) : ${toErrorMessage(e)}`);
  }

  if (!res.ok) {
    const details = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText}${details ? ` - ${details}` : ""}`);
  }

  try {
    return (await res.json()) as PhotoData;
  } catch (e) {
    throw new Error(`Réponse JSON invalide : ${toErrorMessage(e)}`);
  }
}

/**
 * Charge une ressource à partir d'une URI (absolue ou relative au serveur).
 * Retourne une promesse qui se résout avec les données JSON.
 */
export async function loadResource(uri: string): Promise<any> {
  const url = resolveUri(uri);

  let res: Response;
  try {
    res = await fetch(url, { credentials: "include" });
  } catch (e) {
    throw new Error(`Erreur réseau (fetch) : ${toErrorMessage(e)}`);
  }

  if (!res.ok) {
    const details = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText}${details ? ` - ${details}` : ""}`);
  }

  try {
    return await res.json();
  } catch (e) {
    throw new Error(`Réponse JSON invalide : ${toErrorMessage(e)}`);
  }
}

export default { loadPicture, loadResource, resolveUri };
