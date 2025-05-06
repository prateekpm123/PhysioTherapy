import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, Text, Heading, TextArea, Flex, Select } from '@radix-ui/themes';
import { useSelector, useDispatch } from 'react-redux';
import { UserSessionStateType } from '../../../stores/userSessionStore'; // Changed to default import as per linter suggestion
import { DoctorDetails } from '../../../models/iDoctorDetails'; // Adjust path as needed
import { setDoctorDetails } from '../../../stores/userSessionSlice'; // Import the action
import { updateDoctor } from '../../../controllers/DoctorController'; // Import the API call
import { useToast, DefaultToastTiming, ToastColors } from '../../../stores/ToastContext'; // Import toast
import { FailedResponseDto } from '../../../dtos/FailedResponseDto'; // Import DTO
import { StatusAndErrorType } from '../../../models/StatusAndErrorType.enum'; // Import Enum

const DoctorProfileSettings = () => {
    const doctorDetails = useSelector(
        (state: UserSessionStateType) => state.userSession.doctorDetails
    );
    const dispatch = useDispatch(); // Get dispatch function
    const { showToast } = useToast(); // Get toast function
    const [isSubmitting, setIsSubmitting] = useState(false); // Add submitting state

    // Initialize state with all required fields
    const [formData, setFormData] = useState<Partial<DoctorDetails>>({
        name: '',
        age: 0,
        country_code: '+91', // Default country code
        phone_number: '' as unknown as bigint, // Initialize properly for bigint
        email: '',
        address: {
            address_line1: '',
            address_line2: '',
            district: '',
            state: '',
            country: '',
            pincode: 0,
        },
        doctor_specialization: '',
        doctor_qualification: '',
        doctor_experience: '',
        doctor_history: '',
        doctor_awards: '',
        doctor_certification: '',
        d_id: '', // Include d_id if needed for API, fetch from doctorDetails
    });

    // Populate form data from Redux store
    useEffect(() => {
        if (doctorDetails) {
            setFormData({
                name: doctorDetails.name || '',
                age: doctorDetails.age || 0,
                country_code: doctorDetails.country_code || '+91',
                phone_number: doctorDetails.phone_number || ('' as unknown as bigint),
                email: doctorDetails.email || '',
                address: {
                    address_line1: doctorDetails.address?.address_line1 || '',
                    address_line2: doctorDetails.address?.address_line2 || '',
                    district: doctorDetails.address?.district || '',
                    state: doctorDetails.address?.state || '',
                    country: doctorDetails.address?.country || '',
                    pincode: doctorDetails.address?.pincode || 0,
                },
                doctor_specialization: doctorDetails.doctor_specialization || '',
                doctor_qualification: doctorDetails.doctor_qualification || '',
                doctor_experience: doctorDetails.doctor_experience || '',
                doctor_history: doctorDetails.doctor_history || '',
                doctor_awards: doctorDetails.doctor_awards || '',
                doctor_certification: doctorDetails.doctor_certification || '',
                d_id: doctorDetails.d_id || '', // Populate d_id
            });
        }
    }, [doctorDetails]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        const addressFields = ['address_line1', 'address_line2', 'district', 'state', 'country', 'pincode'];

        if (addressFields.includes(name)) {
            setFormData(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [name]: name === 'pincode' ? (Number(value) || 0) : value,
                } as DoctorDetails['address'] // Type assertion for address object
            }));
        } else if (name === 'age') {
            setFormData(prev => ({ ...prev, [name]: Number(value) || 0 }));
        } else if (name === 'phone_number') {
            const digits = value.replace(/\D/g, '');
            const phoneValue = digits ? BigInt(digits) : (0n as unknown as bigint);
            setFormData(prev => ({ ...prev, [name]: phoneValue }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSelectChange = (value: string, name: string) => {
         setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (isSubmitting) return; // Prevent multiple submissions

        setIsSubmitting(true);

        // Ensure essential data like d_id is present if needed by the API
        const dataToSubmit = { 
            ...formData, 
            d_id: formData.d_id || doctorDetails.d_id // Ensure d_id is included
        };

        // Basic validation example (ensure required fields aren't empty)
        if (!dataToSubmit.name || !dataToSubmit.doctor_specialization || !dataToSubmit.doctor_qualification) {
            showToast("Please fill in all required fields.", DefaultToastTiming, ToastColors.YELLOW);
            setIsSubmitting(false);
            return;
        }
        
        // Add the d_id to the formData before sending if it's not already there
        // This depends on whether your form state includes d_id or if you get it directly from doctorDetails
        // const payload = { ...formData, d_id: doctorDetails.d_id }; 

        console.log("Submitting Profile Update:", dataToSubmit);

        await updateDoctor({
            data: dataToSubmit as DoctorDetails, // Pass the form data
            afterAPISuccess: handleUpdateSuccess,
            afterAPIFail: handleUpdateFail,
        });

    };

    const handleUpdateSuccess = (responseData: { doctor?: Partial<DoctorDetails> }) => {
        // Assuming API returns the updated doctor details or confirms success
        // If API returns updated data, use that, otherwise use current formData
        const updatedDetails = responseData?.doctor || formData; 

        dispatch(setDoctorDetails(updatedDetails as DoctorDetails));
        showToast(
            "Profile updated successfully!",
            DefaultToastTiming,
            ToastColors.GREEN
        );
        setIsSubmitting(false);
         console.log("Update successful", responseData);
    };

    const handleUpdateFail = (errorData: FailedResponseDto) => {
        console.error("Profile update failed:", errorData);
        let message = "Failed to update profile.";
        if (errorData.errorCode === StatusAndErrorType.Unauthorized) {
            message = "Session expired. Please log in again.";
        } else if (errorData.message) {
            message = errorData.message;
        }

        showToast(message, DefaultToastTiming, ToastColors.RED);
        setIsSubmitting(false);
    };

    return (
        <Box style={{ maxWidth: 700 }}> {/* Increased max width further */}
          <form onSubmit={handleSubmit}>
            <Heading mb="4">Profile Settings</Heading>

            {/* Personal Info Row */}
            <Flex direction={{ initial: 'column', sm: 'row' }} gap="3" mb="3">
                 {/* Name */}
                <Box mb="3" style={{ flexGrow: 1 }}>
                    <Box mb="1">
                      <Text as="label" htmlFor="name" size="2">Full Name</Text>
                    </Box>
                    <TextField.Root
                        id="name"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </Box>
                {/* Age */}
                <Box mb="3" style={{ minWidth: '100px' }}>
                    <Box mb="1">
                      <Text as="label" htmlFor="age" size="2">Age</Text>
                    </Box>
                    <TextField.Root
                        id="age"
                        name="age"
                        type="number"
                        placeholder="Age"
                        value={String(formData.age || '')} // Convert number to string for input
                        onChange={handleChange}
                        required
                        min="0"
                        max="150"
                    />
                </Box>
            </Flex>

            {/* Contact Info Row */}
             <Flex direction={{ initial: 'column', sm: 'row' }} gap="3" mb="3">
                {/* Phone Number */}
                <Box mb="3" style={{ flexGrow: 1 }}>
                    <Box mb="1">
                        <Text as="label" htmlFor="phone_number" size="2">Phone Number</Text>
                    </Box>
                    <Flex gap="1">
                        <Select.Root 
                            name="country_code"
                            value={formData.country_code}
                            onValueChange={(value) => handleSelectChange(value, 'country_code')}
                        >
                            <Select.Trigger style={{ minWidth: 80 }} />
                            <Select.Content>
                                <Select.Item value="+91">+91</Select.Item>
                                <Select.Item value="+1">+1</Select.Item>
                                <Select.Item value="+44">+44</Select.Item>
                                {/* Add more country codes if needed */}
                            </Select.Content>
                        </Select.Root>
                        <TextField.Root
                            id="phone_number"
                            name="phone_number"
                            type="tel"
                            placeholder="Enter phone number"
                            value={String(formData.phone_number || '')} // Convert bigint to string
                            onChange={handleChange}
                            required
                            style={{ flexGrow: 1 }}
                        />
                    </Flex>
                </Box>
                 {/* Email */}
                 <Box mb="3" style={{ flexGrow: 1 }}>
                    <Box mb="1">
                       <Text as="label" htmlFor="email" size="2">Email Address</Text>
                    </Box>
                    <TextField.Root
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange} // Keep onChange in case needed later, but disable editing
                        required
                        disabled
                        readOnly
                     />
                     <Text size="1" color="gray">Email cannot be changed.</Text>
                </Box>
            </Flex>

            {/* Address */}
            <Box mb="3">
                <Box mb="1">
                  <Text as="label" htmlFor="address" size="2">Address</Text>
                </Box>
                <TextArea
                    id="address"
                    name="address"
                    placeholder="Enter full address"
                    value={formData.address?.address_line1}
                    onChange={handleChange}
                    rows={3}
                />
            </Box>

             {/* Address Details Row */}
             <Flex direction={{ initial: 'column', sm: 'row' }} gap="3" mb="3">
                 {/* City */} 
                <Box mb="3" style={{ flexGrow: 1 }}>
                    <Box mb="1">
                       <Text as="label" htmlFor="district" size="2">City</Text>
                    </Box>
                    <TextField.Root
                        id="district"
                        name="district"
                        placeholder="Enter district"
                        value={formData.address?.district}
                        onChange={handleChange}
                        required
                    />
                </Box>
                {/* State */}
                <Box mb="3" style={{ flexGrow: 1 }}>
                    <Box mb="1">
                       <Text as="label" htmlFor="state" size="2">State / Province</Text>
                    </Box>
                    <TextField.Root
                        id="state"
                        name="state"
                        placeholder="Enter state or province"
                        value={formData.address?.state}
                        onChange={handleChange}
                        required
                    />
                </Box>
            </Flex>
            <Flex direction={{ initial: 'column', sm: 'row' }} gap="3" mb="3">
                {/* Pincode */}
                <Box mb="3" style={{ flexGrow: 1 }}>
                    <Box mb="1">
                       <Text as="label" htmlFor="pincode" size="2">Pincode / Zip Code</Text>
                    </Box>
                    <TextField.Root
                        id="pincode"
                        name="pincode"
                        type="number"
                        placeholder="Enter pincode"
                        value={String(formData.address?.pincode || 0)} // Convert number to string
                        onChange={handleChange}
                        required
                    />
                </Box>
                {/* Country */}
                <Box mb="3" style={{ flexGrow: 1 }}>
                    <Box mb="1">
                       <Text as="label" htmlFor="country" size="2">Country</Text>
                    </Box>
                    <TextField.Root
                        id="country"
                        name="country"
                        placeholder="Enter country"
                        value={formData.address?.country}
                        onChange={handleChange}
                        required
                    />
                </Box>
            </Flex>

            {/* --- Professional Details --- */} 
             <Heading size="4" mt="5" mb="3">Professional Details</Heading>

            {/* Specialization */}
             <Box mb="3">
                 <Box mb="1">
                   <Text as="label" htmlFor="doctor_specialization" size="2">Specialization</Text>
                 </Box>
                <TextField.Root
                    id="doctor_specialization"
                    name="doctor_specialization"
                    placeholder="e.g., Orthopedics, Neurology"
                    value={formData.doctor_specialization}
                    onChange={handleChange}
                    required
                />
            </Box>

            {/* Qualification */}
             <Box mb="3">
                <Box mb="1">
                  <Text as="label" htmlFor="doctor_qualification" size="2">Qualification</Text>
                </Box>
                <TextField.Root
                    id="doctor_qualification"
                    name="doctor_qualification"
                    placeholder="e.g., MBBS, MD"
                    value={formData.doctor_qualification}
                    onChange={handleChange}
                    required
                />
            </Box>

            {/* Experience */}
            <Box mb="3">
                <Box mb="1">
                  <Text as="label" htmlFor="doctor_experience" size="2">Experience</Text>
                </Box>
                <TextArea
                    id="doctor_experience"
                    name="doctor_experience"
                    placeholder="Describe your professional experience"
                    value={formData.doctor_experience}
                    onChange={handleChange}
                    rows={4}
                />
            </Box>

             {/* History */}
            <Box mb="3">
                <Box mb="1">
                  <Text as="label" htmlFor="doctor_history" size="2">Professional History</Text>
                </Box>
                <TextArea
                    id="doctor_history"
                    name="doctor_history"
                    placeholder="Details about your career history"
                    value={formData.doctor_history}
                    onChange={handleChange}
                    rows={4}
                />
            </Box>

             {/* Awards */}
            <Box mb="3">
                <Box mb="1">
                  <Text as="label" htmlFor="doctor_awards" size="2">Awards & Recognitions</Text>
                </Box>
                <TextArea
                    id="doctor_awards"
                    name="doctor_awards"
                    placeholder="List any relevant awards or recognitions"
                    value={formData.doctor_awards}
                    onChange={handleChange}
                    rows={3}
                />
            </Box>

             {/* Certifications */}
            <Box mb="3">
                <Box mb="1">
                  <Text as="label" htmlFor="doctor_certification" size="2">Certifications</Text>
                </Box>
                <TextArea
                    id="doctor_certification"
                    name="doctor_certification"
                    placeholder="List relevant certifications"
                    value={formData.doctor_certification}
                    onChange={handleChange}
                    rows={3}
                />
            </Box>

            <Button type="submit" mt="4" disabled={isSubmitting}> 
                {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </Box>
    );
}

export default DoctorProfileSettings;