import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native'
import React from 'react'

const SingleDisease = ({ disease, currentLanguage, navigation }: any) => {


    return (
        <View>
            <FlatList
                data={disease}
                keyExtractor={(item, index) =>
                    item._id ? item._id.toString() : index.toString()
                }
                renderItem={({ item }) => (
                    <View  >
                        <Text>{item?.disease_main_title?.[currentLanguage] || null}</Text>
                        <Image source={{ uri: item.disease_main_image }} style={{ width: 30, height: 30 }} />
                        <TouchableOpacity

                            onPress={() =>
                                navigation.navigate('SingleDisease', { id: item._id })
                            }
                        >
                            <Text  >go to details page</Text>
                        </TouchableOpacity>
                    </View>
                )}
            />
        </View>
    )
}

export default SingleDisease