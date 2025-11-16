// src/lib/ui.ts

// Smooth scroll to top
export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Lock body scroll when modal opens
export function modalOpen() {
  document.body.style.overflow = "hidden";
}

// Unlock scroll when modal closes
export function modalClose() {
  document.body.style.overflow = "";
}

// Legacy helper (still works)
export function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

// ⚠ REQUIRED by many components (Table, Tag, pages...)
// Tailwind-style utility for merging classes.
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
