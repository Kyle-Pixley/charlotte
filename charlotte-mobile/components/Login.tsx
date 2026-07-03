import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from './AppText';
import App from '../App';

function Login() {

    const [ isRegister, setIsRegister ] = useState(false);
    const [ isSecurePasswordInput, setIsSecurePasswordInput ] = useState(true);

    const [ registerInfo, setRegisterInfo ] = useState({
        username: 'Username',
        email: 'Email',
        password: 'Password',
    });

    const [ loginInfo, setLoginInfo ] = useState({
        username: 'Username',
        password: '',

    })



    function registerOrLogin() {
        if(isRegister) {
            return (
                <View style={styles.form}>

                    <View style={styles.textInputParent}>
                        <AppText style={styles.headerText}>Username</AppText>
                        <TextInput
                            editable
                            onChangeText={(text) => setRegisterInfo((prev) => ({...prev,username:text}))}
                            value={registerInfo.username}
                            style={styles.textInput}
                            autoCorrect={false}/>
                    </View>
                    <View style={styles.textInputParent}>
                        <AppText style={styles.headerText}>Email</AppText>
                        <TextInput
                            editable
                            onChangeText={(text) => setRegisterInfo((prev) => ({...prev,email:text}))}
                            value={registerInfo.email}
                            style={styles.textInput}
                            autoCorrect={false}/>
                    </View>
                    <View style={styles.textInputParent}>
                        <AppText style={styles.headerText}>Password</AppText>

                        <View style={styles.passwordInputBox}>
                            <TextInput
                              editable
                              onChangeText={(text) =>
                                setRegisterInfo((prev) => ({ ...prev, password: text }))}
                              value={registerInfo.password}
                              style={styles.passwordInput}
                              secureTextEntry={isSecurePasswordInput}
                              autoCapitalize="none"
                              autoCorrect={false}/>

                            <Pressable
                              onPress={() => setIsSecurePasswordInput((prev) => !prev)}
                              style={styles.eyeButton}>
                                <Text style={styles.eyeIcon}>
                                    {isSecurePasswordInput ? "\u25C9" : "\uD83D\uDC41"}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            )
        } else 
            return (
                <View style={styles.form}>
                    <View style={styles.textInputParent}>
                        <AppText style={styles.headerText}>Username</AppText>
                        <TextInput
                        editable
                        onChangeText={(text) =>
                            setLoginInfo((prev) => ({ ...prev, username: text }))}
                        value={loginInfo.username}
                        style={styles.textInput}
                        autoCorrect={false}/>
                    </View>
                  
                    <View style={styles.textInputParent}>
                        <AppText style={styles.headerText}>Password</AppText>
                  
                        <View style={styles.passwordInputBox}>
                            <TextInput
                            editable
                            onChangeText={(text) =>
                                setLoginInfo((prev) => ({ ...prev, password: text }))}
                            value={loginInfo.password}
                            style={styles.passwordInput}
                            autoCorrect={false}
                            autoCapitalize="none"
                            secureTextEntry={isSecurePasswordInput}/>
                            <Pressable
                                onPress={() => setIsSecurePasswordInput((prev) => !prev)}
                                style={styles.eyeButton}>
                                <Text style={styles.eyeIcon}>
                                    {isSecurePasswordInput ? "\u25C9" : "\uD83D\uDC41"}
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            )
    };

  return (
    <SafeAreaView style={styles.screen}>
        {registerOrLogin()}
        <Pressable 
            onPress={() => setIsRegister(!isRegister)}
            style={styles.toggleRegisterButton}>
            <Text style={styles.toggleRegisterText}>{isRegister ? 'To Login' : 'To Register'}</Text>
        </Pressable>
    </SafeAreaView>
  )
}
  const styles = StyleSheet.create ({
    screen: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 90,
    },
    form: {
        width: '100%',
        maxWidth: 420,
        alignSelf: 'center',
    },
    textInputParent: {
        marginBottom: 16,
    },
    headerText: {
        color: '#960018',
    },
    textInput: {
        height: 44,
        textAlignVertical: 'center',
        borderWidth: 2,
        backgroundColor: 'white',
        paddingHorizontal: 10,
        fontSize: 18,
    },
    passwordInputBox: {
        height: 44,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 2,
        backgroundColor: "white",
    },
    passwordInput: {
      flex: 1,
      height: "100%",
      paddingHorizontal: 10,
      fontSize: 18,
    },

    eyeButton: {
      width: 44,
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    },

    eyeIcon: {
      fontSize: 22,
    },
    submitButton: {
        paddingTop: 11,
        borderWidth: 11,
    },
    toggleRegisterButton: {
        marginTop: 22,
        padding: 12,
        borderWidth: 2,
        backgroundColor: '#FDA50F',
    },
    toggleRegisterText: {
        fontSize: 25,
        textAlign: 'center',
    }

  })


export default Login