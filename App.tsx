import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { PilhaTransacoes } from './src/navegacao/PilhaTransacoes';
import type { RotasDasAbas } from './src/navegacao/tipos';
import TelaSobre from './src/telas/TelaSobre';

const Abas =
  createBottomTabNavigator<RotasDasAbas>();

export default function App() {
  return (
    <NavigationContainer>
      <Abas.Navigator>
        <Abas.Screen
          name="AbaTransacoes"
          component={PilhaTransacoes}
          options={{
            title: 'Transações',
            headerShown: false,
          }}
        />

        <Abas.Screen
          name="AbaSobre"
          component={TelaSobre}
          options={{
            title: 'Sobre',
          }}
        />
      </Abas.Navigator>
    </NavigationContainer>
  );
}