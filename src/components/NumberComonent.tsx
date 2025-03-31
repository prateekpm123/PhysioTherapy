// import { Flex, TextField, Button } from "@radix-ui/themes";
// import { SetStateAction, useRef } from "react";

// interface iNumberComponent {
//   number: number;
//   setNumber?: React.Dispatch<SetStateAction<number>>;
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   handleInputChange?: (e: any, index: any, property_name: any) => void;
//   index?: number;
//   property_name?: string;
// }

// const NumberComponent = ({
//   number,
//   setNumber,
//   handleInputChange,
//   index,
//   property_name,
// }: iNumberComponent) => {
//   const ref = useRef<HTMLInputElement>(null);
//   const internalHandleInputChange = (event: { target: { value: string } }) => {
//     if (handleInputChange) {
//       handleInputChange(event, index, property_name);
//       return;
//     }
//     const newValue = parseInt(event.target.value, 10);
//     if (!isNaN(newValue)) {
//       if (setNumber) {
//         setNumber(newValue);
//       } else {
//         number = newValue;
//         ref.current!.value = number.toString();
//       }
//     }
//   };

//   const onClick = (number: number, action: string) => {
//     if (action === "increment") {
//       ref.current!.value = (Number(ref.current!.value) + 1).toString();
//     } else {
//       ref.current!.value = (Number(ref.current!.value) - 1).toString();
//     }
//     ref.current!.setAttribute("value", ref.current!.value)
//     // // Trigger onChange manually
//     // const event = new Event("change", { bubbles: true }); // bubbles: true allows the event to propagate up the DOM tree
//     // ref.current!.dispatchEvent(event);

//     // Call internalHandleInputChange directly
//     internalHandleInputChange({ target: { value: ref.current!.value.toString() } });
//     return number;
//   };
//   return (
//     <>
//       <Flex direction="row" gap="2" align="center" justify="center">
//         <Button variant="surface" onClick={() => onClick(number, "decrement")}>
//           -
//         </Button>
//         <TextField.Root
//           inputMode="numeric"
//           ref={ref}
//           onChange={internalHandleInputChange}
//           value={number}
//           style={{ width: "30px", backgroundColor: "inherit", border: "none" }}
//         ></TextField.Root>
//         <Button variant="surface" onClick={() => onClick(number, "increment")}>
//           +
//         </Button>
//       </Flex>
//     </>
//   );
// };

// export default NumberComponent;


import { Flex, TextField, Button } from "@radix-ui/themes";
import { useCallback, useState } from "react";

interface iNumberComponent {
  initialValue: number;
  // setNumber?: React.Dispatch<SetStateAction<number>>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleInputChange?: (e: any, index: any, property_name: any) => void;
  index?: number;
  property_name?: string;
}

const NumberComponent = ({
  initialValue,
  handleInputChange,
  index,
  property_name,
}: iNumberComponent) => {
  const [number, setNumber] = useState(initialValue || 0);

  const increment = useCallback(() => {
    setNumber((prevNumber) => prevNumber + 1);
    if (handleInputChange) {
      handleInputChange({ target: { value: number+1 } }, index, property_name);
    }
  }, [number, handleInputChange]);

  const decrement = useCallback(() => {
    setNumber((prevNumber) => prevNumber - 1);
    if (handleInputChange) {
      handleInputChange({ target: { value: number -1 } }, index, property_name);
    }
  }, [number, handleInputChange]);


  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseInt(event.target.value, 10);
    if (!isNaN(newValue)) {
      setNumber(newValue);
      if(handleInputChange) {
        handleInputChange({ target: { value: newValue } }, index, property_name);
      }
    }
  };

  return (
    <>
      <Flex direction="row" gap="2" align="center" justify="center">
        <Button variant="surface" onClick={decrement} size="4">
          -
        </Button>
        <TextField.Root
          inputMode="numeric"
          onChange={onInputChange}
          value={number}
          style={{ width: "40px", backgroundColor: "inherit", border: "none", height: "3rem" }}
        ></TextField.Root>
        <Button variant="surface" onClick={increment} size="4">
          +
        </Button>
      </Flex>
    </>
  );
};

export default NumberComponent;
