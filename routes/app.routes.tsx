import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationProp } from '@react-navigation/native'
import { useAuth } from '../src/contexts/AuthContext'
import { ActivityIndicator, View } from 'react-native'

import Login from '../app/screens/Login/index'
import Home from '../app/screens/Home/index'
import PostDetail from '../app/screens/PostDetail/index'
import AdminPostsListScreen from '../src/features/posts/admin/AdminPostsListScreen'
import AdminPostCreateScreen from '../src/features/posts/admin/AdminPostCreateScreen'
import AdminPostEditScreen from '../src/features/posts/admin/AdminPostEditScreen'

export type RootStackParamList = {
  'screens/Login/index': undefined;
  'screens/Home/index': { userName: string };
  'screens/PostDetail/index': { postId: number };
  'AdminPostsList': undefined;
  'AdminPostCreate': undefined;
  'AdminPostEdit': { postId: number };
};

const { Navigator, Screen } = createNativeStackNavigator<RootStackParamList>()

export function AppRoutes(){
    const { isSignedIn, isLoading } = useAuth()

    // Mostrar carregamento enquanto verifica sessão
    if (isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      )
    }

    return(
        <Navigator screenOptions={{ headerShown: false }}>
            {isSignedIn ? (
              // Usuário autenticado
              <>
                <Screen name="screens/Home/index"
                component={Home}/>
                <Screen name="screens/PostDetail/index"
                component={PostDetail}/>
                <Screen name="AdminPostsList"
                component={AdminPostsListScreen}/>
                <Screen name="AdminPostCreate"
                component={AdminPostCreateScreen}/>
                <Screen name="AdminPostEdit"
                component={AdminPostEditScreen}/>
              </>
            ) : (
              // Usuário não autenticado
              <Screen name="screens/Login/index"
              component={Login}/>
            )}
        </Navigator>
    )
}