import { useColorScheme } from "react-native";

/**
 * Sistema de temes propi (sense Tailwind/NativeWind).
 *
 * - `palette`: escales de color crues (verd de marca, brasa, slate…).
 * - `lightColors` / `darkColors`: tokens semàntics per mode.
 * - `spacing` / `radius` / `fontSize` / `fontWeight`: escales reutilitzables.
 * - `useTheme()`: retorna els colors actius segons el tema del sistema.
 */

// Escales crues. Verd de bosc (marca) + taronja brasa (accent de foc) + neutres slate.
export const palette = {
  brand: {
    50: "#eff6f0",
    100: "#d8e9da",
    200: "#b3d3b8",
    300: "#84b78d",
    400: "#54985f",
    500: "#357a42",
    600: "#2a6235",
    700: "#234e2b",
    800: "#1e3f25",
    900: "#19341f",
  },
  ember: {
    50: "#fff7ed",
    100: "#ffedd4",
    200: "#fed6a8",
    300: "#fdb871",
    400: "#fb8f38",
    500: "#f97316",
    600: "#e35c0b",
    700: "#bc440c",
    800: "#953711",
    900: "#783012",
  },
  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617",
  },
  red: { 500: "#ef4444", 600: "#dc2626", 700: "#b91c1c" },
  white: "#ffffff",
} as const;

const { brand, ember, slate, red, white } = palette;

// Tokens semàntics — mode clar.
export const lightColors = {
  bg: slate[50],
  surface: white,
  surfaceMuted: slate[100],
  border: slate[200],
  borderStrong: slate[300],

  text: slate[900],
  textStrong: slate[700],
  textSecondary: slate[500],
  textFaint: slate[400],
  placeholder: slate[400],

  brand: brand[600],
  brandActive: brand[700],
  brandText: brand[600],
  brandIcon: brand[500],
  brandSurface: brand[50],
  onBrand: white,

  ember: ember[500],

  danger: red[500],
  dangerBg: red[600],
  dangerActive: red[700],
  onDanger: white,

  tabActive: brand[500],
  tabInactive: slate[400],
};

export type ThemeColors = Record<keyof typeof lightColors, string>;

// Tokens semàntics — mode fosc (prioritari).
export const darkColors: ThemeColors = {
  bg: slate[950],
  surface: slate[900],
  surfaceMuted: slate[800],
  border: slate[800],
  borderStrong: slate[700],

  text: slate[100],
  textStrong: slate[300],
  textSecondary: slate[400],
  textFaint: slate[500],
  placeholder: slate[400],

  brand: brand[600],
  brandActive: brand[700],
  brandText: brand[400],
  brandIcon: brand[500],
  brandSurface: brand[900],
  onBrand: white,

  ember: ember[500],

  danger: red[500],
  dangerBg: red[600],
  dangerActive: red[700],
  onDanger: white,

  tabActive: brand[500],
  tabInactive: slate[500],
};

// Escala d'espaiat (px). Equivalent a la de Tailwind que fèiem servir.
export const spacing = {
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  12: 48,
  16: 64,
  28: 112,
  32: 128,
} as const;

export const radius = {
  xl: 12,
  "2xl": 16,
  "3xl": 24,
  full: 9999,
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  "2xl": 24,
  "3xl": 30,
} as const;

export const fontWeight = {
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

/** Tema actiu segons l'esquema de color del sistema (clar/fosc automàtic). */
export function useTheme() {
  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  return { isDark, colors: isDark ? darkColors : lightColors };
}
