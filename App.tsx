import { NavigationContainer } from '@react-navigation/native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { Ionicons } from '@expo/vector-icons';

import { TransacoesProvedor } from './src/contexto/TransacoesContexto';

import { PilhaTransacoes } from './src/navegacao/PilhaTransacoes';

import type { RotasDasAbas } from './src/navegacao/tipos';

import TelaDashboard from './src/telas/TelaDashboard';
import TelaCategorias from './src/telas/TelaCategorias';
import TelaFiltros from './src/telas/TelaFiltros';
import TelaSobre from './src/telas/TelaSobre';

import { cores } from './src/tema/tema';

import { FiltrosProvedor } from './src/contexto/FiltrosContexto';
const Abas = createBottomTabNavigator<RotasDasAbas>();

export default function App() {
  return (
    <FiltrosProvedor>
      <TransacoesProvedor>
        <NavigationContainer>
          <Abas.Navigator
            initialRouteName="AbaInicio"
            screenOptions={({ route }) => ({
              headerShown: false,

              tabBarActiveTintColor: cores.receita,

              tabBarInactiveTintColor: '#7a7a7a',

              tabBarStyle: {
                height: 70,
                backgroundColor: cores.papelCartao,

                borderTopWidth: 0,

                paddingTop: 8,
                paddingBottom: 8,
              },

              tabBarLabelStyle: {
                fontSize: 12,
                fontWeight: '600',
              },

              tabBarIcon: ({ color, size }) => {
                let iconName: keyof typeof Ionicons.glyphMap = 'home';

                switch (route.name) {
                  case 'AbaInicio':
                    iconName = 'home';
                    break;

                  case 'AbaCategorias':
                    iconName = 'grid';
                    break;

                  case 'AbaTransacoes':
                    iconName = 'wallet';
                    break;

                  case 'AbaFiltros':
                    iconName = 'funnel';
                    break;

                  case 'AbaSobre':
                    iconName = 'information-circle';
                    break;
                }

                return <Ionicons name={iconName} color={color} size={size} />;
              },
            })}
          >
            <Abas.Screen
              name="AbaInicio"
              component={TelaDashboard}
              options={{
                title: 'Início',
              }}
            />

            <Abas.Screen
              name="AbaCategorias"
              component={TelaCategorias}
              options={{
                title: 'Categorias',
              }}
            />

            <Abas.Screen
              name="AbaTransacoes"
              component={PilhaTransacoes}
              options={{
                title: 'Transações',
              }}
            />

            <Abas.Screen
              name="AbaFiltros"
              component={TelaFiltros}
              options={{
                title: 'Filtros',
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
      </TransacoesProvedor>
    </FiltrosProvedor>
  );
}
