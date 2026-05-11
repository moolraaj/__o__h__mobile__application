import { GlobalText } from '../constants/GlobalText';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Option = {
    label: string;
    value: string;
};

type Props = {
    label?: string;
    options: Option[];
    selectedValue: string;
    onChange: (value: string) => void;
};

const RadioButtonGroup: React.FC<Props> = ({
    label,
    options,
    selectedValue,
    onChange,
}) => {
    return (
        <>
            {label && <GlobalText style={styles.label}>{label}</GlobalText>}
            <View style={styles.radioGroup}>
                {options.map((option) => (
                    <TouchableOpacity
                        key={option.value}
                        style={[
                            styles.radioButton,
                            selectedValue === option.value && styles.radioButtonSelected,
                        ]}
                        onPress={() => onChange(option.value)}
                        activeOpacity={0.7}
                    >
                        <View style={styles.radioCircle}>
                            {selectedValue === option.value && <View style={styles.selectedDot} />}
                        </View>
                        <GlobalText style={styles.radioText}>{option.label}</GlobalText>
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
    radioGroup: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginBottom: 16,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        backgroundColor: '#FFFFFF',
        flex: 1
    },
    radioButtonSelected: {
        borderColor: '#D1C4E9',
        backgroundColor: '#F3E5F5',
    },
    radioCircle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#BDBDBD',
        backgroundColor: '#FAFAFA',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    selectedDot: {
        height: 10,
        width: 10,
        borderRadius: 5,
        backgroundColor: '#56235E',
    },
    radioText: {
        fontSize: 16,
        color: '#333',
    },
});

export default RadioButtonGroup;
