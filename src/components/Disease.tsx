import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native'
import React from 'react'

const { width } = Dimensions.get('window')
const CARD_WIDTH = (width - 48) / 2 

const SingleDisease = ({ disease, currentLanguage, navigation }: any) => {


    return (
         <View style={styles.container}>
            <FlatList
                data={disease}
                keyExtractor={(item, index) =>
                    item._id ? item._id.toString() : index.toString()
                }
                renderItem={({ item }) => (
                    <View style={styles.outer}>
                  <View style={styles.card}>
                       
                        <Image source={{ uri: item.disease_main_image }} style={{ width: 30, height: 30 }} />
                         <Text>{item?.disease_main_title?.[currentLanguage] || null}</Text>
                        <TouchableOpacity

                            onPress={() =>
                                navigation.navigate('SingleDisease', { id: item._id })
                            }
                        >
                            <Text  >go to details page</Text>
                        </TouchableOpacity>
                    </View>
                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
     outer: {
    display:'flex',
  },
  container: {
    padding: 0,
    backgroundColor: '#fff',
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    width: '50%',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 10,
    marginBottom:20,
    alignItems: 'center',
    position:'relative',    
  },  

  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 0,
    position:'absolute',
    top: 10,       
    right: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#5A227E',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
})

export default SingleDisease










