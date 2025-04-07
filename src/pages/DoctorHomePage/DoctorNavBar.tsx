// Header.tsx
import { styled } from "@stitches/react";
import { Flex, Text, Avatar, DropdownMenu, Box } from "@radix-ui/themes";
import { Avatar as Avatar2 } from "radix-ui";
import { useSelector } from "react-redux";
import { UserSessionStateType } from "../../stores/userSessionStore";
import { useNavigate } from "react-router-dom";
import { clearAuthToken } from "../../utils/cookies";

const DropdownTrigger = styled("button", {
  background: "none",
  border: "none",
  padding: 0,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  "&:hover": {
    opacity: 0.8,
  },
});

const DoctorNavBar = () => {
  const user = useSelector(
    (state: UserSessionStateType) => state.userSession.user
  );
  const navigate = useNavigate();

  const onSignOutClick = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    clearAuthToken();
    navigate("/login");
  };

  const onSettingsClick = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    navigate("/doctorhome/settings");
  };

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <DropdownTrigger>
          <Avatar2.Root>
            <Avatar2.Image
              src={user.pictureUrl}
              alt={user.name}
              width={32}
              height={32}
              style={{ borderRadius: "50%" }}
            />
            <Avatar2.Fallback delayMs={600} style={{ width: 62, height: 62 }}>
              {user.name?.charAt(0)}
            </Avatar2.Fallback>
          </Avatar2.Root>
        </DropdownTrigger>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content>
        <DropdownMenu.Item style={{ height: 70 }}>
          <Flex gap="3" align="center">
            <Avatar
              size="3"
              src={user.pictureUrl}
              radius="full"
              fallback={user.name?.charAt(0)}
            />
            <Box>
              <Text as="div" size="2" weight="bold">
                {user.name}
              </Text>
              <Text as="div" size="2" color="gray">
                Doctor
              </Text>
            </Box>
          </Flex>
        </DropdownMenu.Item>
        <DropdownMenu.Item onClick={onSettingsClick} shortcut="⌘ ,">
          Settings
        </DropdownMenu.Item>
        <DropdownMenu.Separator />
        <DropdownMenu.Item shortcut="⌘ ⌫" color="red" onClick={onSignOutClick}>
          Sign Out
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};

export default DoctorNavBar;
