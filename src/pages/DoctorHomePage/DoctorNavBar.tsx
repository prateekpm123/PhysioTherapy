// Header.tsx
import { styled } from "@stitches/react";
import { Flex, Link, Text,Avatar, DropdownMenu, Box } from "@radix-ui/themes";
import { Avatar as Avatar2}  from "radix-ui";
import { useSelector } from "react-redux";
import { UserSessionStateType } from "../../stores/userSessionStore";
import { useNavigate } from "react-router-dom";
import ThemeColorPallate from "../../assets/ThemeColorPallate";

const Nav = styled("nav", {
  width: "100vw",
  padding: "1rem 0",
  borderBottom: "1px solid $gray6",
  position: "sticky",
  top: 0,
  backgroundColor: "$background",
  zIndex: 10,
  display: "block",
});

const Logo = styled(Link, {
  fontSize: "1.5rem",
  fontWeight: "600",
  color: "$gray12",
});


const DoctorNavBar = () => {
  const user = useSelector(
    (state: UserSessionStateType) => state.userSession.user
  );

  const navigate = useNavigate();

  const onProfileClick = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    await fetch("http://localhost:3000/api/me", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: user.uid,
      },
    })
      .then((response) => response.json())
      .then((data) => console.log(data));
  };

  return (
    <Nav style={{ backgroundColor: ThemeColorPallate.foreground,  }}>
      <div style={{ width: "100%", padding: "0 1rem" }}>
        {/* Use a div with padding */}
        <Flex justify="between" align="center" style={{ width: "100%" }}>
          <Logo href="#">PhysioCare</Logo>
          <Flex style={{ flexGrow: 1, justifyContent: "center" }}>
            <Link onClick={()=> navigate('/doctorhome')} href="#" style={{color: "white"}} >Home Center</Link>
            {/* <NavLink href="#">Features</NavLink>
            <NavLink href="#">For Physiotherapists</NavLink>
            <NavLink href="#">For Individuals</NavLink>
            <NavLink href="#">Contact</NavLink> */}
          </Flex>
          <Flex
            style={{ justifyContent: "flex-end", marginRight: "1rem" }}
          ></Flex>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <button onClick={onProfileClick}>
                <Avatar2.Root className="AvatarRoot">
                  <Avatar2.Image
                    className="AvatarImage"
                    src={user.pictureUrl}
                    alt={user.name}
                    width={40}
                    height={40}
                    style={{ borderRadius: "50%" }}
                  />
                  <Avatar2.Fallback className="AvatarFallback" delayMs={600}>
                    CT
                  </Avatar2.Fallback>
                </Avatar2.Root>
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content style={{ width: "300px" }}>
              <DropdownMenu.Item  style={{height: 70}} >
                    <Flex gap="3" align="center">
                      <Avatar
                        size="3"
                        src={user.pictureUrl}
                        radius="full"
                        fallback="T"
                      />
                      <Box>
                        <Text as="div" size="2" weight="bold">
                          {user.name}
                        </Text>
                        <Text as="div" size="2" color="gray">
                          Engineering
                        </Text>
                      </Box>
                    </Flex>
              </DropdownMenu.Item>
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
              <DropdownMenu.Item
                shortcut="⌘ ⌫"
                color="red"
                onClick={onProfileClick}
              >
                Sign Out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </Flex>
      </div>
    </Nav>
  );
};

export default DoctorNavBar;
