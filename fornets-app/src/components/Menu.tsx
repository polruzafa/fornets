import { Ionicons } from "@expo/vector-icons";
import { Fragment, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { fontSize, fontWeight, radius, spacing, useTheme } from "@/theme";

export type MenuItem = {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  destructive?: boolean;
  onPress: () => void;
};

type Props = {
  items: MenuItem[];
  /** Icona del disparador (per defecte, els tres punts). */
  icon?: keyof typeof Ionicons.glyphMap;
  accessibilityLabel?: string;
};

/**
 * Menú desplegable ancorat al disparador. Es construeix amb un `Modal`
 * transparent (sense dependències natives, funciona amb Expo Go): mesura la
 * posició del botó i hi col·loca la targeta a sota, alineada a la dreta.
 */
export function Menu({ items, icon = "ellipsis-horizontal", accessibilityLabel = "Més opcions" }: Props) {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();
  const triggerRef = useRef<View>(null);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<{ top: number; right: number }>({
    top: 0,
    right: spacing[2],
  });

  const openMenu = () => {
    triggerRef.current?.measureInWindow((x, y, w, h) => {
      setAnchor({ top: y + h + spacing[1], right: Math.max(spacing[2], width - (x + w)) });
      setOpen(true);
    });
  };

  return (
    <>
      <Pressable
        ref={triggerRef}
        onPress={openMenu}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ expanded: open }}
      >
        <Ionicons name={icon} size={22} color={colors.text} />
      </Pressable>

      <Modal
        transparent
        visible={open}
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          accessibilityLabel="Tanca el menú"
          onPress={() => setOpen(false)}
        />
        <View
          style={[
            styles.card,
            {
              top: anchor.top,
              right: anchor.right,
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
        >
          {items.map((item, i) => (
            <Fragment key={item.label}>
              {i > 0 ? <View style={[styles.sep, { backgroundColor: colors.border }]} /> : null}
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={item.label}
                onPress={() => {
                  setOpen(false);
                  item.onPress();
                }}
                style={({ pressed }) => [
                  styles.item,
                  pressed && { backgroundColor: colors.surfaceMuted },
                ]}
              >
                {item.icon ? (
                  <Ionicons
                    name={item.icon}
                    size={18}
                    color={item.destructive ? colors.danger : colors.textStrong}
                  />
                ) : null}
                <Text
                  style={[
                    styles.label,
                    { color: item.destructive ? colors.danger : colors.text },
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            </Fragment>
          ))}
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    minWidth: 184,
    borderWidth: 1,
    borderRadius: radius.xl,
    overflow: "hidden",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
  },
  label: { fontSize: fontSize.base, fontWeight: fontWeight.medium },
  sep: { height: StyleSheet.hairlineWidth },
});
