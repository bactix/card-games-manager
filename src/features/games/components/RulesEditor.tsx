import { StyleSheet, Text, View } from 'react-native';
import { Segmented } from '@/components/Segmented';
import { Stepper } from '@/components/Stepper';
import { colors, fonts } from '@/lib/theme';
import type { EndMode, GameRules } from '../types';

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
        label="Points per round, shared by all (0 = no limit)"
        value={rules.roundTotal ?? 0}
        min={0}
        onChange={(roundTotal) => set({ roundTotal })}
        buttonBackground={buttonBackground}
      />
      {rules.maxPerPlayer !== undefined && (
        <Stepper
          label="Max points per player in a round (0 = no max)"
          value={rules.maxPerPlayer}
          min={0}
          step={10}
          onChange={(maxPerPlayer) => set({ maxPerPlayer })}
          buttonBackground={buttonBackground}
        />
      )}
      {rules.takeAllBonus !== undefined && rules.roundTotal > 0 && (
        <View style={styles.field}>
          <Text style={styles.label}>
            Extra point for taking all {rules.roundTotal} ({rules.roundTotal + 1})
          </Text>
          <Segmented<'off' | 'on'>
            value={rules.takeAllBonus ? 'on' : 'off'}
            onChange={(v) => set({ takeAllBonus: v === 'on' })}
            options={[
              { label: 'Off', value: 'off' },
              { label: 'On', value: 'on' },
            ]}
          />
        </View>
      )}
      {rules.resetScore !== undefined && (
        <>
          <View style={styles.field}>
            <Text style={styles.label}>Reset score</Text>
            <Segmented<'off' | 'on'>
              value={rules.resetScore ? 'on' : 'off'}
              onChange={(v) => set({ resetScore: v === 'on' })}
              options={[
                { label: 'Off', value: 'off' },
                { label: 'On', value: 'on' },
              ]}
            />
          </View>
          {rules.resetScore && (
            <Stepper
              label="Next round starts from 0 after finishing on exactly (points)"
              value={rules.resetAt ?? 100}
              onChange={(resetAt) => set({ resetAt })}
              buttonBackground={buttonBackground}
            />
          )}
        </>
      )}
      {!rules.playersFixed && (
        <Stepper
          label="Number of players"
          value={rules.playerLimit}
          min={2}
          max={10}
          editable={false}
          onChange={(playerLimit) => set({ playerLimit })}
          buttonBackground={buttonBackground}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 16 },
  field: { gap: 8 },
  label: { fontFamily: fonts.semibold, fontSize: 13, color: colors.muted },
});
