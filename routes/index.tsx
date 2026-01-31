import { NavigationContainer, NavigationIndependentTree } from '@react-navigation/native'

import { AppRoutes } from './app.routes'

export function Routes(){
    return(
        <NavigationIndependentTree>
            <NavigationContainer>
                <AppRoutes/>
            </NavigationContainer>
        </NavigationIndependentTree>
    )
}

