import { useState } from 'react';
import { View, Text, Button } from 'react-native';
import type { Transacao } from '../types/Transacao';

interface CartaoTransacaoProps {
  transacao: Transacao;
  destaque?: boolean;
}

export function CartaoTransacao({
  transacao,
  destaque = false,
}: CartaoTransacaoProps) {
  const [mostrarDetalhes, setMostrarDetalhes] =
    useState(false);

  return (
    <View>
      <Text>{transacao.nome}</Text>

      <Button
        title={
          mostrarDetalhes
            ? 'Ocultar Detalhes'
            : 'Mostrar Detalhes'
        }
        onPress={() =>
          setMostrarDetalhes(!mostrarDetalhes)
        }
      />

      <Text>{transacao.descricao}</Text>

      <Text>Valor: R$ {transacao.valor}</Text>

      <Text>Data: {transacao.data}</Text>

      {mostrarDetalhes && (
        <Text>Detalhes da transação exibidos.</Text>
      )}

      {destaque && <Text>Destaque</Text>}
    </View>
  );
}