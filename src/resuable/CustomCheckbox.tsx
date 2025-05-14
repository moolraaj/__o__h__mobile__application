import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const CustomCheckbox = ({ options, values, onChange }: {
  options: string[],
  values: string[],
  onChange: (val: string[]) => void
}) => {
  const toggleValue = (option: string) => {
    if (values.includes(option)) {
      onChange(values.filter(v => v !== option));
    } else {
      onChange([...values, option]);
    }
  };

  return (
    <View>
      {options.map((option) => (
        <TouchableOpacity
          key={option}
          style={styles.checkboxOption}
          onPress={() => toggleValue(option)}
        >
          <View style={[styles.checkboxBox, values.includes(option) && styles.checkboxBoxChecked]}>
            {values.includes(option) && <View style={styles.checkboxTick} />}
          </View>
          <Text style={styles.label}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  checkboxOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  checkboxBox: {
    height: 20,
    width: 20,
    borderWidth: 2,
    borderColor: '#444',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxBoxChecked: {
    borderColor: '#28a745',
    backgroundColor: '#28a745',
  },
  checkboxTick: {
    width: 10,
    height: 10,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 14,
  },
});
