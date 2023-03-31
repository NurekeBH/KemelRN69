import React, { useMemo } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';


const SimpleButton = ({
    onPress = () => undefined,
    loading = false,
    style,
    text,
    textStyle,
    ...buttonProps
}) => {


    const memoStyle = useMemo(() => [styles.button, style], [style]);
    const memoTextStyle = useMemo(() => [styles.text, textStyle], [textStyle]);

    return (
        <View style={{ width: '100%', }}>
            <TouchableOpacity
                style={memoStyle}
                activeOpacity={0.9}
                onPress={onPress}
                disabled={loading}
                {...buttonProps}>
                {loading ? (
                    <ActivityIndicator color={'#fff'} />
                ) : (
                    <Text style={memoTextStyle} numberOfLines={2}>
                        {text}
                    </Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

export default SimpleButton;

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#3F49DC",
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 16,
        maxHeight: 72,
        borderRadius: 10,
        marginHorizontal: 16,
    },
    text: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
        color: 'white'
    },
});
