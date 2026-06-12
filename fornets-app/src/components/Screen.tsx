import { type Edge, SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@/theme";

type Props = {
  children: React.ReactNode;
  edges?: readonly Edge[];
};

/** Contenidor base amb fons adaptatiu (light/dark) i àrees segures. */
export function Screen({ children, edges = ["top"] }: Props) {
  const { colors } = useTheme();
  return (
    <SafeAreaView edges={edges} style={{ flex: 1, backgroundColor: colors.bg }}>
      {children}
    </SafeAreaView>
  );
}
