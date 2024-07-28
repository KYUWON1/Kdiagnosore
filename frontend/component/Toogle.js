import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, StyleSheet, Animated, Easing } from 'react-native';

const Toggle = ({ onToggle, isOn }) => {
  const [animatedValue] = useState(new Animated.Value(isOn ? 1 : 0));

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isOn ? 1 : 0,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
  }, [isOn, animatedValue]);

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 21],
  });

  const backgroundColor = isOn ? '#65558F' : 'gray';

  return (
    <TouchableOpacity onPress={onToggle} style={[styles.toggleContainer, { backgroundColor }]}>
      <Animated.View
        style={[
          styles.toggleWheel,
          {
            transform: [{ translateX }],
          },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    width: 48,
    height: 28,
    borderRadius: 15,
    justifyContent: 'center',
  },
  toggleWheel: {
    width: 25,
    height: 25,
    backgroundColor: 'white',
    borderRadius: 99,
  },
});

export default Toggle;