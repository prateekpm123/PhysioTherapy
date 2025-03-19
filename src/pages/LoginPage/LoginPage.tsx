import {
  Box,
  Card,
  Flex,
  Text,
  TextField,
  Button,
  Skeleton,
} from "@radix-ui/themes";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

export const LoginPage = () => {
  const loading = false;
  return (
    <>
      <Flex
        gap="3"
        direction="column"
        align="center"
        style={{ padding: "50px" }}
      >
        <Box width="500px">
          <Card size="5">
            <Flex gap="4" align="start" direction={"column"}>
              <Skeleton loading={loading}>
                <Text size="8" weight="bold">
                  Login
                </Text>
              </Skeleton>

              <Flex gap="4" direction="column" style={{ width: "100%" }}>
                <Skeleton loading={loading}>
                  <Text as="div" size="4" weight="bold">
                    Email
                  </Text>
                </Skeleton>
                <Skeleton loading={loading}>
                  <TextField.Root
                    placeholder="Email..."
                    size="3"
                    style={{ width: "100%", display: "flex" }}
                  >
                    <TextField.Slot>
                      <MagnifyingGlassIcon height="16" width="16" />
                    </TextField.Slot>
                  </TextField.Root>
                </Skeleton>
                <Skeleton loading={loading}>
                  <Text as="div" size="4" weight="bold">
                    Password
                  </Text>
                </Skeleton>
                <Skeleton loading={loading}>
                  <TextField.Root
                    placeholder="Password..."
                    size="3"
                    style={{ width: "100%" }}
                  >
                    <TextField.Slot side="left">
                      <MagnifyingGlassIcon height="16" width="16" />
                    </TextField.Slot>
                  </TextField.Root>
                </Skeleton>
                <Skeleton loading={loading}>
                  <Button
                    variant="outline"
                    size="3"
                    style={{ marginTop: "10px" }}
                  >
                    Edit profile
                  </Button>
                </Skeleton>
              </Flex>
            </Flex>
          </Card>
        </Box>
      </Flex>
    </>
  );
};
