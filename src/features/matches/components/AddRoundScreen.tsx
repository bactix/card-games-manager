import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Avatar } from '@/components/Avatar';
import { IconButton } from '@/components/IconButton';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Screen } from '@/components/Screen';
import { useGames } from '@/features/games';
import { colors, fonts } from '@/lib/theme';
import { reachedEnd, resetsToZero, startOfNextRound, totals } from '../scoring';
import { useMatches } from '../useMatches';
import { BadMoveSound } from './BadMoveSound';
import { BidsRoundScreen } from './BidsRoundScreen';
import { PenaltyCardButton, RestCardButton, ScoreCardButton } from './ScoreCardButton';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'];

/**
 * Enter every player's points for the next round with a number pad. Games with score cards (like Likha)
 * also show card buttons on each player's row; the cards add their points on top of what is typed.
 */
function PointsRoundScreen({ matchId }: { matchId: string }) {
  const { items, loading, update } = useMatches();
  const { items: games } = useGames();
  const match = items.find((m) => m.id === matchId);
  const [active, setActive] = useState(0);
  const [values, setValues] = useState<string[]>([]); // number pad: points typed per player
  const [taken, setTaken] = useState<number[][]>([]); // score cards: taken[player][card] = how many
  const [penalty, setPenalty] = useState<(number | undefined)[]>([]); // the one player taking a fixed penalty
  const [customNeg, setCustomNeg] = useState<number>(); // the one player taking a negative number they typed

  if (loading) return null;
  if (!match) {
    return (
      <Screen>
        <Text style={styles.message}>Game not found.</Text>
      </Screen>
    );
  }

  const game = games.find((g) => g.id === match.gameId);
  // Matches started before a rule existed fall back to the game's current setting.
  const cards = match.rules.scoreCards ?? game?.rules.scoreCards;
  // Games where every round one player takes a penalty (such as -30 or -60) and the others score points.
  const penalties = match.rules.penalties ?? game?.rules.penalties;
  const sums = totals(match);

  const takenBy = (player: number, card: number) => taken[player]?.[card] ?? 0;
  const takenTotal = (card: number) => match.players.reduce((sum, _, p) => sum + takenBy(p, card), 0);
  const cardPoints = (player: number) =>
    (cards ?? []).reduce((sum, card, c) => sum + takenBy(player, c) * card.points, 0);
  const typedPoints = (player: number) => parseInt(values[player] ?? '0', 10) || 0;
  const valueOf = (player: number) =>
    customNeg === player ? -typedPoints(player) : (penalty[player] ?? typedPoints(player) + cardPoints(player));
  // Games with the "take all the points" bonus: whoever takes the whole round total gets 1 extra point.
  const takeAllBonus = match.rules.takeAllBonus ?? game?.rules.takeAllBonus ?? false;
  const bonusOf = (player: number) => (takeAllBonus && limit > 0 && valueOf(player) === limit ? 1 : 0);
  const scored = (player: number) => valueOf(player) + bonusOf(player);
  // A bad move (in Likha: taking the whole round) plays the bad move sound as soon as it happens.
  const badMoveRule = match.rules.badMoveTakesAll ?? game?.rules.badMoveTakesAll ?? false;
  const takesAll = (player: number) => badMoveRule && limit > 0 && valueOf(player) === limit;
  const badMoveNow = match.players.some((_, i) => takesAll(i));
  const holdsNegative = (player: number) => penalty[player] !== undefined || customNeg === player;

  // Gives the penalty to one player (taking it from whoever had it); tapping it again takes it off.
  const choosePenalty = (player: number, value: number) =>
    {
      setCustomNeg(undefined);
      setPenalty(match.players.map((_, k) => (k === player && penalty[k] !== value ? value : undefined)));
    }

  // Makes one player the negative one with a number they type on the keypad; tapping again takes it off.
  const chooseCustomNegative = (player: number) => {
    setPenalty([]);
    if (customNeg === player) return setCustomNeg(undefined);
    setCustomNeg(player);
    setActive(player);
    setValues((prev) => match.players.map((_, i) => (i === player ? '0' : (prev[i] ?? '0'))));
    setTaken((prev) => match.players.map((_, pl) => (cards ?? []).map((__, k) => (pl === player ? 0 : (prev[pl]?.[k] ?? 0)))));
  };

  const changeTaken = (player: number, card: number, delta: number) =>
    setTaken((prev) => {
      const next = match.players.map((_, p) => (cards ?? []).map((__, c) => prev[p]?.[c] ?? 0));
      next[player][card] = Math.max(0, next[player][card] + delta);
      return next;
    });

  // A card can be added while copies are left and neither the round nor the player goes over a points limit.
  const canAddCard = (card: number, player: number) => {
    if (!cards) return false;
    if (holdsNegative(player)) return false; // the player taking the penalty scores no points
    const c = cards[card];
    // a card that sets the score can be picked by any number of players, as long as it fits the player's maximum
    if (c.setsScore) return !(maxEach > 0 && c.points > maxEach);
    if (takenTotal(card) >= c.maxPerRound) return false;
    if (limit > 0 && roundSum + c.points > limit) return false;
    return !(maxEach > 0 && valueOf(player) + c.points > maxEach);
  };

  // Tap gives one card to the player; tapping a single card again takes it back.
  const tapCard = (player: number, card: number) => {
    if (!cards) return;
    const c = cards[card];
    if (c.setsScore) {
      // pick this card as the player's whole score (or put it back); it replaces any other card or typed number
      const wasOn = takenBy(player, card) > 0;
      if (!wasOn && !canAddCard(card, player)) return;
      setTaken((prev) => {
        const next = match.players.map((_, p) => cards.map((__, k) => prev[p]?.[k] ?? 0));
        cards.forEach((other, k) => {
          if (other.setsScore) next[player][k] = 0;
        });
        if (!wasOn) next[player][card] = 1;
        return next;
      });
      setValues((prev) => match.players.map((_, i) => (i === player ? '0' : (prev[i] ?? '0'))));
      return;
    }
    if (c.maxPerRound === 1 && takenBy(player, card) === 1) return changeTaken(player, card, -1);
    if (canAddCard(card, player)) changeTaken(player, card, 1);
  };
  // Holding a card takes one back from the player.
  const holdCard = (player: number, card: number) => {
    if (takenBy(player, card) > 0) changeTaken(player, card, -1);
  };

  const setActiveValue = (fn: (current: string) => string) =>
    setValues((prev) => {
      const next = match.players.map((_, i) => prev[i] ?? '0');
      next[active] = fn(next[active]);
      return next;
    });

  // Points shared by all players in a round (the round must add up to it exactly). 0 = no limit.
  const limit = match.rules.roundTotal ?? game?.rules.roundTotal ?? 0;
  // Most points any one player can score in a round, on its own. 0 = no maximum.
  const maxEach = match.rules.maxPerPlayer ?? game?.rules.maxPerPlayer ?? 0;
  const roundSum = match.players.reduce((sum, _, i) => sum + valueOf(i), 0);
  const othersSum = roundSum - valueOf(active);
  const left = limit - roundSum;
  const penalized = match.players.filter((_, i) => holdsNegative(i)).length;
  const othersScore = match.players.every((_, i) => holdsNegative(i) || valueOf(i) > 0);
  // a typed negative needs a number: -0 is not a penalty
  const negativeFilled = customNeg === undefined || typedPoints(customNeg) > 0;
  const penaltyOk = !penalties || (penalized === 1 && othersScore && negativeFilled);
  const canSave = (limit === 0 || left === 0) && penaltyOk;
  const penaltyList = (penalties ?? []).map((p) => `−${Math.abs(p)}`).join(' or ');
  const blockedLabel = !penaltyOk
    ? penalized === 0
      ? `Choose who takes ${penaltyList} or a custom negative`
      : !negativeFilled
        ? 'Type the negative number'
        : 'Everyone else needs points above 0'
    : `${left} points left to give`;

  const press = (key: string) => {
    if (penalty[active] !== undefined) return; // a fixed penalty (-30 / -60) has nothing to type
    const typingNegative = customNeg === active; // a custom negative is typed as a plain number, no caps
    // Typing replaces a 100 / 200 card the player had picked: put the card back and start a custom number.
    if (cards?.some((c, k) => c.setsScore && takenBy(active, k) > 0)) {
      setTaken((prev) =>
        match.players.map((_, p) =>
          cards.map((c, k) => (p === active && c.setsScore ? 0 : (prev[p]?.[k] ?? 0))),
        ),
      );
      if (key === 'C' || key === '⌫') return setActiveValue(() => '0');
      return setActiveValue(() => key);
    }
    if (key === 'C') return setActiveValue(() => '0');
    if (key === '⌫') return setActiveValue((s) => (s.length > 1 ? s.slice(0, -1) : '0'));
    setActiveValue((s) => {
      const next = s === '0' ? key : s.length < 4 ? s + key : s;
      const amount = (parseInt(next, 10) || 0) + cardPoints(active);
      // a round can never add up to more than the game's points per round
      if (!typingNegative && limit > 0 && othersSum + amount > limit) return s;
      // and one player can never score more than the game's maximum for a round
      if (!typingNegative && maxEach > 0 && amount > maxEach) return s;
      return next;
    });
  };

  // Puts whatever is still left of the round's points on the chosen player.
  const giveRest = (player: number) => {
    if (left <= 0) return;
    // never more than the player can still take under the per-player maximum
    const room = maxEach > 0 ? maxEach - valueOf(player) : left;
    const amount = Math.min(left, room);
    if (amount <= 0) return;
    setValues((prev) => {
      const next = match.players.map((_, i) => prev[i] ?? '0');
      next[player] = String(Math.min(9999, (parseInt(next[player], 10) || 0) + amount));
      return next;
    });
  };

  const save = async () => {
    if (!canSave) return;
    const round = match.players.map((_, i) => scored(i));
    const rounds = [...match.rounds, round];
    const finished = reachedEnd({ ...match, rounds });
    await update({ ...match, rounds, status: finished ? 'finished' : 'active' });
    if (finished) router.replace(`/match/${match.id}/winner`);
    else router.back();
  };

  return (
    <Screen bottomInset>
      <BadMoveSound active={badMoveNow} />
      <View style={styles.header}>
        <IconButton icon="close" label="Cancel" onPress={() => router.back()} />
        <View style={styles.headerText}>
          <Text style={styles.title}>Round {match.rounds.length + 1}</Text>
          <Text style={styles.sub}>
            {limit > 0
              ? `${limit} points to share · ${left} left`
              : penalties
                ? `One player takes ${penaltyList}, the others score${maxEach > 0 ? ` (max ${maxEach} each)` : ''}`
                : maxEach > 0
                  ? `Tap a player, then enter points (max ${maxEach} each)`
                  : 'Tap a player, then enter points'}
          </Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.rows}>
        {match.players.map((p, i) => {
          const on = active === i;
          const v = scored(i);
          return (
            <Pressable
              key={p.id}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              accessibilityLabel={`${p.name}, round points ${v}`}
              onPress={() => setActive(i)}
              style={[styles.row, on ? styles.rowOn : styles.rowOff]}
            >
              <View style={styles.rowTop}>
                <Avatar name={p.name} color={p.color} size={36} />
                <View style={styles.rowText}>
                  <Text style={styles.name} numberOfLines={1}>
                    {p.name}
                  </Text>
                  <Text style={styles.next} numberOfLines={1}>
                    {sums[i]} → {startOfNextRound(match.rules, sums[i]) + v}
                    {resetsToZero(match.rules, sums[i]) ? ' (starts from 0)' : ''}
                    {bonusOf(i) > 0 ? ' · +1 for taking all' : ''}
                  </Text>
                </View>
                {(cards || limit > 0 || penalties) && (
                <View style={styles.cardsRow}>
                  {(penalties ?? []).map((value) => (
                    <PenaltyCardButton
                      key={value}
                      compact
                      value={value}
                      selected={penalty[i] === value}
                      unavailable={penalized > 0 && !holdsNegative(i)}
                      label={`${p.name} takes ${value}`}
                      onPress={() => choosePenalty(i, value)}
                    />
                  ))}
                  {penalties && (
                    <PenaltyCardButton
                      compact
                      text="−?"
                      selected={customNeg === i}
                      unavailable={penalized > 0 && !holdsNegative(i)}
                      label={`${p.name} takes a custom negative number`}
                      onPress={() => chooseCustomNegative(i)}
                    />
                  )}
                  {(cards ?? []).map((card, c) => {
                    const count = takenBy(i, c);
                    const cardName = card.rank ? `${card.rank} of ${card.suit}s` : `${card.suit}s`;
                    return (
                      <ScoreCardButton
                        key={card.id}
                        compact
                        suit={card.suit}
                        rank={card.rank}
                        points={card.points}
                        count={count}
                        showCount={card.maxPerRound > 1 && !card.setsScore}
                        unavailable={!canAddCard(c, i)}
                        label={`${cardName} for ${p.name}, ${count} taken, ${card.points} points each`}
                        onPress={() => tapCard(i, c)}
                        onLongPress={() => holdCard(i, c)}
                      />
                    );
                  })}
                  {limit > 0 && (
                    <RestCardButton
                      compact
                      amount={Math.max(0, left)}
                      label={`Give the rest, ${Math.max(0, left)} points, to ${p.name}`}
                      onPress={() => giveRest(i)}
                    />
                  )}
                </View>
                )}
                <Text
                  style={[styles.value, { color: v === 0 ? colors.faint : v < 0 ? colors.danger : colors.ink }]}
                >
                  {v < 0 ? `−${-v}` : `+${v}`}
                </Text>
              </View>
            </Pressable>
          );
        })}
        {cards && (
          <Text style={styles.hint}>
            {cards.some((c) => c.setsScore)
              ? 'Tap a card to set that player’s score, or type any number. Tap the card again to clear it.'
              : 'Tap a card to give it to a player. Tap a single card again, or hold a card with a number, to take it back.'}
          </Text>
        )}
      </ScrollView>

      <View style={styles.pad}>
        <View style={styles.keys}>
          {KEYS.map((k) => (
            <Pressable
              key={k}
              accessibilityRole="button"
              accessibilityLabel={k === 'C' ? 'Clear' : k === '⌫' ? 'Delete' : k}
              onPress={() => press(k)}
              style={styles.key}
            >
              <Text style={styles.keyText}>{k}</Text>
            </Pressable>
          ))}
        </View>
        <PrimaryButton
          label={canSave ? 'Save round' : blockedLabel}
          icon="check"
          iconPosition="left"
          disabled={!canSave}
          onPress={save}
        />
      </View>
    </Screen>
  );
}

