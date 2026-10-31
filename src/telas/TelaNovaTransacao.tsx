import {
  View,
  StyleSheet,
} from 'react-native';

import { FormularioTransacao } from '../components/FormularioTransacao';
import { useTransacoes } from '../contexto/TransacoesContexto';
import { cores, espacos } from '../tema/tema';

export default function TelaNovaTransacao() {
  const { adicionar } =
    useTransacoes();

  return (
    <View style={styles.container}>
      <FormularioTransacao
        aoCriar={adicionar}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: espacos.md,
    backgroundColor: cores.papel,
  },
});