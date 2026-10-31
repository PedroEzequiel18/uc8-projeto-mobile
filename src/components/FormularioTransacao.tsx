import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Botao } from './Botao';
import { Campo } from './Campo';
import { espacos } from '../tema/tema';

interface FormularioTransacaoProps {
  aoCriar: (
    nome: string,
    descricao: string,
  ) => void;
}

export function FormularioTransacao({
  aoCriar,
}: FormularioTransacaoProps) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] =
    useState('');

  const [tocado, setTocado] =
    useState(false);

  const nomeVazio =
    nome.trim() === '';

  const erroNome =
    tocado && nomeVazio
      ? 'Informe o nome da transação'
      : undefined;

  function mudarNome(texto: string) {
    setTocado(true);
    setNome(texto);
  }

  function criar() {
    aoCriar(nome, descricao);

    setNome('');
    setDescricao('');
    setTocado(false);
  }

  return (
    <View style={styles.container}>
      <Campo
        rotulo="Nome"
        valor={nome}
        aoMudar={mudarNome}
        erro={erroNome}
      />

      <Campo
        rotulo="Descrição"
        valor={descricao}
        aoMudar={setDescricao}
      />

      <View style={styles.acoes}>
        <Botao
          titulo="Criar Transação"
          onPress={criar}
          desabilitado={nomeVazio}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: espacos.md,
  },

  acoes: {
    flexDirection: 'row',
    marginTop: espacos.sm,
  },
});