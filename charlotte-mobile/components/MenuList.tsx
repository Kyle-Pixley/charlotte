import React, { useEffect, useState } from 'react';
import AppText from './AppText';
import { Pressable, StyleSheet, Text, View } from 'react-native';

function MenuList() {
  return (
    <View style={styles.menulist}>
        <AppText>Menu List</AppText>
    </View>
  )
}

const styles = StyleSheet.create({
    menulist: {
        position: 'absolute',
        width: '75%',
        backgroundColor: 'white',
        zIndex: 2,
        top: 44,
  }
})

export default MenuList;