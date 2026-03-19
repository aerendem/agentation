import * as React from 'react';

type Bounds = {
  width: number | undefined;
  height: number | undefined;
};

/** Measures the width/height of an element using ResizeObserver. */
export const useMeasure = <T extends HTMLElement>(): [
  React.RefCallback<T>,
  Bounds,
] => {
  const [bounds, setBounds] = React.useState<Bounds>({
    width: undefined,
    height: undefined,
  });

  const [target, setTarget] = React.useState<T | null>(null);

  const callbackRef = React.useCallback((node: T | null) => {
    setTarget(node);
  }, []);

  React.useLayoutEffect(() => {
    if (!target) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      setBounds({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });
    observer.observe(target);

    return () => observer.disconnect();
  }, [target]);

  return [callbackRef, bounds];
};
