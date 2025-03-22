// src/components/Toast.tsx
import { Cross2Icon, InfoCircledIcon } from "@radix-ui/react-icons";
import { Callout, Flex } from "@radix-ui/themes";
import React, { useState, useEffect } from "react";
// import { FaCross } from "react-icons/fa";

interface ToastProps {
  message: string;
  color?: ToastColors;
  duration?: number; // Duration in milliseconds (default: 3000)
  onClose?: () => void;
}

export enum ToastColors {
    BLUE = "blue",
    RED = "red",
    GREEN = "green"
}

const Toast: React.FC<ToastProps> = ({
  message,
  color,
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose();
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) {
    return null;
  }

  return (
    <Callout.Root
      color={color}
      style={{ position: "fixed", top: 40, right: 20, zIndex: 1000 }}
    >
      <Callout.Icon>
        <InfoCircledIcon />
      </Callout.Icon>
      <Flex direction="row" align="center" justify="between">
        <Callout.Text style={{ marginRight: 20 }}>{message}</Callout.Text>
        <Cross2Icon
          onClick={() => {
            setIsVisible(false);
            if (onClose) {
              onClose();
            }
          }}
        >
        </Cross2Icon>
      </Flex>
    </Callout.Root>
  );
};

export default Toast;