/** Picks the round entry for the game: bids for games that have them, points for the rest. */
export function AddRoundScreen({ matchId }: { matchId: string }) {
  const { items } = useMatches();
  const { items: games } = useGames();
  const match = items.find((m) => m.id === matchId);
  const bids = match ? (match.rules.bids ?? games.find((g) => g.id === match.gameId)?.rules.bids) : undefined;
  return bids?.length ? <BidsRoundScreen matchId={matchId} /> : <PointsRoundScreen matchId={matchId} />;
}

const styles = StyleSheet.create({
  message: { padding: 20, fontFamily: fonts.body, color: colors.muted },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingTop: 24, paddingBottom: 8 },
  headerText: { flex: 1, gap: 2 },
  title: { fontFamily: fonts.displayHeavy, fontSize: 22, color: colors.ink },
  sub: { fontFamily: fonts.body, fontSize: 13, color: colors.muted },
  scroll: { flex: 1 },
  rows: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12, gap: 8 },
  row: {
    borderRadius: 18,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 10,
  },
  rowTop: { minHeight: 52, flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowOn: { borderWidth: 2, borderColor: colors.ink },
  rowOff: { borderWidth: 1, borderColor: colors.line },
  rowText: { flex: 1, gap: 2, minWidth: 0 },
  name: { fontFamily: fonts.semibold, fontSize: 15, color: colors.ink },
  next: { fontFamily: fonts.body, fontSize: 12, color: colors.muted },
  value: { fontFamily: fonts.displayHeavy, fontSize: 24, minWidth: 44, textAlign: 'right' },
  cardsRow: { flexDirection: 'row', gap: 5 },
  hint: { fontFamily: fonts.body, fontSize: 12, lineHeight: 17, color: colors.muted, paddingTop: 4 },
  pad: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
    gap: 12,
  },
  keys: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  key: {
    width: '31.5%',
    flexGrow: 1,
    height: 52,
    borderRadius: 14,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: { fontFamily: fonts.displayBold, fontSize: 22, color: colors.ink },
});
