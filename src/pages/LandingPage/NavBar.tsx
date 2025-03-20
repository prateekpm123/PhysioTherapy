// Header.tsx
import { styled } from '@stitches/react';
import { Flex, Link, Container, Button } from '@radix-ui/themes';

const Nav = styled('nav', {
  padding: '1rem 0',
  borderBottom: '1px solid $gray6',
});

const Logo = styled(Link, {
  fontSize: '1.5rem',
  fontWeight: '600',
  color: '$gray12',
});

const NavLink = styled(Link, {
  margin: '0 1rem',
  color: '$gray11',
  '&:hover': {
    color: '$gray12',
  },
});

const NavBar = () => {
  return (
    <Nav>
      <Container size="4">
        <Flex justify="between" align="center">
          <Logo href="#">PhysioCare</Logo>
          <Flex>
            <NavLink href="#">Home</NavLink>
            <NavLink href="#">Features</NavLink>
            <NavLink href="#">For Physiotherapists</NavLink>
            <NavLink href="#">For Individuals</NavLink>
            <NavLink href="#">Contact</NavLink>
          </Flex>
          <Flex>
            <NavLink href="#">Sign Up</NavLink>
            <NavLink href="#">Log In</NavLink>
            <Button variant="soft" color="blue">
              Get Started
            </Button>
          </Flex>
        </Flex>
      </Container>
    </Nav>
  );
};

export default NavBar;