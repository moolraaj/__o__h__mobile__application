import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Option = {
    label: string;
    value: string;
};

type Props = {
    label?: string;
    options: Option[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
};

const CheckboxGroup: React.FC<Props> = ({
    label,
    options,
    selectedValues = [],
    onChange,
}) => {
    const handleCheckboxChange = (value: string) => {
        const newValues = selectedValues.includes(value)
            ? selectedValues.filter(v => v !== value) // Remove if already selected
            : [...selectedValues, value]; // Add if not selected

        onChange(newValues);
    };

    return (
        <>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={styles.checkboxGroup}>
                {options.map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        style={[
                            styles.checkboxButton,
                            selectedValues.includes(option.value) && styles.checkboxButtonSelected,
                        ]}
                        onPress={() => handleCheckboxChange(option.value)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.checkboxSquare}>
                            {selectedValues.includes(option.value) && (
                                <View style={styles.checkboxTick} />
                            )}
                        </View>
                        <Text style={styles.checkboxText}>{option.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    checkboxGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16,
    },
    checkboxButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: '#FFFFFF',
        minWidth: '48%',
    },
    checkboxButtonSelected: {
        borderColor: '#D1C4E9',
        backgroundColor: '#F3E5F5',
    },
    checkboxSquare: {
        height: 20,
        width: 20,
        borderRadius: 4,
        borderWidth: 1.5,
        borderColor: '#BDBDBD',
        backgroundColor: '#FAFAFA',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    checkboxSquareSelected: {
        borderColor: '#7E57C2',
        backgroundColor: '#EDE7F6',
    },
    checkboxTick: {
        width: 10,
        height: 10,
        backgroundColor: '#7E57C2',
        borderRadius: 2,
    },
    checkboxText: {
        fontSize: 16,
        color: '#424242',
    },
});

export default CheckboxGroup;