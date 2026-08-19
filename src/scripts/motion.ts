/**
 * Module d'animation.
 *
 * Trois règles tenues par le harnais de QA :
 *  1. la page est complète et lisible sans ce fichier ;
 *  2. `prefers-reduced-motion` court-circuite tout, dès la première ligne ;
 *  3. chaque animation se termine — une animation qui démarre sans finir
 *     laisse du contenu invisible, ce qui est pire que pas d'animation.
 *
 * Le parti d'animation vient du nom : c'est un commerce qui sert en trois
 * minutes. Les durées sont courtes et les courbes sèches. Rien ne traîne.
 *
 * Les révélations passent par IntersectionObserver et non par ScrollTrigger :
 * ce sont des déclenchements uniques, et le plugin pèse une quarantaine de
 * kilo-octets qu'un site vendant sa rapidité n'a pas à faire télécharger.
 */
import gsap from "gsap";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
    /** Passe à true quand toutes les animations déclenchées sont terminées. */
    __animationsTerminees?: boolean;
  }
}

const reduit = matchMedia("(prefers-reduced-motion: reduce)");

/** Mesure une hauteur réelle et la publie en variable CSS. */
function suivreHauteur(el: Element | null, variable: string) {
  if (!el) return;
  const publier = () => {
    const h = (el as HTMLElement).getBoundingClientRect().height;
    if (h > 0) document.documentElement.style.setProperty(variable, `${h}px`);
  };
  publier();
  new ResizeObserver(publier).observe(el);
}

// Les barres sont dimensionnées par leur contenu et bougent avec les métriques
// de police : on mesure, on ne fige pas une hauteur au pixel près.
suivreHauteur(document.querySelector("[data-barre-appel]"), "--barre-appel-h");
suivreHauteur(document.querySelector("[data-entete]"), "--entete-h");

/** Défilement vers une ancre, position absolue calculée. */
function allerVers(cible: Element) {
  const entete = document.querySelector("[data-entete]") as HTMLElement | null;
  const decalage = (entete?.getBoundingClientRect().height ?? 0) + 12;
  // `lenis.scrollTo(element)` résout par offsetTop et rate la cible dès qu'il y
  // a du scroll-margin : on calcule la position absolue nous-mêmes.
  const y = cible.getBoundingClientRect().top + window.scrollY - decalage;
  if (window.__lenis) window.__lenis.scrollTo(y, { duration: 0.6 });
  else window.scrollTo({ top: y, behavior: reduit.matches ? "auto" : "smooth" });
}

document.addEventListener("click", (e) => {
  const lien = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
  if (!lien) return;
  const id = lien.getAttribute("href")!.slice(1);
  if (!id) return;
  const cible = document.getElementById(id);
  if (!cible) return;
  e.preventDefault();
  allerVers(cible);
  history.replaceState(null, "", `#${id}`);
});

/** Menu mobile. Indépendant de GSAP : il doit marcher même sans animation. */
const bascule = document.querySelector("[data-menu-bascule]");
const panneau = document.querySelector("[data-menu-panneau]");
if (bascule && panneau) {
  const fermer = () => {
    bascule.setAttribute("aria-expanded", "false");
    panneau.setAttribute("hidden", "");
  };
  bascule.addEventListener("click", () => {
    const ouvert = bascule.getAttribute("aria-expanded") === "true";
    bascule.setAttribute("aria-expanded", String(!ouvert));
    if (ouvert) panneau.setAttribute("hidden", "");
    else panneau.removeAttribute("hidden");
  });
  panneau.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).closest("a")) fermer();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") fermer();
  });
}

if (reduit.matches) {
  // Rien d'autre. La page est déjà dans son état final.
  window.__animationsTerminees = true;
} else {
  const lenis = new Lenis({ duration: 0.9, smoothWheel: true });
  // Exposé pour que les tests pilotent la page comme un vrai geste : Lenis
  // prend le contrôle du défilement et rend `window.scrollTo` inerte.
  window.__lenis = lenis;
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  let enCours = 0;
  const demarre = () => {
    enCours++;
    window.__animationsTerminees = false;
  };
  const termine = () => {
    if (--enCours <= 0) window.__animationsTerminees = true;
  };

  /**
   * Révélations. Un observateur, un déclenchement par groupe, jamais rejoué.
   * Le filet de sécurité est dans le CSS : sans la classe .js, aucun élément
   * n'a d'état initial masqué.
   */
  const groupes = new Map<Element, Element[]>();
  for (const el of document.querySelectorAll<HTMLElement>("[data-anim]")) {
    const parent = el.closest("[data-anim-groupe]") ?? el.parentElement ?? document.body;
    if (!groupes.has(parent)) groupes.set(parent, []);
    groupes.get(parent)!.push(el);
  }

  const reveler = (parent: Element) => {
    const elements = groupes.get(parent);
    if (!elements) return;
    groupes.delete(parent);
    demarre();
    gsap.to(elements, {
      opacity: 1,
      y: 0,
      duration: 0.34,
      ease: "power4.out",
      stagger: 0.04,
      onComplete: termine,
    });
  };

  const observateur = new IntersectionObserver(
    (entrees) => {
      for (const e of entrees) {
        if (!e.isIntersecting) continue;
        observateur.unobserve(e.target);
        reveler(e.target);
      }
    },
    { rootMargin: "0px 0px -12% 0px" },
  );
  for (const parent of groupes.keys()) observateur.observe(parent);

  /** Le chrono : il compte vite, comme le comptoir. */
  const chrono = document.querySelector<HTMLElement>("[data-chrono]");
  if (chrono) {
    const secondes = Number(chrono.dataset.chrono || 180);
    const fin = `${Math.floor(secondes / 60)}:${String(secondes % 60).padStart(2, "0")}`;
    const lancer = () => {
      const etat = { v: 0 };
      demarre();
      gsap.to(etat, {
        v: secondes,
        duration: 1.1,
        ease: "power2.out",
        onUpdate() {
          const s = Math.round(etat.v);
          chrono.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
        },
        onComplete() {
          chrono.textContent = fin;
          termine();
        },
      });
    };
    const obsChrono = new IntersectionObserver(
      (entrees) => {
        if (!entrees.some((e) => e.isIntersecting)) return;
        obsChrono.disconnect();
        lancer();
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    obsChrono.observe(chrono);
  }

  /** Le hero se pose : l'image se cale, elle ne dérive pas. */
  const heroImg = document.querySelector<HTMLElement>("[data-hero-image]");
  if (heroImg) {
    demarre();
    gsap.fromTo(
      heroImg,
      { scale: 1.06 },
      { scale: 1, duration: 0.7, ease: "power3.out", onComplete: termine },
    );
  }

  if (enCours === 0) window.__animationsTerminees = true;
}
