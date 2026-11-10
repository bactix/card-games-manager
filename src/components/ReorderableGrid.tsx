import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { Animated, PanResponder, View } from 'react-native';

interface Props<T> {
  data: T[];
  keyExtractor: (item: T) => string;
  itemWidth: number;
  itemHeight: number;
  columns: number;
  rowGap?: number;
  /** Call `drag` from the item's long press to pick it up, then move your finger to reorder. */
  renderItem: (item: T, control: { drag: () => void; isActive: boolean }) => ReactNode;
  /** Called once, after the item is dropped, with the new order. */
  onReorder: (next: T[]) => void;
  /** Lets a parent scroll view stop scrolling while an item is being dragged. */
  onDragStateChange?: (dragging: boolean) => void;
}

/** A grid whose items can be picked up and dropped into a new position. */
export function ReorderableGrid<T>({
  data,
  keyExtractor,
  itemWidth,
  itemHeight,
  columns,
  rowGap = 16,
  renderItem,
  onReorder,
  onDragStateChange,
}: Props<T>) {
  const [width, setWidth] = useState(0);
  const [order, setOrder] = useState<string[]>(() => data.map(keyExtractor));
  const [activeKey, setActiveKey] = useState<string>();
  const positions = useRef<Record<string, Animated.ValueXY>>({}).current;

  // Latest values for the touch handlers, which are created only once.
  const live = useRef({
    order,
    data,
    width,
    activeKey: undefined as string | undefined,
    start: { x: 0, y: 0 },
    moved: false,
    /** The last order handed to `onReorder`, so each new order is saved exactly once. */
    saved: [] as string[],
  });
  // While dragging, the ref is the source of truth; a re-render must not overwrite it.
  if (live.current.activeKey === undefined) live.current.order = order;
  live.current.data = data;
  live.current.width = width;

  const gapX = columns > 1 ? Math.max(0, (width - columns * itemWidth) / (columns - 1)) : 0;
  const gapXRef = useRef(gapX);
  gapXRef.current = gapX;
  const slot = (index: number) => ({
    x: (index % columns) * (itemWidth + gapXRef.current),
    y: Math.floor(index / columns) * (itemHeight + rowGap),
  });
  const slotRef = useRef(slot);
  slotRef.current = slot;

  const position = (key: string, index: number) => {
    if (!positions[key]) positions[key] = new Animated.ValueXY(slot(index));
    return positions[key];
  };

  // Follow the data when it changes from outside (items added, removed or reordered elsewhere).
  const dataKeys = data.map(keyExtractor).join('|');
  useEffect(() => {
    if (live.current.activeKey === undefined) setOrder(data.map(keyExtractor));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataKeys]);

  // Slide every item that isn't being dragged to its slot.
  useEffect(() => {
    order.forEach((key, index) => {
      if (key === activeKey) return;
      Animated.spring(position(key, index), { toValue: slot(index), useNativeDriver: false, bounciness: 4 }).start();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order, activeKey, width]);

  // Hands the current order to the parent (which saves it), unless that exact order was already saved.
  const save = () => {
    const l = live.current;
    if (l.order.join('|') === l.saved.join('|')) return;
    l.saved = [...l.order];
    const byKey = new Map(l.data.map((item) => [keyExtractor(item), item]));
    onReorder(l.order.map((k) => byKey.get(k) as T));
  };

  const finish = () => {
    const l = live.current;
    const key = l.activeKey;
    if (key === undefined) return;
    const index = l.order.indexOf(key);
    Animated.spring(position(key, index), { toValue: slotRef.current(index), useNativeDriver: false, bounciness: 4 }).start();
    save();
    l.activeKey = undefined;
    setActiveKey(undefined);
    onDragStateChange?.(false);
  };

  const responder = useMemo(
    () =>
      PanResponder.create({
        // Once an item is picked up, take over every touch move from the item underneath.
        onMoveShouldSetPanResponderCapture: () => live.current.activeKey !== undefined,
        onPanResponderGrant: () => {
          live.current.moved = true;
        },
        onPanResponderMove: (_, g) => {
          const l = live.current;
          const key = l.activeKey;
          if (key === undefined) return;
          const x = l.start.x + g.dx;
          const y = l.start.y + g.dy;
          positions[key]?.setValue({ x, y });

          const rows = Math.ceil(l.order.length / columns);
          const col = Math.min(columns - 1, Math.max(0, Math.round(x / (itemWidth + gapXRef.current))));
          const row = Math.min(rows - 1, Math.max(0, Math.round(y / (itemHeight + rowGap))));
          const target = Math.min(l.order.length - 1, row * columns + col);
          const from = l.order.indexOf(key);
          if (target !== from) {
            const next = [...l.order];
            next.splice(from, 1);
            next.splice(target, 0, key);
            l.order = next;
            setOrder(next);
            save(); // saved as soon as the order changes, not only when the finger lifts
          }
        },
        onPanResponderRelease: finish,
        onPanResponderTerminate: finish,
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columns, itemWidth, itemHeight, rowGap],
  );

  const drag = (key: string) => {
    const l = live.current;
    if (l.activeKey !== undefined) return;
    l.activeKey = key;
    l.moved = false;
    l.saved = [...l.order];
    l.start = slotRef.current(l.order.indexOf(key));
    setActiveKey(key);
    onDragStateChange?.(true);
  };

  const rows = Math.ceil(order.length / columns);
  const byKey = new Map(data.map((item) => [keyExtractor(item), item]));

  return (
    <View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={{ height: rows * itemHeight + Math.max(0, rows - 1) * rowGap }}
      // Picked up and released without moving: just drop it back.
      onTouchEnd={() => {
        if (live.current.activeKey !== undefined && !live.current.moved) finish();
      }}
      {...responder.panHandlers}
    >
      {width > 0 &&
        order.map((key, index) => {
          const item = byKey.get(key);
          if (item === undefined) return null;
          const active = key === activeKey;
          return (
            <Animated.View
              key={key}
              style={{
                position: 'absolute',
                width: itemWidth,
                height: itemHeight,
                zIndex: active ? 10 : 0,
                transform: [...position(key, index).getTranslateTransform(), { scale: active ? 1.08 : 1 }],
              }}
            >
              {renderItem(item, { drag: () => drag(key), isActive: active })}
            </Animated.View>
          );
        })}
    </View>
  );
}
