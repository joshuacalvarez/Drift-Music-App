"use client";

export function registerDeleteConfirmation() {
  if (typeof window === "undefined") return;

  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;

    const deleteTarget = target.closest("[data-delete]");
    if (!deleteTarget) return;

    const message =
      deleteTarget.getAttribute("data-message") ||
      "Are you sure you want to delete this?";

    const ok = window.confirm(message);
    if (!ok) {
      e.preventDefault();
      e.stopPropagation();
    }
  });
}
