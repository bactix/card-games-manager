import { useAudioPlayer } from 'expo-audio';
import { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Chip } from '@/components/Chip';
import type { GameScreenProps } from '../types';
import {
  HEARTS_PER_ROUND,
  LOSING_SCORE,
  getLoserId,
  isFinished,
  roundPoints,
  tookAllPoints,
  totals,
  validateRound,
  type LikhaAction,
  type LikhaState,
} from './rules';

export function LikhaScreen({ state, dispatch, readOnly }: GameScreenProps<LikhaState, LikhaAction>) {
  const [hearts, setHearts] = useState<Record<string, number>>({});
  const [queenId, setQueenId] = useState<string>();
  const [tenId, setTenId] = useState<string>();
  const moan = useAudioPlayer(require('../../../../assets/sounds/moan.wav'));

  const sums = totals(state);
  const loserId = readOnly ? getLoserId(state) : undefined;
  const heartsUsed = state.participants.reduce((sum, p) => sum + (hearts[p.id] ?? 0), 0);
  const error = validateRound(
    { hearts, queenOfSpadesPlayerId: queenId, tenOfDiamondsPlayerId: tenId },
    state.participants,
  );

  const changeHearts = (id: string, delta: number) => {
    const next = Math.max(0, (hearts[id] ?? 0) + delta);
    if (delta > 0 && heartsUsed >= HEARTS_PER_ROUND) return;
    setHearts((prev) => ({ ...prev, [id]: next }));
  };

  const addRound = () => {
    if (error || !queenId || !tenId) return;
    const round = { hearts, queenOfSpadesPlayerId: queenId, tenOfDiamondsPlayerId: tenId };
    if (tookAllPoints(round, state.participants)) {
      void moan.seekTo(0);
      moan.play();
    }
    dispatch({ type: 'addRound', round });
    setHearts({});
    setQueenId(undefined);
    setTenId(undefined);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={[styles.cell, styles.head]}>Round</Text>
          {state.participants.map((p) => (
            <Text key={p.id} style={[styles.cell, styles.head]}>
              {p.name}
            </Text>
          ))}
        </View>
        {state.rounds.map((round, i) => {
          const points = roundPoints(round, state.participants);
          return (
            <View key={i} style={styles.row}>
              <Text style={styles.cell}>{i + 1}</Text>
              {state.participants.map((p) => (
                <Text key={p.id} style={styles.cell}>
                  {points[p.id]}
                </Text>
              ))}
            </View>
          );
        })}
        <View style={styles.row}>
          <Text style={[styles.cell, styles.head]}>Total</Text>
          {state.participants.map((p) => (
            <Text
              key={p.id}
              style={[styles.cell, styles.head, p.id === loserId && styles.loser]}
            >
              {sums[p.id]}
            </Text>
          ))}
        </View>
      </View>

      {readOnly ? (
        <Text style={styles.hint}>
          {isFinished(state)
            ? `Match over: ${state.participants.find((p) => p.id === loserId)?.name} reached ${LOSING_SCORE}.`
            : 'Match ended early.'}
        </Text>
      ) : (
        <View style={styles.form}>
          <Text style={styles.heading}>
            Round {state.rounds.length + 1} · hearts left: {HEARTS_PER_ROUND - heartsUsed}
          </Text>
          {state.participants.map((p) => (
            <View key={p.id} style={styles.playerRow}>
              <Text style={styles.playerName}>{p.name}</Text>
              <Button title="-" onPress={() => changeHearts(p.id, -1)} />
              <Text style={styles.count}>{hearts[p.id] ?? 0}</Text>
              <Button title="+" onPress={() => changeHearts(p.id, 1)} />
              <Chip label="Q♠" selected={queenId === p.id} onPress={() => setQueenId(p.id)} />
              <Chip label="10♦" selected={tenId === p.id} onPress={() => setTenId(p.id)} />
            </View>
          ))}
          {error && <Text style={styles.hint}>{error}</Text>}
          <Button title="Add round" disabled={!!error} onPress={addRound} />
          <Button
            title="Undo last round"
            color="#888"
            disabled={state.rounds.length === 0}
            onPress={() => dispatch({ type: 'undoRound' })}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16 },
  table: { gap: 4 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cell: { flex: 1, textAlign: 'center' },
  head: { fontWeight: '700' },
  loser: { color: '#c0392b' },
  form: { gap: 10 },
  heading: { fontSize: 16, fontWeight: '700' },
  playerRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  playerName: { flex: 1, fontWeight: '600' },
  count: { width: 24, textAlign: 'center' },
  hint: { color: '#888' },
});
