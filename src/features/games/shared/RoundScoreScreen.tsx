import { useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { GameScreenProps } from '../types';
import { totals, type RoundScoreAction, type RoundScoreState } from './roundScoreRules';

/** Generic "enter each participant's score per round" screen. */
export function RoundScoreScreen({
  state,
  dispatch,
  readOnly,
}: GameScreenProps<RoundScoreState, RoundScoreAction>) {
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const sums = totals(state);

  const addRound = () => {
    const scores: Record<string, number> = {};
    for (const p of state.participants) scores[p.id] = Number(inputs[p.id]) || 0;
    dispatch({ type: 'addRound', scores });
    setInputs({});
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
        {state.rounds.map((round, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.cell}>{i + 1}</Text>
            {state.participants.map((p) => (
              <Text key={p.id} style={styles.cell}>
                {round[p.id] ?? 0}
              </Text>
            ))}
          </View>
        ))}
        <View style={styles.row}>
          <Text style={[styles.cell, styles.head]}>Total</Text>
          {state.participants.map((p) => (
            <Text key={p.id} style={[styles.cell, styles.head]}>
              {sums[p.id]}
            </Text>
          ))}
        </View>
      </View>

      {!readOnly && (
        <View style={styles.form}>
          <View style={styles.row}>
            <Text style={styles.cell}>New</Text>
            {state.participants.map((p) => (
              <TextInput
                key={p.id}
                style={[styles.cell, styles.input]}
                keyboardType="numeric"
                value={inputs[p.id] ?? ''}
                onChangeText={(text) => setInputs((prev) => ({ ...prev, [p.id]: text }))}
              />
            ))}
          </View>
          <Button title="Add round" onPress={addRound} />
          <Button
            title="Undo last round"
            color="#888"
            disabled={state.rounds.length === 0}
            onPress={() => dispatch({ type: 'undoRound' })}
          />
          <Button title="Finish match" color="#c0392b" onPress={() => dispatch({ type: 'finish' })} />
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
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 6, padding: 6 },
  form: { gap: 8 },
});
