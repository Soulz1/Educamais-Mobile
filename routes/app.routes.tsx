import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationProp } from '@react-navigation/native'
import { useAuth } from '../src/contexts/AuthContext'
import { ActivityIndicator, View } from 'react-native'

import Login from '../app/screens/Login/index'
import Home from '../app/screens/Home/index'
import PostDetail from '../app/screens/PostDetail/index'
import AdminPostsList from '../app/screens/admin/PostsList/index'
import AdminPostCreate from '../app/screens/admin/PostCreate/index'
import AdminPostEdit from '../app/screens/admin/PostEdit/index'

export type RootStackParamList = {
  'screens/Login/index': undefined;
  'screens/Home/index': { userName: string };
  'screens/PostDetail/index': { postId: number };
  'screens/admin/PostsList/index': undefined;
  'screens/admin/PostCreate/index': undefined;
  'screens/admin/PostEdit/index': { postId: number };
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
                <Screen name="screens/admin/PostsList/index"
                component={AdminPostsList}/>
                <Screen name="screens/admin/PostCreate/index"
                component={AdminPostCreate}/>
                <Screen name="screens/admin/PostEdit/index"
                component={AdminPostEdit}/>
                <Screen name="screens/Login/index"
                component={Login}/>
              </>
            ) : (
              // Usuário não autenticado
              <>
                <Screen name="screens/Login/index"
                component={Login}/>
                <Screen name="screens/Home/index"
                component={Home}/>
                <Screen name="screens/PostDetail/index"
                component={PostDetail}/>
                <Screen name="screens/admin/PostsList/index"
                component={AdminPostsList}/>
                <Screen name="screens/admin/PostCreate/index"
                component={AdminPostCreate}/>
                <Screen name="screens/admin/PostEdit/index"
                component={AdminPostEdit}/>
              </>
            )}
        </Navigator>
    )
}