import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Chip } from '@/components/Chip';
import { Avatar } from '@/components/Avatar';
import { Icon } from '@/components/Icon';
import { IconButton } from '@/components/IconButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { RulesEditor, RulesInfographic, rulesEqual, useGames, type GameRules } from '@/features/games';
import { useGangs } from '@/features/gangs';
import { newId } from '@/lib/id';
import { colors, fonts } from '@/lib/theme';
import { useMatches } from '../useMatches';

export function NewMatchScreen({ initialGameId }: { initialGameId?: string }) {
  const { items: games, update: updateGame } = useGames();
  const { items: gangs } = useGangs();
  const { add } = useMatches();

  const [pickedGameId, setPickedGameId] = useState(initialGameId);
  const [customizing, setCustomizing] = useState(false); // rules editor is hidden until asked for
  const [changedRules, setChangedRules] = useState<GameRules>(); // rules changed for this match only
  const [pickedGangId, setPickedGangId] = useState<string>();
  const [pickedIds, setPickedIds] = useState<string[]>(); // undefined = default: first players of the gang

  const game = games.find((g) => g.id === pickedGameId) ?? games[0];
  const gang = gangs.find((g) => g.id === pickedGangId) ?? gangs[0];

  if (!game) {
    return (
      <Screen>
        <Text style={styles.hint}>Create a game in the Games tab first.</Text>
      </Screen>
    );
  }

  // Opened from a specific game: that game is already chosen, so no game tags to pick from.
  const gameIsFixed = initialGameId !== undefined && games.some((g) => g.id === initialGameId);
  const rules = changedRules ?? game.rules;
  const dirty = changedRules !== undefined && !rulesEqual(changedRules, game.rules);
  const candidates = gang?.players ?? [];
  const selected = (pickedIds ?? candidates.map((p) => p.id))
    .filter((id) => candidates.some((p) => p.id === id))
    .slice(0, rules.playerLimit);
  const canStart = rules.playersFixed ? selected.length === rules.playerLimit : selected.length >= 2;

  const toggle = (id: string) => {
    if (selected.includes(id)) setPickedIds(selected.filter((x) => x !== id));
    else if (selected.length < rules.playerLimit) setPickedIds([...selected, id]);
  };

  const saveAsDefault = async () => {
    await updateGame({ ...game, rules });
    setChangedRules(undefined);
  };

  const start = async () => {
    if (!canStart) return;
    const id = newId();
    await add({
      id,
      gameId: game.id,
      gameName: game.name,
      rules,
      players: candidates.filter((p) => selected.includes(p.id)).map((p) => ({ id: p.id, name: p.name, color: p.color })),
      rounds: [],
      status: 'active',
      createdAt: new Date().toISOString(),
    });
    router.replace(`/match/${id}`);
  };

  return (
    <Screen bottomInset>
      <View style={styles.header}>
        <IconButton icon="back" label="Back" onPress={() => router.back()} />
        <Text style={styles.title}>New game</Text>
      </View>

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.section}>
          {gameIsFixed ? (
            <Text style={styles.gameName}>{game.name}</Text>
          ) : (
            <>
              <Text style={styles.label}>Game</Text>
              <View style={styles.chips}>
                {games.map((g) => (
                  <Chip
                    key={g.id}
                    label={g.name}
                    selected={g.id === game.id}
                    onPress={() => {
                      setPickedGameId(g.id);
                      setChangedRules(undefined);
                      setPickedIds(undefined);
                    }}
                  />
                ))}
                <Chip label="+ New" selected={false} onPress={() => router.push('/game/new')} />
              </View>
            </>
          )}

          <View style={styles.rules}>
            <Text style={styles.rulesHeading}>{dirty ? 'Customized rules' : `Default rules for ${game.name}`}</Text>
            <RulesInfographic rules={rules} />
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: customizing }}
              onPress={() => setCustomizing(!customizing)}
              style={[styles.ruleButton, customizing ? styles.save : styles.reset]}
            >
              <Text style={customizing ? styles.saveLabel : styles.resetLabel}>
                {customizing ? 'Done' : 'Customize'}
              </Text>
            </Pressable>

            {customizing && (
              <>
                <RulesEditor rules={rules} onChange={setChangedRules} />
                <View style={styles.rulesActions}>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() =>
                      Alert.alert('Reset to defaults?', `The rules for this game go back to the saved defaults for ${game.name}.`, [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Reset', style: 'destructive', onPress: () => setChangedRules(undefined) },
                      ])
                    }
                    style={[styles.ruleButton, styles.reset]}
                  >
                    <Text style={styles.resetLabel}>Reset to defaults</Text>
                  </Pressable>
                  <Pressable accessibilityRole="button" onPress={saveAsDefault} style={[styles.ruleButton, styles.save]}>
                    <Text style={styles.saveLabel}>Save as default</Text>
                  </Pressable>
                </View>
                <Text style={styles.note}>
                  {dirty
                    ? `Changed for this game only. Save to make these the default rules for ${game.name}.`
                    : `Using the default rules for ${game.name}. Change anything above for just this game.`}
                </Text>
              </>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.whoHead}>
            <Text style={styles.label}>Who's playing?</Text>
            <Text style={styles.count}>
              {selected.length} of {rules.playerLimit} selected
            </Text>
          </View>
          <View style={styles.chips}>
            {gangs.map((g) => (
              <Chip
                key={g.id}
                label={g.name}
                selected={g.id === gang?.id}
                onPress={() => {
                  setPickedGangId(g.id);
                  setPickedIds(undefined);
                }}
              />
            ))}
          </View>
          <View style={styles.players}>
            {candidates.map((p, i) => {
              const on = selected.includes(p.id);
              return (
                <Pressable
                  key={p.id}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: on }}
                  onPress={() => toggle(p.id)}
                  style={[styles.playerRow, i > 0 && styles.playerBorder]}
                >
                  <Avatar name={p.name} color={p.color} size={34} />
                  <Text style={styles.playerName}>{p.name}</Text>
                  <View style={[styles.check, on ? styles.checkOn : styles.checkOff]}>
                    {on && <Icon name="check" size={16} color={colors.ink} strokeWidth={3} />}
                  </View>
                </Pressable>
              );
            })}
            {candidates.length === 0 && (
              <Text style={styles.hint}>{gangs.length === 0 ? 'Create a gang to pick players.' : 'This gang has no players yet.'}</Text>
            )}
            <Pressable
              accessibilityRole="link"
              onPress={() => router.navigate('/gangs')}
              style={[styles.manage, candidates.length > 0 && styles.playerBorder]}
            >
              <Icon name="plus" size={18} color={colors.ink} />
              <Text style={styles.manageLabel}>Manage gangs and players</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <PrimaryButton label="Start game" icon="arrow-right" disabled={!canStart} onPress={start} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8 },
  title: { fontFamily: fonts.displayHeavy, fontSize: 26, letterSpacing: -0.3, color: colors.ink },
  body: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8, gap: 22 },
  section: { gap: 10 },
  label: { fontFamily: fonts.semibold, fontSize: 13, color: colors.muted },
  gameName: { fontFamily: fonts.displayHeavy, fontSize: 28, letterSpacing: -0.5, color: colors.ink },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  rules: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 20,
    padding: 16,
    gap: 16,
  },
  rulesHeading: { fontFamily: fonts.displayBold, fontSize: 16, color: colors.ink },
  rulesActions: { flexDirection: 'row', gap: 8 },
  ruleButton: { flex: 1, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  reset: { backgroundColor: colors.bg, borderWidth: 1, borderColor: colors.line },
  resetLabel: { fontFamily: fonts.semibold, fontSize: 14, color: colors.ink },
  save: { backgroundColor: colors.ink },
  saveLabel: { fontFamily: fonts.semibold, fontSize: 14, color: '#FFFFFF' },
  note: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17, color: colors.muted },
  whoHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  count: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
  players: { backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, borderRadius: 20, overflow: 'hidden' },
  playerRow: { minHeight: 56, flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8, paddingHorizontal: 14 },
  playerBorder: { borderTopWidth: 1, borderTopColor: colors.line },
  playerName: { flex: 1, fontFamily: fonts.medium, fontSize: 15, color: colors.ink },
  check: { width: 26, height: 26, borderRadius: 8, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  checkOn: { backgroundColor: colors.accent, borderColor: colors.accent },
  checkOff: { backgroundColor: colors.card, borderColor: colors.faint },
  hint: { fontFamily: fonts.body, color: colors.muted, padding: 14 },
  manage: { height: 52, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  manageLabel: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
  footer: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 8 },
});
