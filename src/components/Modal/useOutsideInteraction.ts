import {useRef, useEffect} from 'react';
import {useHandler} from 'react-swissbit';

import type {PointEventHandler} from './types';

export default function useOutsideInteraction(
  outsideCallBack?: () => void,
  enabled: boolean = false,
): PointEventHandler {
  const insideEvents = useRef(new WeakSet<PointerEvent>());

  const pointEventHandler: PointEventHandler = useHandler((event) => {
    if (enabled) {
      insideEvents.current.add(event.nativeEvent);
    }
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      setTimeout(() => {
        if (insideEvents.current.has(event)) {
          insideEvents.current.delete(event);
        } else {
          outsideCallBack?.();
        }
      }, 0);
    };

    document.addEventListener('pointerdown', handlePointerDown, true);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
    };
  }, [outsideCallBack, enabled]);

  return pointEventHandler;
}
