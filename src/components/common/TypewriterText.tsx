"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";

export type TypewriterLine = string | { text: string; className?: string };

export interface TypewriterTextProps {
  /** Single text string (can contain \n for multiple lines) */
  text?: string;
  /** Array of lines, optionally with individual line classNames */
  lines?: TypewriterLine[];
  /** Typing speed in ms per character (default 55) */
  speed?: number;
  /** Pause between lines in ms (default 180) */
  pauseBetweenLines?: number;
  /** Delay before typing starts once scrolled into view (default 0) */
  delay?: number;
  /** Whether to render blinking cursor (default true) */
  cursor?: boolean;
  /** Custom cursor color (default #cfbf9d) */
  cursorColor?: string;
  /** Custom cursor width/classes (default "w-[2px] sm:w-[3px]") */
  cursorClassName?: string;
  /** Polymorphic tag element (default "h2") */
  as?: React.ElementType;
  className?: string;
  /** Intersection observer trigger threshold (default 0.2) */
  threshold?: number;
  onComplete?: () => void;
}

export default function TypewriterText({
  text,
  lines,
  speed = 55,
  pauseBetweenLines = 180,
  delay = 0,
  cursor = true,
  cursorColor = "#cfbf9d",
  cursorClassName = "w-[2px] sm:w-[3px]",
  as: Component = "h2",
  className = "",
  threshold = 0.2,
  onComplete,
}: TypewriterTextProps) {
  // Normalize lines to an array of objects
  const parsedLines = useMemo(() => {
    if (lines && lines.length > 0) {
      return lines.map((item) =>
        typeof item === "string" ? { text: item, className: "" } : item
      );
    }
    if (text) {
      return text.split("\n").map((t) => ({ text: t, className: "" }));
    }
    return [];
  }, [text, lines]);

  const fullText = useMemo(
    () => parsedLines.map((l) => l.text).join(" "),
    [parsedLines]
  );

  const [displayedTexts, setDisplayedTexts] = useState<string[]>(() =>
    parsedLines.map(() => "")
  );
  const [activeLineIndex, setActiveLineIndex] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [cursorVisible, setCursorVisible] = useState<boolean>(true);

  const containerRef = useRef<HTMLElement | null>(null);
  const hasStartedRef = useRef<boolean>(false);

  useEffect(() => {
    if (parsedLines.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !hasStartedRef.current) {
          hasStartedRef.current = true;
          observer.disconnect();

          const startTyping = () => {
            let currentLine = 0;
            let currentChar = 0;

            const typeNextChar = () => {
              if (currentLine >= parsedLines.length) {
                setIsFinished(true);
                if (onComplete) onComplete();
                // Fade out cursor after 1.2s
                setTimeout(() => setCursorVisible(false), 1200);
                return;
              }

              const targetText = parsedLines[currentLine].text;

              if (currentChar < targetText.length) {
                currentChar++;
                setDisplayedTexts((prev) => {
                  const next = [...prev];
                  next[currentLine] = targetText.slice(0, currentChar);
                  return next;
                });
                setTimeout(typeNextChar, speed);
              } else {
                // Move to next line
                currentLine++;
                currentChar = 0;
                if (currentLine < parsedLines.length) {
                  setActiveLineIndex(currentLine);
                  setTimeout(typeNextChar, pauseBetweenLines);
                } else {
                  setIsFinished(true);
                  if (onComplete) onComplete();
                  setTimeout(() => setCursorVisible(false), 1200);
                }
              }
            };

            typeNextChar();
          };

          if (delay > 0) {
            setTimeout(startTyping, delay);
          } else {
            startTyping();
          }
        }
      },
      { threshold }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [parsedLines, speed, pauseBetweenLines, delay, threshold, onComplete]);

  return (
    <Component
      ref={containerRef}
      aria-label={fullText}
      className={className}
    >
      {parsedLines.map((lineObj, idx) => {
        const isCurrentActive = idx === activeLineIndex;
        const showCursorHere =
          cursor &&
          cursorVisible &&
          (isCurrentActive || (isFinished && idx === parsedLines.length - 1));

        return (
          <span
            key={idx}
            className={`block min-h-[1.15em] ${lineObj.className || ""}`}
          >
            {displayedTexts[idx] || ""}
            {!displayedTexts[idx] && !showCursorHere && (
              <span className="invisible select-none" aria-hidden="true">
                &nbsp;
              </span>
            )}
            {showCursorHere && (
              <span
                style={{ backgroundColor: cursorColor }}
                className={`inline-block ${cursorClassName} h-[0.75em] ml-1.5 align-baseline ${
                  isFinished
                    ? "transition-opacity duration-700 opacity-0"
                    : "animate-pulse"
                }`}
              />
            )}
          </span>
        );
      })}
    </Component>
  );
}
