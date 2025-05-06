import React from 'react';
import { Box, Text, Heading, Card, Flex } from '@radix-ui/themes';

const DoctorBillingSettings = () => {

    // Fetch actual billing info from state/API
    const currentPlan = 'Premium Plan';
    const nextBillingDate = 'August 1, 2024';
    const paymentMethod = 'Visa ending in 1234';

    return (
        <Box style={{ maxWidth: 600 }}>
            <Heading mb="4">Billing & Plans</Heading>

            <Card mb="4">
                <Heading size="3" mb="2">Current Plan</Heading>
                <Text as="p" size="2" mb="1">You are currently on the <Text weight="bold">{currentPlan}</Text>.</Text>
                <Text as="p" size="2">Your next billing date is {nextBillingDate}.</Text>
                {/* Add button to change plan if applicable */}
            </Card>

            <Card>
                <Heading size="3" mb="2">Payment Method</Heading>
                <Text as="p" size="2">Your default payment method is {paymentMethod}.</Text>
                {/* Add button to update payment method */}
            </Card>

            {/* Add section for billing history if needed */}

        </Box>
    );
}

export default DoctorBillingSettings; 