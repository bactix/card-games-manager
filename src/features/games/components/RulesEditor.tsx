import { StyleSheet, Text, View } from 'react-native';
import { Segmented } from '@/components/Segmented';
import { Stepper } from '@/components/Stepper';
import { colors, fonts } from '@/lib/theme';
import type { EndMode, GameRules, WinnerRule } from '../types';

interface Props {
  rules: GameRules;
  onChange: (rules: GameRules) => void;
  /** Background of the − and + buttons, so they stand out from the surface behind. */
  buttonBackground?: string;
}

/** Edits how a game ends, how many play and who wins. */
export function RulesEditor({ rules, onChange, buttonBackground }: Props) {
  const set = (patch: Partial<GameRules>) => onChange({ ...rules, ...patch });
  return (
    <View style={styles.wrap}>
      <View style={styles.field}>
        <Text style={styles.label}>Game ends</Text>
        <Segmented<EndMode>
          value={rules.endMode}
          onChange={(endMode) => set({ endMode })}
          options={[
            { label: 'Target score', value: 'score' },
            { label: 'Set rounds', value: 'rounds' },
          ]}
        />
      </View>
      {rules.endMode === 'score' ? (
        <Stepper
          label="Ends when a player reaches (points)"
          value={rules.targetScore}
          step={10}
          onChange={(targetScore) => set({ targetScore })}
          buttonBackground={buttonBackground}
        />
      ) : (
        <Stepper
          label="Number of rounds"
          value={rules.rounds}
          onChange={(rounds) => set({ rounds })}
          buttonBackground={buttonBackground}
        />
      )}
      <Stepper
        label="Points per round (0 = no limit)"
        value={rules.roundTotal ?? 0}
        min={0}
        onChange={(roundTotal) => set({ roundTotal })}
        buttonBackground={buttonBackground}
      />
      <Stepper
        label="Number of players"
        value={rules.playerLimit}
        min={2}
        max={10}
        editable={false}
        onChange={(playerLimit) => set({ playerLimit })}
        buttonBackground={buttonBackground}
      />
      <View style={styles.field}>
        <Text style={styles.label}>Winner has</Text>
        <Segmented<WinnerRule>
          value={rules.winner}
          onChange={(winner) => set({ winner })}
          options={[
            { label: 'Most points', value: 'most' },
            { label: 'Least points', value: 'least' },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 16 },
  field: { gap: 8 },
  label: { fontFamily: fonts.semibold, fontSize: 13, color: colors.muted },
});
