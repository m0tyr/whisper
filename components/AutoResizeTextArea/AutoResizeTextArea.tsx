import React, { useRef, useEffect, useState } from 'react';

interface AutoResizeTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  maxRows?: number;
  onHeightChange?: (height: number) => void;
}

const AutoResizeTextarea: React.FC<AutoResizeTextareaProps> = ({
  maxRows = 5, 
  onFocus,
  style,
  ...props
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [height, setHeight] = useState<number>(36);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const charCount = textarea.value.length;
    const baseHeight = 36;
    const extraHeight = Math.floor(charCount / 25) * 18;
    const newHeight = Math.min(baseHeight + extraHeight, maxRows * 18);

    if (newHeight !== height) {
      setHeight(newHeight);
      textarea.style.setProperty('height', `${newHeight}px`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    adjustHeight();
    if (props.onKeyDown) props.onKeyDown(e);
  };

  useEffect(() => {
    adjustHeight();
  }, [props.value]);

  return (
    <textarea
      {...props}
      onFocus={onFocus}
      onKeyDown={handleKeyDown}
      ref={textareaRef}
      dir=''
      placeholder='Répondre a test...'
      style={{
        borderWidth: 0,
        marginRight: '4px',
        maxWidth: '100%',
        outline: 'none',
        overflowY: 'auto',
        padding: '0.5rem', 
        overflowX: 'auto',
        backgroundColor: 'transparent',
        width: '100%',
        resize: 'none',
        fontSize: '13px', 
        height: `${height}px`,
      }}
    />
  );
};

export default AutoResizeTextarea;
