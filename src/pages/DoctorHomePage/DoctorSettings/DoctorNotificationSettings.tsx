import React, { useState } from 'react';
import { Box, TextField, Button, Text, Heading, Flex, Switch } from '@radix-ui/themes';

const DoctorNotificationSettings = () => {
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(false);

    // Fetch initial notification settings from user data

    const handleSaveChanges = () => {
        // Logic to save notification preferences
        console.log('Notification settings saved:', { emailNotifications, smsNotifications });
    };

    return (
        <Box style={{ maxWidth: 500 }}>
            <Heading mb="4">Notification Settings</Heading>

            <Box mb="4">
                <Heading size="3" mb="2">Notification Channels</Heading>
                <Flex direction="column" gap="3">
                    <Flex as="label" align="center" justify="between">
                        <Text size="2">Email Notifications</Text>
                        <Switch
                            checked={emailNotifications}
                            onCheckedChange={setEmailNotifications}
                        />
                    </Flex>
                    <Flex as="label" align="center" justify="between">
                        <Text size="2">SMS Notifications</Text>
                        <Switch
                            checked={smsNotifications}
                            onCheckedChange={setSmsNotifications}
                            disabled // Example: Disable if phone number not verified
                        />
                    </Flex>
                </Flex>
            </Box>

            {/* Add more specific notification toggles if needed (e.g., new appointment, message received) */}

            <Button onClick={handleSaveChanges}>Save Changes</Button>
        </Box>
    );
}

export default DoctorNotificationSettings; 