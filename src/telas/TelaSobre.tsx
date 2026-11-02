import {
  useCallback,
  useState,
} from 'react';

import {
  PixelRatio,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';

import {
  useFocusEffect,
} from '@react-navigation/native';

import {
  contarLocal,
} from '../banco/banco';

import {
  cores,
  espacos,
} from '../tema/tema';

export default function TelaSobre() {
  const {
    width,
    height,
    fontScale,
  } = useWindowDimensions();

  const [guardadas, setGuardadas] =
    useState<number | undefined>(
      undefined,
    );

  useFocusEffect(
    useCallback(() => {
      let cancelado = false;

      contarLocal().then(
        (total) => {
          if (!cancelado) {
            setGuardadas(total);
          }
        },
      );

      return () => {
        cancelado = true;
      };
    }, []),
  );

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>
        Gestor de Fluxo de Caixa
      </Text>

      <Text style={styles.texto}>
        Versão mobile do projeto
        Desktop.
      </Text>

      <Text
        style={styles.textoSecundario}
      >
        Desenvolvido na UC8 com
        React Native e Expo.
      </Text>

      <Text style={styles.medida}>
        Janela:{' '}
        {Math.round(width)} x{' '}
        {Math.round(height)}
      </Text>

      <Text style={styles.medida}>
        Densidade:{' '}
        {PixelRatio.get()}x
      </Text>

      <Text style={styles.medida}>
        Escala da fonte:{' '}
        {fontScale}
      </Text>

      <Text style={styles.medida}>
        Guardadas no aparelho:{' '}
        {guardadas === undefined
          ? '...'
          : guardadas}
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

  medida: {
    marginTop: espacos.sm,
    color: cores.tintaSuave,
  },
});