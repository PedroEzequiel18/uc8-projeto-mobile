import { useState } from 'react';

import {
  View,
  StyleSheet,
  Text,
} from 'react-native';

import { FormularioTransacao } from '../components/FormularioTransacao';

import { useTransacoes } from '../contexto/TransacoesContexto';

import { registrarErro } from '../erros/erros';

import {
  cores,
  espacos,
} from '../tema/tema';

export default function TelaNovaTransacao() {
  const { adicionar } =
    useTransacoes();

  const [erro, setErro] =
    useState<string | undefined>(
      undefined,
    );

  function criar(
    nome: string,
    descricao: string,
  ) {
    setErro(undefined);

    adicionar(nome, descricao)
      .then(() => {})
      .catch((falha: unknown) => {
        setErro(
          registrarErro(
            'cadastro',
            falha,
          ).mensagem,
        );
      });
  }

  return (
    <View style={styles.container}>
      <FormularioTransacao
        aoCriar={criar}
      />

      {erro !== undefined && (
        <Text style={styles.erro}>
          {erro}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: espacos.md,
    backgroundColor: cores.papel,
  },

  erro: {
    color: 'red',
    fontWeight: 'bold',
    marginTop: espacos.sm,
  },
});
