import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Controller, useForm } from "react-hook-form";
import { Alert, Image, Pressable, StyleSheet, Switch, Text, View } from "react-native";

import { Button } from "@/components/Button";
import { TextField } from "@/components/TextField";
import {
  type Stove,
  StoveFormSchema,
  type StoveFormValues,
  parseDecimal,
} from "@/schemas";
import { parseBoilTime } from "@/lib/format";
import {
  MATERIALS,
  type Material,
  SIZES,
  type Size,
  materialLabel,
  sizeLabel,
} from "@/lib/labels";
import { fontSize, fontWeight, radius, spacing, useTheme } from "@/theme";

type Props = {
  defaultValues?: Partial<StoveFormValues>;
  submitLabel: string;
  onSubmit: (values: Omit<Stove, "id">) => void;
};

const EMPTY: StoveFormValues = {
  name: "",
  brand: "",
  material: "other",
  max_capacity_ml: "",
  boil_time: "",
  weight_g: "",
  size: "medium",
  needs_pot_stand: false,
  notes: "",
  photo_uri: null,
};

export function StoveForm({ defaultValues, submitLabel, onSubmit }: Props) {
  const { colors } = useTheme();
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<StoveFormValues>({
    resolver: zodResolver(StoveFormSchema),
    defaultValues: { ...EMPTY, ...defaultValues },
  });

  const submit = handleSubmit((v) =>
    onSubmit({
      name: v.name,
      brand: v.brand,
      material: v.material,
      max_capacity_ml: parseDecimal(v.max_capacity_ml),
      boil_time_300ml_s: parseBoilTime(v.boil_time),
      weight_g: parseDecimal(v.weight_g),
      size: v.size,
      needs_pot_stand: v.needs_pot_stand,
      notes: v.notes ?? "",
      photo_uri: v.photo_uri ?? null,
    }),
  );

  const photoUri = watch("photo_uri");
  const material = watch("material");
  const size = watch("size");

  const pickPhoto = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permís necessari", "Cal accés a les fotos per adjuntar una imatge.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.6,
      allowsEditing: true,
      aspect: [1, 1],
    });
    if (!result.canceled && result.assets[0]) {
      setValue("photo_uri", result.assets[0].uri, { shouldDirty: true });
    }
  };

  return (
    <View style={styles.form}>
      {/* Foto */}
      <View style={styles.photoBlock}>
        <Pressable
          onPress={pickPhoto}
          accessibilityRole="button"
          accessibilityLabel="Tria una foto del fornet"
          style={[styles.photo, { backgroundColor: colors.surfaceMuted }]}
        >
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.photoImage} resizeMode="cover" />
          ) : (
            <Ionicons name="camera-outline" size={32} color={colors.textFaint} />
          )}
        </Pressable>
        {photoUri ? (
          <Pressable
            onPress={() => setValue("photo_uri", null, { shouldDirty: true })}
            accessibilityRole="button"
          >
            <Text style={[styles.smallText, { color: colors.danger }]}>Treu la foto</Text>
          </Pressable>
        ) : (
          <Text style={[styles.smallText, { color: colors.textSecondary }]}>
            Toqueu per afegir una foto
          </Text>
        )}
      </View>

      <Controller
        control={control}
        name="name"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextField
            label="Nom"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.name?.message}
            placeholder="p. ex. Trangia Spirit"
          />
        )}
      />

      <Controller
        control={control}
        name="brand"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextField
            label="Marca"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.brand?.message}
            placeholder="p. ex. Trangia"
          />
        )}
      />

      {/* Material */}
      <View style={styles.chipBlock}>
        <Text style={[styles.label, { color: colors.textStrong }]}>Material</Text>
        <View style={styles.chipWrap}>
          {MATERIALS.map((m) => (
            <Chip
              key={m}
              label={materialLabel(m)}
              active={material === m}
              onPress={() => setValue("material", m as Material, { shouldDirty: true })}
            />
          ))}
        </View>
      </View>

      <View style={styles.fieldRow}>
        <View style={styles.fieldCol}>
          <Controller
            control={control}
            name="max_capacity_ml"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                label="Capacitat màx. (ml)"
                value={String(value ?? "")}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.max_capacity_ml?.message}
                keyboardType="numeric"
                inputMode="numeric"
                placeholder="100"
              />
            )}
          />
        </View>
        <View style={styles.fieldCol}>
          <Controller
            control={control}
            name="weight_g"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextField
                label="Pes (g)"
                value={String(value ?? "")}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.weight_g?.message}
                keyboardType="numeric"
                inputMode="numeric"
                placeholder="110"
              />
            )}
          />
        </View>
      </View>

      <Controller
        control={control}
        name="boil_time"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextField
            label="Temps per bullir 300 ml (m:ss)"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.boil_time?.message}
            placeholder="4:30"
            hint="Minuts i segons, p. ex. 4:30."
          />
        )}
      />

      {/* Mida */}
      <View style={styles.chipBlock}>
        <Text style={[styles.label, { color: colors.textStrong }]}>Mida</Text>
        <View style={styles.chipWrap}>
          {SIZES.map((s) => (
            <Chip
              key={s}
              label={sizeLabel(s)}
              active={size === s}
              onPress={() => setValue("size", s as Size, { shouldDirty: true })}
            />
          ))}
        </View>
      </View>

      {/* Suport per a l'olla */}
      <Controller
        control={control}
        name="needs_pot_stand"
        render={({ field: { value, onChange } }) => (
          <View style={styles.switchRow}>
            <Text style={[styles.label, { color: colors.textStrong }]}>
              Necessita suport per a l'olla
            </Text>
            <Switch
              value={value}
              onValueChange={onChange}
              accessibilityLabel="Necessita suport per a l'olla"
              trackColor={{ true: colors.brand, false: colors.borderStrong }}
              thumbColor={colors.surface}
            />
          </View>
        )}
      />

      <Controller
        control={control}
        name="notes"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextField
            label="Notes"
            value={value ?? ""}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.notes?.message}
            placeholder="Observacions, accessoris, etc."
            multiline
            numberOfLines={3}
            style={styles.multiline}
          />
        )}
      />

      <Button label={submitLabel} onPress={submit} loading={isSubmitting} />
    </View>
  );
}

function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      style={[
        styles.chip,
        active
          ? { backgroundColor: colors.brand, borderColor: colors.brand }
          : { borderColor: colors.borderStrong },
      ]}
    >
      <Text style={[styles.chipLabel, { color: active ? colors.onBrand : colors.textStrong }]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  form: { gap: spacing[4] },
  photoBlock: { alignItems: "center", gap: spacing[2] },
  photo: {
    height: 112,
    width: 112,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    borderRadius: radius["2xl"],
  },
  photoImage: { height: "100%", width: "100%" },
  smallText: { fontSize: fontSize.sm },
  label: { fontSize: fontSize.sm, fontWeight: fontWeight.medium },
  chipBlock: { gap: spacing[1.5] },
  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing[2] },
  chip: {
    borderWidth: 1,
    borderRadius: radius.full,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
  },
  chipLabel: { fontSize: fontSize.sm, fontWeight: fontWeight.medium },
  fieldRow: { flexDirection: "row", gap: spacing[3] },
  fieldCol: { flex: 1 },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing[3],
  },
  multiline: { minHeight: 80, textAlignVertical: "top" },
});
