import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

function ContentBox() {
  return (
    <View style={styles.mainView}>
      <Text>ContentBox</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  mainView: {
    borderWidth: 2,
    borderColor: '#960018',
    height: '100%',
    width: '100%',
  }
})

export default ContentBox