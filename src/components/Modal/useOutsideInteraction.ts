import {useRef, useEffect} from 'react';
import type {PointerEventHandler} from 'react';
import {useHandler} from 'react-swissbit';

/**
 * Detects pointer interactions occurring outside a logical React subtree.
 *
 * Unlike DOM-based outside-click detection using `Node.contains()`, this hook
 * also treats descendants rendered through React portals as being inside the
 * subtree.
 *
 * The algorithm relies on two stages of the same native `PointerEvent`:
 *
 * 1. A native capture listener on `document` sees every `pointerdown` and
 *    defers classification until the current event dispatch has completed.
 * 2. The returned React capture handler marks the native event in a `WeakSet`
 *    whenever the event passes through the protected React subtree.
 *
 * After dispatch completes, an event that was not marked is considered an
 * outside interaction.
 *
 * This also makes the mechanism resilient to descendant bubble-phase
 * `stopPropagation()` calls because both observation points run during
 * capture.
 *
 * React portals preserve React event ancestry, so portal descendants are
 * classified correctly. Content rendered in an independent React root does
 * not share that ancestry and therefore cannot be detected automatically.
 *
 * @param outsideCallBack - Callback invoked for outside pointer interactions.
 * @param enabled - Whether outside interaction detection is active.
 * @returns React pointer capture handler that must be attached to the root of
 * the protected subtree.
 */
export default function useOutsideInteraction(
  outsideCallBack?: (event: PointerEvent) => void,
  enabled: boolean = false,
): PointerEventHandler {
  /**
   * Native pointer events observed while propagating through the protected
   * React subtree.
   *
   * A WeakSet allows events to be tracked by identity without retaining them
   * after they become unreachable.
   */
  const insideEvents = useRef(new WeakSet<PointerEvent>());

  /**
   * Marks the underlying native pointer event as originating from inside the
   * logical React subtree.
   */
  const pointerEventHandler: PointerEventHandler = useHandler((event) => {
    if (enabled) {
      insideEvents.current.add(event.nativeEvent);
    }
  });

  /**
   * Stable wrapper around the latest consumer callback.
   *
   * Keeping the wrapper identity stable prevents callback identity changes
   * from unnecessarily recreating the document listener or cancelling pending
   * interaction checks.
   */
  const handleInteractOutside = useHandler((event: PointerEvent) =>
    outsideCallBack?.(event),
  );

  /**
   * Subscribes to document-level pointer events while detection is enabled.
   *
   * Classification is deferred with a zero-delay timer because the native
   * document capture listener executes before React's subtree capture handler.
   * Waiting until dispatch finishes gives React an opportunity to mark events
   * that belong to the protected subtree.
   *
   * Pending timers are tracked and cancelled during cleanup so no outside
   * callback can fire after the subscription has been disabled or unmounted.
   */
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const timers = new Set<ReturnType<typeof setTimeout>>();

    const handlePointerDown = (event: PointerEvent) => {
      const timer = setTimeout(() => {
        timers.delete(timer);

        if (!insideEvents.current.delete(event)) {
          handleInteractOutside(event);
        }
      }, 0);

      timers.add(timer);
    };

    document.addEventListener('pointerdown', handlePointerDown, true);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
      timers.forEach(clearTimeout);
    };
  }, [handleInteractOutside, enabled]);

  return pointerEventHandler;
}
