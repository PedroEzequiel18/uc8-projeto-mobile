import { useState } from 'react';
import { TextInput, Pressable, Text, View } from 'react-native';

interface FormularioTransacaoProps {
  aoCriar: (nome: string, descricao: string) => void;
}

export function FormularioTransacao({
  aoCriar,
}: FormularioTransacaoProps) {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');

  function criar() {
    aoCriar(nome, descricao);

    setNome('');
    setDescricao('');
  }

  return (
    <View>
      <TextInput
        placeholder="Nome da transação"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />

      <Pressable onPress={criar}>
        <Text>Criar Transação</Text>
      </Pressable>
    </View>
  );
}