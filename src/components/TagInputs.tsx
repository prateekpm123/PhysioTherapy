import React, { useState, KeyboardEvent, ChangeEvent, useCallback } from 'react';
import { Badge, IconButton } from '@radix-ui/themes';
import { Cross1Icon } from '@radix-ui/react-icons';
import { styled } from '@stitches/react'; // Assuming stitches is used and configured
import { themeColors, spacing, theme } from '../theme/theme'; // Adjust path if needed

// --- Styling (adapt from NewPatientEntry/CreateExcercisePlanPage) ---
const TagInputContainer = styled('div', {
    border: `1px solid ${themeColors.background.elevation3}`, // Use theme colors
    borderRadius: theme.radius[2],
    padding: spacing.xs,
    backgroundColor: themeColors.background.elevation1, // Use theme colors
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.xs,
    alignItems: 'center',
    minHeight: '36px', // Match typical input height
    cursor: 'text',
    '&:focus-within': {
        borderColor: themeColors.primary[500],
        boxShadow: `0 0 0 1px ${themeColors.primary[500]}`,
    },
});

const TagBadge = styled(Badge, {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    paddingRight: '2px', // Space for the button
    fontSize: '0.85rem',
    height: '24px',
    cursor: 'default',
    backgroundColor: themeColors.primary[200], // Example: Use theme colors
    color: themeColors.primary[800], // Example: Use theme colors
});

const TagRemoveButton = styled(IconButton, {
    height: '16px',
    width: '16px',
    minWidth: '16px',
    cursor: 'pointer',
    color: themeColors.primary[700], // Example: Use theme color if available
    '&:hover': {
        backgroundColor: themeColors.primary[100], // Example: Use theme color if available
    },
});

const StyledInput = styled('input', {
    border: 'none',
    outline: 'none',
    boxShadow: 'none',
    backgroundColor: 'transparent',
    flexGrow: 1,
    minWidth: '100px', // Ensure input doesn't become too small
    padding: '2px 4px', // Minimal padding
    color: themeColors.text.primary, // Use theme color
    fontSize: '1rem', // Match other inputs
    height: '28px', // Ensure consistent height within container
    '&:focus': {
        boxShadow: 'none', // Remove focus shadow from inner input
    },
    '&::placeholder': {
        color: themeColors.text.disabled, // Use theme color
    },
});
// --- End Styling ---

interface TagInputProps {
    id?: string;
    placeholder?: string;
    initialTags?: string[]; // Use array for easier handling internally
    onChange: (tags: string[]) => void; // Pass array back
    delimiters?: string[]; // e.g., [',', 'Enter']
}

const TagInput: React.FC<TagInputProps> = ({
    id,
    placeholder = "Add tags...",
    initialTags = [],
    onChange,
    delimiters = [',', 'Enter'],
}) => {
    const [tags, setTags] = useState<string[]>(initialTags);
    const [inputValue, setInputValue] = useState<string>('');
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Memoize updateTags to prevent unnecessary re-renders if onChange is stable
    const updateTags = useCallback((newTags: string[]) => {
        setTags(newTags);
        onChange(newTags); // Notify parent
    }, [onChange]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        const key = event.key;
        // Trim and sanitize the value slightly
        const value = inputValue.replace(/,/g, '').trim(); // Remove commas before adding

        if (delimiters.includes(key) && value) {
            event.preventDefault(); // Prevent default form submission on Enter or comma behavior
            if (!tags.map(t => t.toLowerCase()).includes(value.toLowerCase())) { // Case-insensitive check
                const newTags = [...tags, value];
                updateTags(newTags);
            }
            setInputValue(''); // Clear input
        } else if (key === 'Backspace' && !inputValue && tags.length > 0) {
            event.preventDefault(); // Prevent navigating back
            const newTags = tags.slice(0, -1); // Remove last tag
            updateTags(newTags);
        }
    };

    // Memoize removeTag
    const removeTag = useCallback((tagToRemove: string) => {
        const newTags = tags.filter(tag => tag !== tagToRemove);
        updateTags(newTags);
    }, [tags, updateTags]); // Depend on tags and updateTags

    // Focus the input when the container is clicked
    const focusInput = () => {
        inputRef.current?.focus();
    };

    return (
        <TagInputContainer onClick={focusInput}>
            {tags.map((tag, index) => (
                <TagBadge key={`${tag}-${index}`} variant="soft"> {/* Use default theme color or specify */}
                    {tag}
                    <TagRemoveButton
                        variant="ghost"
                        size="1"
                        color="gray" // Or theme color
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent container click focus
                            removeTag(tag);
                         }}
                        aria-label={`Remove ${tag}`}
                    >
                        <Cross1Icon />
                    </TagRemoveButton>
                </TagBadge>
            ))}
            {/* Remove TextField.Root wrapper */}
             <StyledInput
                ref={inputRef}
                id={id}
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder={tags.length === 0 ? placeholder : ''} // Show placeholder only when empty
             />
        </TagInputContainer>
    );
};

export default TagInput;