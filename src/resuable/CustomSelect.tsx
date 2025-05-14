import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList
} from 'react-native';

export const CustomSelect = ({ options, value, onChange, placeholder }: {
  options: string[],
  value: string,
  onChange: (val: string) => void,
  placeholder: string
}) => {
  const [open, setOpen] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={styles.selectBox}
        onPress={() => setOpen(true)}
      >
        <Text style={styles.selectText}>{value || placeholder}</Text>
      </TouchableOpacity>
      <Modal
        transparent
        visible={open}
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setOpen(false)}>
          <View style={styles.modalBox}>
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.optionItem}
                  onPress={() => {
                    onChange(item);
                    setOpen(false);
                  }}
                >
                  <Text>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  selectBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
  },
  selectText: {
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    maxHeight: 300,
  },
  optionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
