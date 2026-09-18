import {useRef, useEffect} from 'react';
import type {PointerEventHandler} from 'react';
import {useHandler} from 'react-swissbit';

export default function useOutsideInteraction(
  outsideCallBack?: () => void,
  enabled: boolean = false,
): PointerEventHandler {
  const insideEvents = useRef(new WeakSet<PointerEvent>());

  const pointerEventHandler: PointerEventHandler = useHandler((event) => {
    if (enabled) {
      insideEvents.current.add(event.nativeEvent);
    }
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const timers = new Set<ReturnType<typeof setTimeout>>();

    const handlePointerDown = (event: PointerEvent) => {
      const timer = setTimeout(() => {
        timers.delete(timer);

        if (!insideEvents.current.delete(event)) {
          outsideCallBack?.();
        }
      }, 0);

      timers.add(timer);
    };

    document.addEventListener('pointerdown', handlePointerDown, true);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
      timers.forEach(clearTimeout);
    };
  }, [outsideCallBack, enabled]);

  return pointerEventHandler;
}
