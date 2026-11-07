import { useState } from 'react';

import { ScrollView, StyleSheet, Text } from 'react-native';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { FormularioTransacao } from '../components/FormularioTransacao';

import { useTransacoes } from '../contexto/TransacoesContexto';

import { registrarErro } from '../erros/erros';

import type { RotasDaPilha } from '../navegacao/tipos';

import { cores, espacos } from '../tema/tema';

type Props = NativeStackScreenProps<RotasDaPilha, 'EditarTransacao'>;

export default function TelaEditarTransacao({ route, navigation }: Props) {
  const { id } = route.params;

  const { buscar, editar } = useTransacoes();

  const transacao = buscar(id);

  const [erro, setErro] = useState<string | undefined>();

  const [salvando, setSalvando] = useState(false);

  if (transacao === undefined) {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>Transação não encontrada</Text>
      </ScrollView>
    );
  }

  function salvar(
    nome: string,
    descricao: string,
    valor: number,
    idCategoria: number,
    data: string,
  ) {
    if (salvando) {
      return;
    }

    setErro(undefined);
    setSalvando(true);

    editar(id, nome, descricao, valor, idCategoria, data)
      .then(() => {
        navigation.goBack();
      })
      .catch((falha: unknown) => {
        setErro(registrarErro('edição', falha).mensagem);
        setSalvando(false);
      });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <FormularioTransacao
        aoCriar={salvar}
        valoresIniciais={transacao}
        manterAposEnviar
        textoBotao={salvando ? 'Salvando...' : 'Salvar Alterações'}
      />

      {erro && <Text style={styles.erro}>{erro}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: espacos.md,
    paddingBottom: espacos.lg * 2,
    backgroundColor: cores.papel,
  },

  titulo: {
    color: cores.tinta,
    fontSize: 22,
    fontWeight: '700',
  },

  erro: {
    color: cores.despesa,
    marginTop: espacos.sm,
    fontWeight: '700',
  },
});
