import React, { useRef, useState, useEffect } from 'react'
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Dimensions,
    StyleSheet,
} from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import { useGetTextSliderQuery } from '../../store/services/textslider/slideTextApi'
import { useTranslation } from 'react-i18next'
import LinearGradient from 'react-native-linear-gradient'

type SliderItem = {
    _id: string
    slider_text: Record<string, string>
}

const { width: SCREEN_WIDTH } = Dimensions.get('window')

export default function TextSlide({navigation}:{navigation:any}) {
    const { i18n } = useTranslation()
    const lang = i18n.language

    const { data } = useGetTextSliderQuery({ page: 1, limit: 10, lang })
    const slides: SliderItem[] = data?.data ?? []

    const [currentIndex, setCurrentIndex] = useState(0)
    const flatRef = useRef<FlatList<SliderItem>>(null)

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
        }, 2500)
        return () => clearInterval(timer)
    }, [currentIndex, slides.length])

    return (
        <View style={styles.wrapper}>
            <FlatList
                ref={flatRef}
                data={slides}
                keyExtractor={i => i._id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onViewableItemsChanged={onViewableItemsChanged.current}
                viewabilityConfig={viewConfig.current}
                renderItem={({ item }) => (
                    <LinearGradient
                        colors={['#FBEAFF', '#FFD6D6']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.slide}
                    >
                        <Text style={styles.text}>{item.slider_text[lang]}</Text>

                        <TouchableOpacity onPress={goPrev} style={[styles.arrow, styles.leftArrow]}>
                            <Feather name="chevron-left" size={24} />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={goNext} style={[styles.arrow, styles.rightArrow]}>
                            <Feather name="chevron-right" size={24} />
                        </TouchableOpacity>
                    </LinearGradient>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
        alignItems: 'center',
        marginVertical: 20,
    },
    slide: {
        width: SCREEN_WIDTH * 0.9,
        height: 100,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        overflow: 'visible',
        paddingHorizontal: 32,
    },
    text: {
        fontSize: 16,
        textAlign: 'center',
        
    },
    arrow: {
        position: 'absolute',
        top: '50%',
        marginTop: -12,
        padding: 8,
    },
    leftArrow: {
        left: 8,
    },
    rightArrow: {
        right: 8,
    },
})
