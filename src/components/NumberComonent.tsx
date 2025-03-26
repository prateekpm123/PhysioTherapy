import { Flex, TextField, Button } from "@radix-ui/themes";
import { SetStateAction } from "react";

interface iNumberComponent {
  number: number;
  setNumber: React.Dispatch<SetStateAction<number>>;
}

const NumberComponent = ({number, setNumber}: iNumberComponent) => {
    const handleInputChange = (event: { target: { value: string; }; }) => {
        const newValue = parseInt(event.target.value, 10);
        if (!isNaN(newValue)) {
          setNumber(newValue);
        }
      };
  return (
    <>
      <Flex direction="row" gap="2" align="center" justify="center">
        <Button variant="surface"   onClick={() => setNumber(number - 1)}>
            -
        </Button>
        <TextField.Root onChange={handleInputChange} value={number} style={{width: "30px", backgroundColor: "inherit", border: "none"}}>
        </TextField.Root>
        <Button variant="surface" onClick={() => setNumber(number+1)}>
            +
        </Button>
      </Flex>
    </>
  );
};

export default NumberComponent;
