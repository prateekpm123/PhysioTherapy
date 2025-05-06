import React, { useState } from 'react';
import { Box, TextField, Button, Text, Heading } from '@radix-ui/themes';

const DoctorPasswordSettings = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setError(''); // Clear previous errors

        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }

        if (newPassword.length < 8) {
             setError('Password must be at least 8 characters long.');
             return;
        }

        // Add more complex password strength validation if needed

        // Handle password change logic here (e.g., call API)
        console.log('Password change requested');
        // Reset fields after successful submission potentially
        // setCurrentPassword('');
        // setNewPassword('');
        // setConfirmPassword('');
    };

    return (
        <Box style={{ maxWidth: 500 }}>
            <form onSubmit={handleSubmit}>
                <Heading mb="4">Password & Authentication</Heading>

                <Box mb="3">
                     <Box mb="1">
                       <Text as="label" htmlFor="current-password" size="2">Current Password</Text>
                     </Box>
                    <TextField.Root
                        id="current-password"
                        type="password"
                        placeholder="Enter your current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                </Box>

                <Box mb="3">
                    <Box mb="1">
                        <Text as="label" htmlFor="new-password" size="2">New Password</Text>
                    </Box>
                    <TextField.Root
                        id="new-password"
                        type="password"
                        placeholder="Enter new password (min. 8 characters)"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        minLength={8}
                    />
                </Box>

                <Box mb="3">
                    <Box mb="1">
                      <Text as="label" htmlFor="confirm-password" size="2">Confirm New Password</Text>
                    </Box>
                    <TextField.Root
                        id="confirm-password"
                        type="password"
                        placeholder="Confirm your new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength={8}
                    />
                </Box>

                {error && (
                    <Box mb="3">
                      <Text color="red" size="2">{error}</Text>
                    </Box>
                )}

                {/* Add section for Two-Factor Authentication (2FA) if needed */}

                <Button type="submit">Update Password</Button>
            </form>
        </Box>
    );
}

export default DoctorPasswordSettings; 