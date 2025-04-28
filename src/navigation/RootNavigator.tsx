import { View } from 'react-native';
import { useAuth } from './AuthContext';
import { AuthStack } from './AuthStack';
import Loader from '../common/Loader';
import { NavigationContainer } from '@react-navigation/native';
import RoleSwitcher from './RoleSwithcer';

export function RootNavigator() {
    const { token, loading } = useAuth();

    if (loading) {

        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Loader />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {!token
                ? <AuthStack />
                : <RoleSwitcher />
            }
        </NavigationContainer>
    );
}