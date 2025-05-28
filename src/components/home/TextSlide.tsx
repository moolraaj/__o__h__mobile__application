import React, { useRef, useState, useEffect } from 'react'
import {
    View,
    FlatList,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
    Animated,
    Text,
} from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import { useGetTextSliderQuery } from '../../store/services/textslider/slideTextApi'
import { useTranslation } from 'react-i18next'
import LinearGradient from 'react-native-linear-gradient'
import GradientText from '../../common/GradientText'
import Shimmer from '../../common/Shimmer'
import Icon from 'react-native-vector-icons/FontAwesome5';

type SliderItem = {
    _id: string
    slider_text: Record<string, string>
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')
const CARD_WIDTH = SCREEN_WIDTH * 0.85
const CARD_MARGIN = 10

export default function TextSlide({ navigation }: { navigation: any }) {
    const { i18n } = useTranslation()
    const lang = i18n.language

    const { data, isLoading, error, refetch } = useGetTextSliderQuery({ page: 1, limit: 10, lang },
        {
            refetchOnMountOrArgChange: true,
        })
    const slides: SliderItem[] = data?.data ?? []

    const [currentIndex, setCurrentIndex] = useState(0)
    const flatRef = useRef<FlatList<SliderItem>>(null)
    const fadeAnim = useRef(new Animated.Value(0)).current

    const scrollTo = (idx: number) => {
        flatRef.current?.scrollToIndex({ index: idx, animated: true })
        setCurrentIndex(idx)
    }

    const goNext = () => scrollTo((currentIndex + 1) % slides.length)
    const goPrev = () => scrollTo((currentIndex - 1 + slides.length) % slides.length)

    const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
        if (viewableItems.length) setCurrentIndex(viewableItems[0].index)
    })

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 })

    useEffect(() => {
        if (slides.length === 0) return
        const timer = setInterval(() => {
            goNext()
        }, 3500)
        return () => clearInterval(timer)
    }, [currentIndex, slides.length])

    useEffect(() => {
        fadeAnim.setValue(0)
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
        }).start()
    }, [currentIndex])

    return (
        <View style={styles.wrapper}>
            {isLoading ?
                <View style={styles.skeletonWrapper}>
                    <View style={styles.skeletonCard}>
                        <Shimmer style={styles.skeletonText} />

                        <View style={[styles.arrow, styles.leftArrow]}>
                            <Shimmer style={styles.skeletonArrow} />
                        </View>

                        <View style={[styles.arrow, styles.rightArrow]}>
                            <Shimmer style={styles.skeletonArrow} />
                        </View>
                    </View>

                    <View style={styles.pagination}>
                        {[...Array(3)].map((_, index) => (
                            <Shimmer key={index} style={styles.skeletonDot} />
                        ))}
                    </View>
                </View>
                : error || !data.data ?
                    (<View style={styles.errorWrapper}>
                        <LinearGradient
                            colors={['#56235E', '#C1392D']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={styles.errorContainer}
                        >
                            <View style={styles.errorContent}>
                                <View style={styles.errorIconContainer}>
                                    <LinearGradient
                                        colors={['#fff', '#f8f8f8']}
                                        style={styles.errorIconBackground}
                                    >
                                        <Icon name="exclamation-triangle" size={20} color="#FF416C" />
                                    </LinearGradient>
                                </View>

                                <View style={styles.errorTextContainer}>
                                    <GradientText
                                        text="Loading Error"
                                        colors={['#fff', '#f8f8f8']}
                                    />
                                    <Text style={styles.errorMessage}>
                                        We couldn't load the slider content. Please try again later.
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    style={styles.retryButton}
                                    onPress={() => refetch()}
                                >
                                    <Text style={styles.retryButtonText}>Retry</Text>
                                </TouchableOpacity>
                            </View>
                        </LinearGradient>
                    </View>) :
                    <>
                        <FlatList
                            ref={flatRef}
                            data={slides}
                            keyExtractor={i => i._id}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            onViewableItemsChanged={onViewableItemsChanged.current}
                            viewabilityConfig={viewConfig.current}
                            contentContainerStyle={{ paddingHorizontal: CARD_MARGIN }}
                            snapToInterval={CARD_WIDTH + CARD_MARGIN * 2}
                            decelerationRate="fast"
                            renderItem={({ item }) => (
                                <LinearGradient
                                    colors={['#FBEAFF', '#FFD6D6']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                    style={styles.slide}
                                >
                                    <GradientText text={item.slider_text[lang]} />

                                    <TouchableOpacity onPress={goPrev} style={[styles.arrow, styles.leftArrow]}>
                                        <Feather name="chevron-left" size={14} />
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={goNext} style={[styles.arrow, styles.rightArrow]}>
                                        <Feather name="chevron-right" size={14} />
                                    </TouchableOpacity>
                                </LinearGradient>
                            )}
                        />

                        <View style={styles.pagination}>
                            {slides.map((_, index) => (
                                <View
                                    key={index}
                                    style={[
                                        styles.dot,
                                        currentIndex === index ? styles.activeDot : {},
                                    ]}
                                />
                            ))}
                        </View>
                    </>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    errorWrapper: {
        width: '100%',
        height: 80,
        overflow: 'hidden'
    },
    errorContainer: {
        flex: 1,
        borderRadius: 12,
        paddingHorizontal: 12,
        justifyContent: 'center',
        elevation: 8,
        shadowColor: '#FF416C',
        shadowOpacity: 0.3,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 5 },
    },
    errorContent: {
        flexDirection: 'row',
        alignItems: 'center',
        overflow: 'hidden'
    },
    errorIconContainer: {
        marginRight: 15,
    },
    errorIconBackground: {
        width: 40,
        height: 40,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorTextContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorHeading: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    errorMessage: {
        color: '#fff',
        fontSize: 10,
        opacity: 0.9,
        textAlign: 'center'
    },
    retryButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.5)',
        paddingVertical: 2,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginLeft: 10,
    },
    retryButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    wrapper: {
        alignItems: 'center',
        marginVertical: 20,
    },
    slide: {
        width: CARD_WIDTH,
        height: 80,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 28,
        margin: 5,
        shadowColor: '#FF8CFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 4,
    },
    text: {
        fontSize: 14,
        textAlign: 'center',
        color: '#222',
        textTransform: 'capitalize'
    },
    arrow: {
        position: 'absolute',
        top: '50%',
        marginTop: -10,
        backgroundColor: '#fff',
        borderRadius: 14,
        padding: 4,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
    },
    leftArrow: {
        left: 6,
    },
    rightArrow: {
        right: 6,
    },
    pagination: {
        flexDirection: 'row',
        marginTop: 10,
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ccc',
    },
    activeDot: {
        backgroundColor: '#FF7F50',
        width: 16,
    },
    skeletonWrapper: {
        alignItems: 'center',
    },

    skeletonCard: {
        width: CARD_WIDTH,
        height: 80,
        borderRadius: 16,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 28,
        margin: 5,
    },

    skeletonText: {
        width: '70%',
        height: 14,
        borderRadius: 6,
    },

    skeletonArrow: {
        width: 15,
        height: 15,
        borderRadius: 10,
    },

    skeletonDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#e0e0e0',
    },
})
