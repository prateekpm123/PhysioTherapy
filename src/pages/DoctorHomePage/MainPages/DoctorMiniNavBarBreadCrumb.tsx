import React, { useState } from "react";
import { Tooltip } from "radix-ui";
import { Flex, Text } from "@radix-ui/themes";

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const CustomBreadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <Flex align="center">
      {items.length > 0 && items.map((item, index) => (
        <React.Fragment key={index}>
          {item.onClick ? (
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Text
                    onClick={item.onClick}
                    style={{
                      cursor: "pointer",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontWeight: "bold",
                      backgroundColor: hoveredIndex === index ? "rgba(255, 255, 255, 0.1)" : "transparent",
                      backdropFilter: "blur(15px)",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {item.label}
                  </Text>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content sideOffset={5} style={{ fontSize: "0.8rem", backgroundColor: "#222", color: "#fff", padding: "8px", borderRadius: "4px" }}>
                    {item.label}
                    <Tooltip.Arrow style={{ fill: "#222" }} />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          ) : (
            <Text style={{ padding: "4px 8px" }}>{item.label}</Text>
          )}
          {index < items.length - 1 && <Text className="text-sm" style={{ padding: "0px 4px" }}>{ " / " }</Text>}
        </React.Fragment>
      ))}
    </Flex>
  );
};

export default CustomBreadcrumb;
