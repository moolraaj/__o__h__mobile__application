import Shimmer from './Shimmer';
import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.8;
const CARD_SPACING = 8;

const SliderSkeleton = () => {
    return (
        <View style={styles.wrapper}>
            <View style={[styles.slide, { marginRight: CARD_SPACING }]}>
                <View style={styles.content}>
                    <View style={styles.textContainer}>
                        <Shimmer style={[styles.skeletonText, { width: '70%', height: 10, marginBottom: 8 }]} />
                        <Shimmer style={[styles.skeletonText, { width: '90%', height: 12, marginBottom: 6 }]} />
                        <Shimmer style={[styles.skeletonText, { width: '80%', height: 11, marginBottom: 12 }]} />
                        <Shimmer style={[styles.skeletonButton, { width: 80, height: 30 }]} />
                    </View>
                    <View style={[styles.skeletonImage, { width: CARD_WIDTH * 0.5, height: CARD_WIDTH * 0.5, justifyContent: 'center', alignItems: 'center' }]}>
                        <Shimmer style={StyleSheet.absoluteFillObject} />
                        <Icon name="image" size={40} color="#ccc" />
                    </View>
                </View>
            </View>

            <View style={styles.dotsWrapper}>
                {[1, 2, 3].map((_, index) => (
                    <View key={index} style={styles.skeletonDot} />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        height: 176,
        overflow: 'hidden',
    },
    slide: {
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#f0f0f0',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 5,
    },
    textContainer: {
        flex: 2,
        marginLeft: 10,
    },
    skeletonText: {
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        marginBottom: 4,
    },
    skeletonButton: {
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
    },
    skeletonImage: {
        backgroundColor: '#e0e0e0',
        borderTopLeftRadius: 0,
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
        borderBottomLeftRadius: 0,
    },
    dotsWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    skeletonDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#e0e0e0',
        marginHorizontal: 4,
    },
});

export default SliderSkeleton;