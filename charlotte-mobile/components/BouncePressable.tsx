import React from 'react';
import { Pressable, PressableProps } from 'react-native';
import Animated,{ useSharedValue, useAnimatedStyle, withSequence, withTiming } from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type BouncePressableProps = PressableProps & {
    children: React.ReactNode;
};

function BouncePressable({ children, style, onPressIn, onPressOut, ...props}: BouncePressableProps) {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        }
    });

    return (
        <AnimatedPressable
            {...props}
            style={[style, animatedStyle]}
            onPressIn={(e) => {
                scale.value = withTiming(.9, {duration: 100 });
                onPressIn?.(e);
            }}
            onPressOut={(e) => {
                scale.value =withSequence(
                    withTiming(1.1, {duration: 100}),
                    withTiming(1, { duration: 100}));
                onPressOut?.(e);
            }}>{children}</AnimatedPressable>
    )
}
export default BouncePressable;