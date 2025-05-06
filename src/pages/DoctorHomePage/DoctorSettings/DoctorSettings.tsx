import { Outlet, NavLink } from "react-router-dom";
import { styled } from "@stitches/react";
import { Flex, Box, Text } from "@radix-ui/themes"; // Assuming Radix is used based on App.tsx
import { PersonIcon, GearIcon, LockClosedIcon, BellIcon, TokensIcon } from '@radix-ui/react-icons'; // Import icons

const SettingsContainer = styled(Flex, {
  height: 'calc(100vh - 64px)', // Assuming top bar height is 64px
});

const Sidebar = styled(Box, {
  width: '250px',
  borderRight: '1px solid $gray6',
  padding: '$4',
  backgroundColor: '$gray2',
  display: 'flex',
  flexDirection: 'column',
  gap: '$2',
});

const ContentArea = styled(Box, {
  flex: 1,
  padding: '$4',
  overflowY: 'auto', // Allow content scrolling
});

const StyledNavLink = styled(NavLink, {
  padding: '$2 $3 $2 $5',
  borderRadius: '$2',
  textDecoration: 'none',
  color: '$gray11',
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  gap: '$3',
  '&:hover': {
    backgroundColor: '$gray4',
  },
  '&.active': {
    backgroundColor: '$blue4',
    color: '$blue11',
    fontWeight: '500',
    '&::before': {
      content: '',
      position: 'absolute',
      left: 0,
      top: '5px',
      bottom: '5px',
      width: '4px',
      backgroundColor: '$blue9',
      borderRadius: '2px',
    }
  },
});


const DoctorSettings = () => {
    return (
        <SettingsContainer>
            <Sidebar>
                <StyledNavLink to="profile">
                    <PersonIcon width="18" height="18" />
                    <Text>Profile</Text>
                </StyledNavLink>
                <StyledNavLink to="account">
                    <GearIcon width="18" height="18" />
                    <Text>Account</Text>
                </StyledNavLink>
                <StyledNavLink to="password">
                    <LockClosedIcon width="18" height="18" />
                    <Text>Password & Authentication</Text>
                </StyledNavLink>
                <StyledNavLink to="notifications">
                    <BellIcon width="18" height="18" />
                    <Text>Notifications</Text>
                </StyledNavLink>
                <StyledNavLink to="billing">
                    <TokensIcon width="18" height="18" />
                    <Text>Billing & Plans</Text>
                </StyledNavLink>
                {/* Add more links as needed */}
            </Sidebar>
            <ContentArea>
                 <Outlet />
            </ContentArea>
        </SettingsContainer>
    );
}

export default DoctorSettings;