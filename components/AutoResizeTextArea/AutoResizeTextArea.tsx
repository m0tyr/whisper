import React, { useRef, useLayoutEffect, useState, useEffect } from "react";

interface AutoResizeTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  setLetterCount: any;
  maxRows?: number;
  minRows?: number;
  onHeightChange?: (height: number) => void;
}

const AutoResizeTextarea: React.FC<AutoResizeTextareaProps> = ({
  setLetterCount,
  maxRows = 5,
  minRows = 1,
  onFocus,
  onChange,
  onInput,
  onHeightChange,
  style,
  ...props
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [height, setHeight] = useState<number>(36);

  // Function to calculate height and row heights based on content
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    if (textarea.textLength === 0) {
      setHeight(36);
      return;
    }

    // Get the scroll height and client height
    const scrollHeight = textarea.scrollHeight;
    const clientHeight = textarea.clientHeight;
    const lineHeight = parseFloat(
      getComputedStyle(textarea).lineHeight || "18px"
    ); // Use computed line height

    // Calculate rows needed
    const rows = Math.ceil(scrollHeight / lineHeight);
    const maxHeight = maxRows * lineHeight;
    const minHeight = minRows * lineHeight;

    // Determine the new height
    const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);

    // Update height if changed
    if (newHeight !== height) {
      setHeight(newHeight);
      textarea.style.setProperty("height", `${newHeight}px`, "important");
      if (onHeightChange) onHeightChange(newHeight);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (textareaRef.current) {
      setLetterCount(textareaRef.current.textLength);
    }
    adjustHeight();
    if (onInput) onInput(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    adjustHeight();
    if (onChange) onChange(e);
  };

  useLayoutEffect(() => {
    adjustHeight();
  }, [props.value]);

  useEffect(() => {
    const handleResize = () => adjustHeight();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <textarea
      {...props}
      onFocus={onFocus}
      onChange={handleChange}
      onInput={handleInput}
      ref={textareaRef}
      placeholder="Répondre a test..."
      style={{
        borderWidth: 0,
        marginRight: "4px",
        maxWidth: "100%",
        outline: "none",
        overflowY: "auto",
        padding: "0.5rem",
        overflowX: "auto",
        backgroundColor: "transparent",
        width: "100%",
        resize: "none",
        fontSize: "13px",
        height: `${height}px`,
        ...style,
      }}
    />
  );
};

export default AutoResizeTextarea;
