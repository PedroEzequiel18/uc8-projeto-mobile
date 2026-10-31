import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import type { KeyboardTypeOptions } from 'react-native';

import {
  cores,
  espacos,
  raio,
} from '../tema/tema';

interface CampoProps {
  rotulo: string;
  valor: string;
  aoMudar: (texto: string) => void;
  erro?: string;
  tipoDeTeclado?: KeyboardTypeOptions;
}

export function Campo({
  rotulo,
  valor,
  aoMudar,
  erro,
  tipoDeTeclado = 'default',
}: CampoProps) {
  return (
    <View style={estilos.grupo}>
      <Text style={estilos.rotulo}>
        {rotulo}
      </Text>

      <TextInput
        style={[
          estilos.entrada,
          erro !== undefined &&
            estilos.entradaComErro,
        ]}
        value={valor}
        onChangeText={aoMudar}
        keyboardType={tipoDeTeclado}
      />

      {erro !== undefined && (
        <Text style={estilos.erro}>
          {erro}
        </Text>
      )}
    </View>
  );
}

const estilos = StyleSheet.create({
  grupo: {
    marginBottom: espacos.sm,
  },

  rotulo: {
    color: cores.tintaSuave,
    marginBottom: espacos.xs,
  },

  entrada: {
    backgroundColor: cores.papelCartao,
    borderRadius: raio,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: espacos.md,
    color: cores.tinta,
  },

  entradaComErro: {
    borderColor: cores.despesa,
  },

  erro: {
    color: cores.despesa,
    marginTop: espacos.xs,
  },
});