import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const CustomRadioButton = ({ options, value, onChange }: {
  options: string[],
  value: string,
  onChange: (val: string) => void
}) => {
  return (
    <View style={styles.radioGroup}>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={styles.radioOption}
          onPress={() => onChange(option)}
        >
          <View style={[styles.radioOuter, value === option && styles.radioOuterSelected]}>
            {value === option && <View style={styles.radioInner} />}
          </View>
          <Text style={styles.label}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  radioGroup: { flexDirection: 'row', flexWrap: 'wrap' },
  radioOption: { flexDirection: 'row', alignItems: 'center', marginRight: 20, marginVertical: 4 },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: '#28a745',
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: '#28a745',
  },
  label: {
    marginLeft: 8,
    fontSize: 14,
  },
});
