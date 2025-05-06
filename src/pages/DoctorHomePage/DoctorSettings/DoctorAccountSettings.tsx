import React, { useState } from 'react';
import { Box, TextField, Button, Text, Heading } from '@radix-ui/themes';

const DoctorAccountSettings = () => {
    // Assuming email is fetched from user data and not changeable here
    const email = "doctor@example.com";
    const [username, setUsername] = useState('DoctorUser123');
    const [phoneNumber, setPhoneNumber] = useState('123-456-7890');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // Handle form submission logic here
        console.log('Account settings Updated:', { username, phoneNumber });
    };

    return (
        <Box style={{ maxWidth: 500 }}>
            <form onSubmit={handleSubmit}>
                <Heading mb="4">Account Settings</Heading>

                <Box mb="3">
                    <Box mb="1">
                       <Text as="label" htmlFor="username" size="2">Username</Text>
                    </Box>
                    <TextField.Root
                        id="username"
                        placeholder="Enter a username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </Box>

                <Box mb="3">
                    <Box mb="1">
                       <Text as="label" htmlFor="email" size="2">Email Address</Text>
                    </Box>
                    <TextField.Root
                        id="email"
                        type="email"
                        value={email} // Display fetched email
                        disabled // Make email field read-only
                        readOnly
                     />
                    <Text size="1" color="gray">Email cannot be changed here.</Text> {/* Optional helper text */}
                </Box>

                <Box mb="3">
                    <Box mb="1">
                        <Text as="label" htmlFor="phone" size="2">Phone Number</Text>
                     </Box>
                    <TextField.Root
                        id="phone"
                        type="tel" // Use type="tel" for phone numbers
                        placeholder="Enter your phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        // Add pattern validation for phone number format if needed
                        // pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                    />
                </Box>

                {/* Add options for changing email (might require verification flow) */}
                {/* Add account deletion option */}

                <Button type="submit">Save Changes</Button>
            </form>
        </Box>
    );
}

export default DoctorAccountSettings; 