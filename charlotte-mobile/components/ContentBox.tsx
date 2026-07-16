import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import AppText from './AppText';

function ContentBox() {


  const [ conversation, setConversation ] = useState('')

  function name() {
    
  }


  return (
    <View style={styles.mainView}>
      
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