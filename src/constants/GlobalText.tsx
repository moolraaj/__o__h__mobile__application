import React from 'react';
import { Text } from 'react-native';
import { Fonts } from './Variables';

type GlobalTextProps = React.ComponentProps<typeof Text>;

export const GlobalText: React.FC<GlobalTextProps> = ({ style, children, ...rest }) => {
    return (
        <Text {...rest} style={[{ fontFamily: Fonts.medium }, style]}>
            {children}
        </Text>
    );
};