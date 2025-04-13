import { styled } from "@stitches/react";
import {
  Container,
  Flex,
  Heading,
  Text,
  IconButton,
  Card,
  Grid,
  Button,
} from "@radix-ui/themes";
import NavBar from "./NavBar";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom"; // Add this import
import React from "react";

// The styled function allows you to define reusable, scoped styles for components.
const Main = styled("main", {
  padding: "4rem 0",
  textAlign: "center",
  backgroundColor: "$gray1",
  color: "$gray12",
});

const Section = styled("section", {
  padding: "4rem 0",
  textAlign: "left",
});

const FeatureCard = styled(Card, {
  padding: "2rem",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  height: "100%",
});

const QuoteCard = styled(Card, {
  padding: "3rem",
  borderRadius: "8px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
});

const StickyNavBar = styled("div", {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  zIndex: 1000,
  backgroundColor: "rgba(34, 34, 34, 0.5)", // Translucent background
  backdropFilter: "blur(20px)", // Blur effect
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)", // Add a shadow for better visibility
});

const LandingPage = () => {
  const navigate = useNavigate(); // Initialize the navigation hook

  return (
    <>
      <StickyNavBar>
        <NavBar />
      </StickyNavBar>
      {/* Add padding to the main content to account for the fixed navbar */}
      <Main style={{ paddingTop: "80px" }}>
        <Container size="4" style={{ margin: "40vh 0vh" }}>
          <Heading as="h1" size="9" mb="3">
            Your One-Stop Solution for Physiotherapy Management and Assistance
          </Heading>
        </Container>
        {/* <Flex justify="center" align="center" direction="row" mb="5"> */}
        <Grid
          columns={{ initial: "1", md: "2" }}
          gap="4"
          mb="5"
          ml="7"
          style={{ margin: "0rem 11rem" }}
        >
          <FeatureCard size="4" mb="5">
            <Flex
              direction="column"
              align="center"
              justify="center"
              style={{ height: "100%" }}
            >
              <Heading as="h2" size="3" mb="3">
                For Physiotherapists
              </Heading>
              <Text as="p" size="3" mb="4" style={{ textAlign: "center" }}>
                Empowering physiotherapists to manage patient data, track
                progress, and provide personalized treatments with AI-powered
                tools.
              </Text>
              <Button
                mt="3"
                style={{ width: "80%" }}
                variant="outline"
                onClick={() => navigate("/signup")} // Navigate to Sign-Up page
              >
                Check Out
              </Button>
            </Flex>
          </FeatureCard>
          <FeatureCard size="4">
            <Flex
              direction="column"
              align="center"
              justify="center"
              style={{ height: "100%" }}
            >
              <Heading as="h2" size="3" mb="3">
                For Individuals
              </Heading>
              <Text as="p" size="3" mb="4" style={{ textAlign: "center" }}>
                Get insights into your condition and determine if you need a
                physiotherapy visit by describing your symptoms.
              </Text>
              <Button
                mt="3"
                style={{ width: "80%" }}
                variant="outline"
                onClick={() => navigate("/signup")} // Navigate to Sign-Up page
              >
                Check Out
              </Button>
            </Flex>
          </FeatureCard>
        </Grid>
        {/* </Flex> */}

        <Section>
          <Container size="4">
            <Grid columns={{ initial: "1", md: "2" }} gap="4">
              <FeatureCard>
                <Flex align="center" mb="3">
                  <IconButton variant="soft" color="blue">
                    {/* Replace with your icon */}📊
                  </IconButton>
                  <Heading as="h2" size="3" ml="2">
                    Advanced Patient Management
                  </Heading>
                </Flex>
                <Text size="3">
                  Manage all your patients' data with in-depth tracking,
                  follow-ups, and personalized treatment plans to ensure optimal
                  care.
                </Text>
              </FeatureCard>
              <FeatureCard>
                <Flex align="center" mb="3">
                  <IconButton variant="soft" color="blue">
                    {/* Replace with your icon */}🤖
                  </IconButton>
                  <Heading as="h2" size="3" ml="2">
                    AI-Powered Insights and Recommendations
                  </Heading>
                </Flex>
                <Text size="3">
                  Utilize AI to analyze patient data, suggest exercises, and
                  provide diagnostic insights to enhance treatment outcomes.
                </Text>
              </FeatureCard>
            </Grid>
          </Container>
        </Section>

        <Section>
          <Container size="3">
            <QuoteCard>
              <Text size="4" weight="medium" mb="2">
                "This platform has transformed how I manage my practice. The AI
                recommendations and tracking tools are invaluable!"
              </Text>
              <Text size="3" weight="bold" mb="1">
                Dr. Sarah Johnson
              </Text>
              <Text size="3">Physiotherapist, Wellness Clinic</Text>
            </QuoteCard>
          </Container>
        </Section>

        <Section>
          <Container size="4">
            <Heading as="h2" size="3" mb="3">
              For Individuals: Understand Your Needs
            </Heading>
            <Text size="3" mb="4">
              Unsure if you need physiotherapy? Describe your symptoms, and our
              platform will provide insights and recommend whether a visit to a
              physiotherapist is necessary.
            </Text>
          </Container>
        </Section>
      </Main>
      <Footer />
    </>
  );
};

export default LandingPage;
