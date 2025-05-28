import { useAuth } from './AuthContext';
import { AuthStack } from './AuthStack';
import { NavigationContainer } from '@react-navigation/native';
import RoleSwitcher from './RoleSwithcer';
import Splash from '../screens/splash';
import { useState } from 'react';

export function RootNavigator() {
    const { token } = useAuth();
    const [splashFinished, setSplashFinished] = useState(false);

    if (!splashFinished) {
        return <Splash onFinish={() => setSplashFinished(true)} />;
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