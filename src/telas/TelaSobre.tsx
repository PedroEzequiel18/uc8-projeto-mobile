import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import { cores, espacos } from '../tema/tema';

export default function TelaSobre() {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Gestor de Fluxo de Caixa
      </Text>

      <Text style={styles.texto}>
        Versão mobile do projeto Desktop.
      </Text>

      <Text style={styles.textoSecundario}>
        Desenvolvido na UC8 com React Native e Expo.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: cores.papel,
    padding: espacos.md,
  },

  titulo: {
    color: cores.tinta,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: espacos.md,
  },

  texto: {
    color: cores.tinta,
    marginBottom: espacos.sm,
  },

  textoSecundario: {
    color: cores.tintaSuave,
  },
});
