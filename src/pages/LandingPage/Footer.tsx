// Footer.tsx
import { styled } from '@stitches/react';
import { Flex, Link, Container, Text } from '@radix-ui/themes';

const FooterContainer = styled('footer', {
  padding: '2rem 0',
  borderTop: '1px solid $gray6',
});

const FooterLink = styled(Link, {
  margin: '0 1rem',
  color: '$gray11',
  '&:hover': {
    color: '$gray12',
  },
});

const Footer = () => {
  return (
    <FooterContainer>
      <Container size="4">
        <Flex justify="between" align="start">
          <Flex direction="column">
            <Link href="#">PhysioCare</Link>
            <Flex mt="2">
              <Link href="#">[Facebook]</Link>
              <Link href="#">[Twitter]</Link>
              <Link href="#">[Instagram]</Link>
              <Link href="#">[LinkedIn]</Link>
            </Flex>
            <Link href="#">English</Link>
            <Text size="2" mt="2">
              We prioritize your privacy and do not sell or share your personal information.
            </Text>
            <Link href="#">Cookie settings</Link>
            <Text size="2" mt="2">
              © 2025 PhysioCare, Inc.
            </Text>
          </Flex>
          <Flex direction="column">
            <FooterLink href="#">About Us</FooterLink>
            <FooterLink href="#">Our Mission</FooterLink>
            <FooterLink href="#">Careers</FooterLink>
            <FooterLink href="#">Privacy Policy</FooterLink>
            <FooterLink href="#">Terms of Service</FooterLink>
          </Flex>
          <Flex direction="column">
            <FooterLink href="#">Resources</FooterLink>
            <FooterLink href="#">Help Center</FooterLink>
            <FooterLink href="#">Blog</FooterLink>
            <FooterLink href="#">Community</FooterLink>
          </Flex>
          <Flex direction="column">
            <FooterLink href="#">For Physiotherapists</FooterLink>
            <FooterLink href="#">Patient Management</FooterLink>
            <FooterLink href="#">AI Assistance</FooterLink>
          </Flex>
          <Flex direction="column">
            <FooterLink href="#">For Individuals</FooterLink>
            <FooterLink href="#">Symptom Checker</FooterLink>
            <FooterLink href="#">Exercise Recommendations</FooterLink>
          </Flex>
          <Flex direction="column">
            <Link href="#">Explore More →</Link>
          </Flex>
        </Flex>
      </Container>
    </FooterContainer>
  );
};

export default Footer;