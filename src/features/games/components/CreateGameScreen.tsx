import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { IconButton } from '@/components/IconButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { newId } from '@/lib/id';
import { colors, fonts } from '@/lib/theme';
import { DEFAULT_RULES, describeRules } from '../rules';
import type { GameRules, GameSymbolName } from '../types';
import { useGames } from '../useGames';
import { GAME_SYMBOLS, GameSymbol } from './GameSymbol';
import { GameTile } from './GameTile';
import { RulesEditor } from './RulesEditor';

const TILE_COLORS = [
  { value: '#8E1B2E', label: 'Crimson' },
  { value: '#0E5A4A', label: 'Green' },
  { value: '#2F2A7A', label: 'Indigo' },
  { value: '#B45309', label: 'Amber' },
  { value: '#1D4ED8', label: 'Blue' },
  { value: '#16181D', label: 'Ink' },
];

export function CreateGameScreen() {
  const { add } = useGames();
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState<GameSymbolName>('spade');
  const [color, setColor] = useState(TILE_COLORS[0].value);
  const [rules, setRules] = useState<GameRules>(DEFAULT_RULES);
  const canCreate = name.trim().length > 0;

  const create = async () => {
    if (!canCreate) return;
    await add({ id: newId(), name: name.trim(), symbol, color, rules });
    router.back();
  };

  return (
    <Screen bottomInset>
      <View style={styles.header}>
        <IconButton icon="back" label="Back" onPress={() => router.back()} />
        <Text style={styles.title}>Create game</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
        <View style={styles.preview}>
          <GameTile name={name.trim()} color={color} symbol={symbol} variant="symbol" />
          <Text style={styles.previewName}>{name.trim() || 'Your game'}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Game name</Text>
          <TextInput
            accessibilityLabel="Game name"
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="e.g. Your game"
            placeholderTextColor={colors.faint}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Icon</Text>
          <View style={styles.row}>
            {GAME_SYMBOLS.map((s) => {
              const on = symbol === s.value;
              return (
                <Pressable
                  key={s.value}
                  accessibilityRole="button"
                  accessibilityLabel={s.label}
                  accessibilityState={{ selected: on }}
                  onPress={() => setSymbol(s.value)}
                  style={[styles.symbol, on ? styles.symbolOn : styles.symbolOff]}
                >
                  <GameSymbol symbol={s.value} size={26} color={on ? '#FFFFFF' : colors.ink} />
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Colour</Text>
          <View style={styles.row}>
            {TILE_COLORS.map((c) => {
              const on = color === c.value;
              return (
                <Pressable
                  key={c.value}
                  accessibilityRole="button"
                  accessibilityLabel={c.label}
                  accessibilityState={{ selected: on }}
                  onPress={() => setColor(c.value)}
                  style={[styles.swatch, { backgroundColor: c.value }, on && styles.swatchOn]}
                />
              );
            })}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Rules</Text>
          <View style={styles.rules}>
            <RulesEditor rules={rules} onChange={setRules} />
            <Text style={styles.summary}>{describeRules(rules)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label="Create game" icon="check" iconPosition="left" disabled={!canCreate} onPress={create} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8 },
  title: { fontFamily: fonts.displayHeavy, fontSize: 26, letterSpacing: -0.3, color: colors.ink },
  body: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 8, gap: 22 },
  preview: { alignItems: 'center', gap: 8 },
  previewName: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
  field: { gap: 8 },
  label: { fontFamily: fonts.semibold, fontSize: 13, color: colors.muted },
  input: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.ink,
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    fontFamily: fonts.medium,
    fontSize: 16,
    color: colors.ink,
  },
  row: { flexDirection: 'row', gap: 10 },
  symbol: { width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  symbolOn: { backgroundColor: colors.ink, borderWidth: 2, borderColor: colors.ink },
  symbolOff: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line },
  swatch: { width: 44, height: 44, borderRadius: 22 },
  swatchOn: { borderWidth: 3, borderColor: '#FFFFFF', shadowColor: colors.ink, shadowRadius: 0, elevation: 0 },
  rules: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 20,
    padding: 16,
    gap: 16,
  },
  summary: {
    fontFamily: fonts.body,
    fontSize: 13,
    lineHeight: 19,
    color: colors.muted,
    backgroundColor: colors.bg,
    borderRadius: 12,
    padding: 12,
  },
  footer: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
});
