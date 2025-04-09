import {
  // Button,
  // Dialog,
  Flex,
  Heading,
  ScrollArea,
  Text,
  Badge,
} from "@radix-ui/themes";
import { useLocation, useNavigate } from "react-router-dom";
import { iExcerciseData } from "../../../../models/ExcerciseInterface";
import Modal from "./TestModal";
// import { iExcerciseData } from "../../../../models/ExcerciseInterface";
// import ThemeColorPallate from "../../../../assets/ThemeColorPallate";
// import { BiExpand } from "react-icons/bi";

// Import Theme and Styles (adjust paths as needed)
import { themeColors, spacing, theme } from "../../../../theme/theme";
import { styled } from "@stitches/react";

// --- Styled Components (Copied/Adapted from AddExcercise.tsx) --- //
// (You might want to move these to a shared file later)

const StyledFormField = styled("div", {
  marginBottom: spacing.md,
});

const FieldLabel = styled(Text, {
  display: "block",
  color: themeColors.text.secondary,
  marginBottom: spacing.xs,
  fontSize: "0.9rem",
  fontWeight: "500",
});

const DetailText = styled(Text, {
  color: themeColors.text.primary,
  fontSize: "1rem",
  lineHeight: 1.5,
});

const DetailList = styled('ul', {
    listStyleType: "disc",
    marginLeft: spacing.lg, // Indent list
    paddingLeft: spacing.sm,
    color: themeColors.text.primary, // Set base color for list items
    fontSize: "1rem",
    lineHeight: 1.6,
    'li': {
        marginBottom: spacing.xs, // Space between list items
    }
});

const TagContainer = styled('div', {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.xs,
    marginTop: spacing.xs,
});

// Reusing TagBadge styling concept from TagInput
const DetailTagBadge = styled(Badge, {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '0.85rem',
    height: '24px',
    cursor: 'default',
    backgroundColor: themeColors.primary[200],
    color: themeColors.primary[800],
});

// Grid container for layout (Adapted from AddExcercise)
const DetailGrid = styled("div", {
  display: "grid",
  gap: spacing.lg,
  '@media (min-width: 768px)': {
    gridTemplateColumns: "1fr 2fr", // Image | Details
  },
  '@media (max-width: 767px)': {
    gridTemplateColumns: "1fr",
  }
});

// export interface iExcerciseDetailProps {
//   excercise: iExcerciseData;
// }

export const ExcerciseDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Add type safety check
  if (!location.state || !location.state.excercise) {
    // Handle the case where state is missing, maybe navigate back or show error
    console.error("Exercise detail state is missing!");
    // Example: navigate back
    // navigate(-1);
    return <Modal title="Error" onActionButtonClick={() => navigate(-1)} actionButtonText="Close"><Text>Exercise details not found.</Text></Modal>; // Or return null, or an error component
  }

  const excerciseDetailProp = location.state.excercise as iExcerciseData;

  // Helper to parse comma-separated tags
  const parseTags = (tagsString: string | undefined | null): string[] => {
      if (!tagsString) return [];
      return tagsString.split(',').map(t => t.trim()).filter(Boolean);
  }

  const musclesInvolved = parseTags(excerciseDetailProp.excercise_muscles_involved);
  const relatedConditions = parseTags(excerciseDetailProp.excercise_related_conditions);

  return (
    <Modal
        title={excerciseDetailProp.excercise_name || "Exercise Detail"} // Use exercise name as title
        onActionButtonClick={() => navigate(-1)}
        actionButtonText="Close" // Changed button text
    >
      {/* Use ScrollArea for the main content within the modal */}
      <ScrollArea style={{ height: "calc(100% - 60px)" }}>{/* Adjust height calculation based on modal header/footer */}
        <DetailGrid>
          {/* Column 1: Image */}
          <Flex direction="column" gap="3">
            <Heading size="4" style={{ color: themeColors.text.primary, marginBottom: spacing.sm }}>
                Image
            </Heading>
            {excerciseDetailProp.excercise_image_url ? (
               <img
                 src={excerciseDetailProp.excercise_image_url}
                 alt={excerciseDetailProp.excercise_name}
                 style={{
                     width: "100%",
                     borderRadius: theme.radius[2],
                     border: `1px solid ${themeColors.background.elevation3}`,
                     objectFit: 'contain',
                     maxHeight: '400px' // Limit image height if needed
                 }}
               />
            ) : (
                <Flex align="center" justify="center" style={{ height: '200px', backgroundColor: themeColors.background.elevation1, borderRadius: theme.radius[2] }}>
                    <Text color="gray">No Image Available</Text>
                </Flex>
            )}
          </Flex>

          {/* Column 2: Details */}
          <Flex direction="column" gap="4">

            <StyledFormField>
              <FieldLabel>Description / Instructions</FieldLabel>
              {excerciseDetailProp.excercise_description ? (
                  <DetailList>
                      {excerciseDetailProp.excercise_description
                          .split('\n')
                          .map((point: string, index: number) => (
                              point.trim() ? <li key={index}>{point.trim()}</li> : null // Render non-empty lines
                          ))}
                  </DetailList>
              ) : (
                  <DetailText color="gray">No description provided.</DetailText>
              )}
            </StyledFormField>

             {/* Grid for Sets/Reps & Descriptions */}
             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing.md }}>
                <StyledFormField>
                    <FieldLabel>Sets</FieldLabel>
                    <DetailText>{excerciseDetailProp.excercise_sets ?? 'N/A'}</DetailText>
                    {excerciseDetailProp.excercise_sets_description && (
                         <Text size="2" color="gray" style={{ display: 'block', marginTop: spacing.xs }}>
                             {excerciseDetailProp.excercise_sets_description}
                         </Text>
                     )}
                </StyledFormField>
                <StyledFormField>
                    <FieldLabel>Repetitions</FieldLabel>
                    <DetailText>{excerciseDetailProp.excercise_reps ?? 'N/A'}</DetailText>
                    {excerciseDetailProp.excercise_reps_description && (
                        <Text size="2" color="gray" style={{ display: 'block', marginTop: spacing.xs }}>
                            {excerciseDetailProp.excercise_reps_description}
                        </Text>
                     )}
                </StyledFormField>
             </div>

            {/* Muscles Involved */}
            <StyledFormField>
              <FieldLabel>Muscles Involved</FieldLabel>
              {musclesInvolved.length > 0 ? (
                <TagContainer>
                  {musclesInvolved.map((tag, index) => (
                    <DetailTagBadge key={`muscle-${index}`}>{tag}</DetailTagBadge>
                  ))}
                </TagContainer>
              ) : (
                 <DetailText color="gray">Not specified.</DetailText>
              )}
            </StyledFormField>

            {/* Related Conditions */}
            <StyledFormField>
              <FieldLabel>Related Conditions</FieldLabel>
              {relatedConditions.length > 0 ? (
                <TagContainer>
                  {relatedConditions.map((tag, index) => (
                    <DetailTagBadge key={`condition-${index}`}>{tag}</DetailTagBadge>
                  ))}
                </TagContainer>
              ) : (
                 <DetailText color="gray">Not specified.</DetailText>
              )}
            </StyledFormField>

            {/* Add more fields here as needed following the pattern */}
            {/* Example:
            <StyledFormField>
              <FieldLabel>Difficulty Level</FieldLabel>
              <DetailText>{excerciseDetailProp.excercise_level || 'N/A'}</DetailText>
            </StyledFormField>
            */}

          </Flex>
        </DetailGrid>
      </ScrollArea>
    </Modal>
  );
};
