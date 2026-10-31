import {
  Pressable,
  StyleSheet,
  Text,
} from 'react-native';

import {
  cores,
  espacos,
  raio,
} from '../tema/tema';

interface BotaoProps {
  titulo: string;
  onPress: () => void;
  variante?: 'primario' | 'secundario';
  desabilitado?: boolean;
}

export function Botao({
  titulo,
  onPress,
  variante = 'primario',
  desabilitado = false,
}: BotaoProps) {
  const secundario =
    variante === 'secundario';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={desabilitado}
      onPress={onPress}
      style={({ pressed }) => [
        estilos.base,
        secundario &&
          estilos.secundario,
        pressed &&
          estilos.pressionado,
        desabilitado &&
          estilos.desabilitado,
      ]}
    >
      <Text
        style={[
          estilos.texto,
          secundario &&
            estilos.textoSecundario,
        ]}
      >
        {titulo}
      </Text>
    </Pressable>
  );
}

const estilos = StyleSheet.create({
  base: {
    flex: 1,
    backgroundColor: cores.tinta,
    borderRadius: raio,
    padding: espacos.md,
    alignItems: 'center',
  },

  secundario: {
    backgroundColor:
      cores.papelCartao,
    borderWidth: 1,
    borderColor: cores.tinta,
  },

  pressionado: {
    opacity: 0.7,
  },

  desabilitado: {
    opacity: 0.4,
  },

  texto: {
    color: cores.papelCartao,
    fontWeight: 'bold',
  },

  textoSecundario: {
    color: cores.tinta,
  },
});