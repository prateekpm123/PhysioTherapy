import React, { useState } from "react";
import { Tooltip } from "radix-ui";
import { Flex, Text } from "@radix-ui/themes";
import { styled } from "@stitches/react";

export interface BreadcrumbItem {
  label: string;
  // element: React.ReactNode;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const BreadcrumbContainer = styled(Flex, {
  align: "center",
  flexWrap: "wrap",
  gap: "4px",
  "@media (max-width: 768px)": {
    fontSize: "0.9rem",
  },
});

const BreadcrumbText = styled(Text, {
  padding: "4px 8px",
  borderRadius: "4px",
  transition: "background-color 0.2s ease",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "200px",
  "@media (max-width: 768px)": {
    maxWidth: "150px",
    padding: "2px 4px",
  },
});

const Separator = styled(Text, {
  padding: "0px 3px",
  marginTop: "6px",
  fontSize: "0.7rem",
  "@media (max-width: 768px)": {
    padding: "0px 2px",
  },
});

const CustomBreadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <BreadcrumbContainer>
      {items.length > 0 && items.map((item, index) => (
        <React.Fragment key={index}>
          {item.onClick ? (
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <BreadcrumbText
                    onClick={item.onClick}
                    style={{
                      cursor: "pointer",
                      fontWeight: "bold",
                      backgroundColor: hoveredIndex === index ? "rgba(255, 255, 255, 0.1)" : "transparent",
                      backdropFilter: "blur(15px)",
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {item.label}
                  </BreadcrumbText>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content 
                    sideOffset={5} 
                    style={{ 
                      fontSize: "0.8rem", 
                      backgroundColor: "#222", 
                      color: "#fff", 
                      padding: "8px", 
                      borderRadius: "4px",
                      maxWidth: "300px",
                      wordBreak: "break-word"
                    }}
                  >
                    {item.label}
                    <Tooltip.Arrow style={{ fill: "#222" }} />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          ) : (
            <BreadcrumbText>{item.label}</BreadcrumbText>
          )}
          {index < items.length - 1 && <Separator>{ " / " }</Separator>}
        </React.Fragment>
      ))}
    </BreadcrumbContainer>
  );
};

export default CustomBreadcrumb;
