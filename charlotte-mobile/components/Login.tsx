import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

function Login() {

    const [ isRegister, setIsRegister ] = useState(false);
    const [ isSecurePasswordInput, setIsSecurePasswordInput ] = useState(true);

    const [ registerInfo, setRegisterInfo ] = useState({
        username: 'Username',
        email: 'Email',
        password: 'Password',
    })



    function registerOrLogin() {
        if(isRegister) {
            return (
                <View>
                    <TextInput
                        editable
                        onChangeText={(text) => setRegisterInfo((prev) => ({...prev,username:text}))}
                        value={registerInfo.username}
                        style={styles.textInput}
                        autoCorrect={false}/>
                    <TextInput
                        editable
                        onChangeText={(text) => setRegisterInfo((prev) => ({...prev,email:text}))}
                        value={registerInfo.email}
                        style={styles.textInput}
                        autoCorrect={false}/>
                    <View style={styles.passwordParent}>
                        <TextInput
                            editable
                            onChangeText={(text) => setRegisterInfo((prev) => ({...prev,password:text}))}
                            value={registerInfo.password}
                            style={styles.textInput}
                            secureTextEntry={isSecurePasswordInput}
                            autoCapitalize='none'
                            autoCorrect={false}/>
                        <Pressable onPress={() => setIsSecurePasswordInput(!isSecurePasswordInput)}>
                            <Text style={styles.eyeIcon}>{isSecurePasswordInput ? "\u25C9" : "\uD83d\uDC41"}</Text>
                        </Pressable>
                    </View>
                </View>
            )
        } else 
            return (
                <View>

                </View>
            )
    }

  return (
    <SafeAreaView>
        {registerOrLogin()}
        <Pressable onPress={() => setIsRegister(!isRegister)}>
            <Text>{isRegister ? 'Login' : 'Register'}</Text>
        </Pressable>
    </SafeAreaView>
  )
}
  const styles = StyleSheet.create ({
    textInput: {

    },
    passwordParent: {
        flexDirection: 'row',
    },
    eyeIcon: {

    }
  })


export default Login