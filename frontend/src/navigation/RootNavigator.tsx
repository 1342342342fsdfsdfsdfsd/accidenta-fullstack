import { NavigationContainer } from '@react-navigation/native';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useUser } from 'src/context/useUser';
import AuthStack from './AuthStack';
import RootStack from './RootStack';

export default function RootNavigator() {
  const { loggedUser, isLoading } = useUser();

  if (isLoading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#34c25d" />
      </View>
    );
  }

  return <NavigationContainer>{loggedUser ? <RootStack /> : <AuthStack />}</NavigationContainer>;
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
