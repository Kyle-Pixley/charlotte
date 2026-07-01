import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

function MenuList() {
  return (
    <View style={styles.menulist}>
        <Text>Menu List</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    menulist: {
    height: '100%',
    width: '75%',
    backgroundColor: 'white',
    zIndex: 2,
    top: 44,
  }
})

export default MenuList;