import React from 'react';
import {
    View,
    TextInput,
    StyleSheet,
    TextInputProps,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';

type SearchbarProps = TextInputProps & {
    placeholderText: string;
    searchQuery?: any;
    setSearchQuery?: (text: any) => void;
};

export default function Searchbar({ placeholderText, ...props }: SearchbarProps) {
    return (
        <LinearGradient
            colors={['#F8E4FF', '#FFD7D8']}
            locations={[0.2081, 1]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.container}
        >
            <Ionicons name="search" size={20} color="#8E44AD" style={styles.icon} />
            <TextInput
                style={styles.input}
                placeholder={placeholderText}
                placeholderTextColor="#8E44AD"
                {...props}
            />
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 40,
        width: '100%',
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        color: '#56235E',
        fontSize: 14,
    },
});
