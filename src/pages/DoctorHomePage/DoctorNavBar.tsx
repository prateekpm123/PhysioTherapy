// Header.tsx
import { styled } from "@stitches/react";
import {
  Flex,
  Link,
  Container,
  Button,
  Box,
  DropdownMenu,
} from "@radix-ui/themes";
import { Avatar } from "radix-ui";
import { useSelector } from "react-redux";
import { UserSessionStateType } from "../../stores/userSessionStore";

const Nav = styled("nav", {
  padding: "1rem 0",
  borderBottom: "1px solid $gray6",
});

const Logo = styled(Link, {
  fontSize: "1.5rem",
  fontWeight: "600",
  color: "$gray12",
});

const NavLink = styled(Link, {
  margin: "0 1rem",
  color: "$gray11",
  "&:hover": {
    color: "$gray12",
  },
});


const DoctorNavBar = () => {
  const user = useSelector((state: UserSessionStateType) => state.userSession.user);


  const onClickOfSignOut = () => {

  }

  return (
    <Nav>
      <Container size="4">
        <Flex justify="between" align="stretch">
          <Logo href="#">PhysioCare</Logo>
          <Flex style={{ flexGrow: 1, justifyContent: "center" }}>
            <NavLink href="#">Home</NavLink>
            <NavLink href="#">Features</NavLink>
            <NavLink href="#">For Physiotherapists</NavLink>
            <NavLink href="#">For Individuals</NavLink>
            <NavLink href="#">Contact</NavLink>
          </Flex>
          <Flex style={{ justifyContent: "flex-end", marginRight: "1rem" }}>
            <NavLink href="#">Sign Up</NavLink>
            <NavLink href="#">Log In</NavLink>
            <Button variant="soft" color="blue">
              Get Started
            </Button>
          </Flex>
          <Box></Box>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <button>
                <Avatar.Root className="AvatarRoot">
                  <Avatar.Image
                    className="AvatarImage"
                    src={user.pictureUrl}
                    alt={user.name}
                    width={40}
                    height={40}
                    style={{borderRadius: "50%"}}
                  />
                  <Avatar.Fallback className="AvatarFallback" delayMs={600}>
                    CT
                  </Avatar.Fallback>
                </Avatar.Root>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content style={{width: "250px"}}>
              <DropdownMenu.Item shortcut="⌘ ,">Setting</DropdownMenu.Item>
              <DropdownMenu.Item shortcut="⌘ D">Duplicate</DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item shortcut="⌘ N">Archive</DropdownMenu.Item>

              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger>More</DropdownMenu.SubTrigger>
                <DropdownMenu.SubContent>
                  <DropdownMenu.Item>Move to project…</DropdownMenu.Item>
                  <DropdownMenu.Item>Move to folder…</DropdownMenu.Item>

                  <DropdownMenu.Separator />
                  <DropdownMenu.Item>Advanced options…</DropdownMenu.Item>
                </DropdownMenu.SubContent>
              </DropdownMenu.Sub>

              <DropdownMenu.Separator />
              <DropdownMenu.Item>Share</DropdownMenu.Item>
              <DropdownMenu.Item>Add to favorites</DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item shortcut="⌘ ⌫" color="red" onClick={onClickOfSignOut}>
                Sign Out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Flex>
      </Container>
    </Nav>
  );
};

export default DoctorNavBar;
