// src/components/common/CardSkeletonItem.tsx
import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import Shimmer from './Shimmer'
import Icon from 'react-native-vector-icons/Feather'

const { width } = Dimensions.get('window')
const CARD_GAP = 8
const CARD_WIDTH = (width - CARD_GAP * 5) / 2 // Two cards per row with spacing

interface Props {
    count?: number
}

const CardSkeletonItem = ({ count = 1 }: Props) => {
    const skeletonArray = Array.from({ length: count })

    return (
        <View style={styles.grid}>
            {skeletonArray.map((_, index) => (
                <View key={index.toString()} style={styles.card}>
                    <View style={styles.image}>
                        <Shimmer style={StyleSheet.absoluteFillObject} />
                        <View style={styles.iconWrapper}>
                            <Icon name="image" size={40} color="#ccc" />
                        </View>
                    </View>
                </View>
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: CARD_GAP,
    },
    card: {
        width: CARD_WIDTH,
        aspectRatio: 1 / 0.6,
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#eee',
    },
    image: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
    },
    iconWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default CardSkeletonItem
