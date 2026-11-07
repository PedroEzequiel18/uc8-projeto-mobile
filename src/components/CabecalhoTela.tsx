import { Platform, StyleSheet, Text, View } from 'react-native';

import { cores, espacos } from '../tema/tema';

interface CabecalhoTelaProps {
  sobretitulo: string;
  titulo: string;
  explicacao?: string;
}

// Cabeçalho padrão das telas: sobretítulo dourado, título serifado e régua.
export function CabecalhoTela({
  sobretitulo,
  titulo,
  explicacao,
}: CabecalhoTelaProps) {
  return (
    <View>
      <Text style={styles.sobretitulo}>{sobretitulo}</Text>

      <Text style={styles.titulo} accessibilityRole="header">
        {titulo}
      </Text>

      <View style={styles.regua} />

      {explicacao && <Text style={styles.explicacao}>{explicacao}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  sobretitulo: {
    color: cores.dourado,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },

  titulo: {
    color: cores.tinta,
    fontFamily: Platform.select({ ios: 'Georgia', default: 'serif' }),
    fontSize: 26,
    fontWeight: '700',
    marginTop: espacos.xs,
  },

  regua: {
    height: 2,
    backgroundColor: cores.tinta,
    marginTop: espacos.sm,
    marginBottom: espacos.md,
  },

  explicacao: {
    color: cores.tintaSuave,
    marginBottom: espacos.md,
  },
});
