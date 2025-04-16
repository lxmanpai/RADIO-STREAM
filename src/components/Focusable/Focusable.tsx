import React, { useEffect, useRef, useMemo } from "react";
import "./Focusable.css";

type Props = {
  focusKey: string;
  isFocused: boolean;
  focusStyles: boolean;
  customClassname?: string;
  onFocus: () => void;
  children: React.ReactNode;
};

const Focusable: React.FC<Props> = ({
  focusKey,
  isFocused,
  focusStyles,
  customClassname,
  onFocus,
  children,
}) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFocused && ref.current) {
      // Focus the element
      ref.current.focus();

      // Scroll into view only if the element is not already visible
      const boundingRect = ref.current.getBoundingClientRect();
      const isInView =
        boundingRect.top >= 0 &&
        boundingRect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight);

      if (!isInView) {
        ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [isFocused]);

  // Memoize the class name to avoid recalculating it on every render
  const className = useMemo(
    () =>
      `focusable ${focusStyles && isFocused ? "focused" : ""} ${
        customClassname ?? ""
      }`,
    [focusStyles, isFocused]
  );

  return (
    <div
      ref={ref}
      tabIndex={isFocused ? 0 : -1} // Ensure only the focused element is tabbable
      onFocus={onFocus}
      data-focus-key={focusKey}
      className={className}
    >
      {children}
    </div>
  );
};

export default Focusable;
