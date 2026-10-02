'use client';
import { useEffect, type RefObject } from 'react';

export function useDialogFocus(open: boolean, ref: RefObject<HTMLElement>, modal = true) {
  useEffect(() => {
    if (!open || !ref.current) return;
    const previous = document.activeElement as HTMLElement | null;
    const root = ref.current;
    const elements = () => Array.from(root.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea, [tabindex="0"]'))
      .filter(el => !el.hasAttribute('disabled') && el.getClientRects().length > 0);
    elements()[0]?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (!modal || event.key !== 'Tab') return;
      const focusable = elements();
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || !root.contains(document.activeElement))) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !root.contains(document.activeElement))) {
        event.preventDefault(); first?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); previous?.focus(); };
  }, [open, ref, modal]);
}
