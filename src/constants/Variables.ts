import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

// inputs
export const INPUT_ICON_SIZE = 22;
export const BACK_ARROW_COLOR = '#101623';
export const INPUT_BORDER_COLOR = '#A1A8B0';
export const INPUT_ICON_COLOR = '#A1A8B0';
export const INPUT_BACKGROUND = '#F9FAFB';


// font
export const FONT_FAMILY = 'Nunito';
export const FONT_SIZE = 18;
export const BACK_BUTTON_ICON_SIZE = 24;
export const ICON_SIZE = 24;

export const DISEASE_ICON_SIZE=25


// fucntion

export const htmlRenderStyles = {

    h1: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
        marginBottom: 15,
        lineHeight: 30,
    },
    h2: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 18,
        marginBottom: 14,
        lineHeight: 28,
    },
    h3: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 16,
        marginBottom: 12,
        lineHeight: 26,
    },
    h4: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 14,
        marginBottom: 10,
        lineHeight: 24,
    },
    h5: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 12,
        marginBottom: 8,
        lineHeight: 22,
    },
    h6: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
        marginBottom: 6,
        lineHeight: 20,
    },

    p: {
        fontSize: 14,
        lineHeight: 20,
        color: '#666',
        marginBottom: 8,
    },
    ul: {
        marginTop: 0,
        marginBottom: 0,
    },
    ol: {
        marginTop: 0,
        marginBottom: 0,
    },
    li: {
        marginBottom: 4,
    },
    a: {
        color: '#6e3b7a',
        textDecorationLine: 'underline',
    },

    strong: {
        fontWeight: 'bold',
    },
    em: {
        fontStyle: 'italic',
    },
    blockquote: {
        backgroundColor: '#f9f5fa',
        borderLeftWidth: 4,
        borderLeftColor: '#6e3b7a',
        paddingLeft: 12,
        marginVertical: 10,
    },
    pre: {
        backgroundColor: '#f5f5f5',
        padding: 10,
        borderRadius: 4,
        overflow: 'hidden',
    },
    code: {
        fontFamily: 'monospace',
        backgroundColor: '#f5f5f5',
        padding: 2,
        borderRadius: 3,
    },
    img: {
        maxWidth: width - 40,
        height: undefined,
        aspectRatio: 1,
        resizeMode: 'contain',
        marginVertical: 10,
    },
};
