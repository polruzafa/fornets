import { useMemo, useState } from "react";

import type { Stove } from "@/schemas";

export type StoveFilter = {
  query: string;
  setQuery: (q: string) => void;
  brand: string | null;
  setBrand: (b: string | null) => void;
  brands: string[];
  results: Stove[];
};

/** Cerca per text (nom/marca/notes) + filtre per marca. Lògica reutilitzable. */
export function useStoveFilter(stoves: Stove[]): StoveFilter {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState<string | null>(null);

  const brands = useMemo(
    () => [...new Set(stoves.map((h) => h.brand))].sort((a, b) => a.localeCompare(b)),
    [stoves],
  );

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return stoves.filter((h) => {
      const matchesBrand = brand === null || h.brand === brand;
      if (!matchesBrand) return false;
      if (q === "") return true;
      return (
        h.name.toLowerCase().includes(q) ||
        h.brand.toLowerCase().includes(q) ||
        h.notes.toLowerCase().includes(q)
      );
    });
  }, [stoves, query, brand]);

  return { query, setQuery, brand, setBrand, brands, results };
}
