import { Text, TextProps, StyleSheet } from "react-native";

function AppText({style, children, ...props}: TextProps) {
  return (
    <Text {...props} style={[styles.text, style]}>
        {children}
    </Text>
  )
}

const styles = StyleSheet.create({
    text: {
        color: '#023020',
        fontSize: 44,
    }
})

export default AppText;