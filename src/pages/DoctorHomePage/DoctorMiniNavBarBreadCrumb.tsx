import React from "react";
import { Flex, Link, Text } from "@radix-ui/themes";

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const CustomBreadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <Flex align="center">
      {items.length > 0 && items.map((item, index) => (
        <React.Fragment key={index}>
          {item.onClick ? (
            <Link onClick={item.onClick}>{item.label}</Link>
          ) : (
            <Text>{item.label}</Text>
          )}
          {index < items.length - 1 && <Text>{ " / " }</Text>}
        </React.Fragment>
      ))}
    </Flex>
  );
};

export default CustomBreadcrumb;

// import React from 'react';
// import CustomBreadcrumb from './CustomBreadcrumb'; // Adjust the import path

export const MyComponent: React.FC = () => {
  const handleHomeClick = () => {
    console.log("Home clicked!");
  };

  const handleProductsClick = () => {
    console.log("Products clicked!");
  };

  const breadcrumbItems = [
    { label: "Home", onClick: handleHomeClick },
    { label: "Products", onClick: handleProductsClick },
    { label: "Details" }, // No onClick, so it's just text
  ];

  return (
    <div>
      <CustomBreadcrumb items={breadcrumbItems} />
      {/* Your other content */}
    </div>
  );
};

// export default MyComponent;
