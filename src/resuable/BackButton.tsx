
import React from 'react'
import { TouchableOpacity, StyleSheet } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { useNavigation } from '@react-navigation/native'
import { BACK_ARROW_COLOR, BACK_BUTTON_ICON_SIZE, ICON_SIZE } from '../constants/Variables'


interface BackButtonProps {
  onPress: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onPress }) => {
  const navigation = useNavigation()

  const handlePress = () => {
    if (navigation.canGoBack()) {
      navigation.goBack()
      if (onPress) {
        onPress()
      }
    }
  }

  return (
    <TouchableOpacity onPress={handlePress} style={styles.button}>
      <Ionicons
        name="chevron-back"
        size={ICON_SIZE}
        color={BACK_ARROW_COLOR}
      />
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
})

export default BackButton
