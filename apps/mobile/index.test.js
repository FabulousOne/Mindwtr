import './shim';
import { AppRegistry, StyleSheet, Text, View } from 'react-native';

const App = () => {
    console.log('[Mobile] Minimal Test App Mounted');

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Minimal Test App</Text>
            <Text style={styles.text}>If you see this, native + metro is working</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#fff',
        fontSize: 20,
        marginBottom: 20,
    },
});

console.log('[Mobile] Index file loaded');

AppRegistry.registerComponent('main', () => App);
AppRegistry.registerComponent('mobile', () => App);

