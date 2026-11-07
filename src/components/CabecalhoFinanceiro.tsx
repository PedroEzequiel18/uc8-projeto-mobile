import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { formatarMoeda, type Totais } from '../utils/financeiro';

import { cores, espacos, raio } from '../tema/tema';

// Fontes do sistema: não precisa instalar nada.
const fonteSerifada = Platform.select({
  ios: 'Georgia',
  default: 'serif',
});

const fonteMono = Platform.select({
  ios: 'Menlo',
  default: 'monospace',
});

interface CabecalhoFinanceiroProps {
  totais: Totais;
  aoRecalcular?: () => void;
  recalculando?: boolean;
  // Texto opcional abaixo do título (ex.: "Filtro ativo").
  observacao?: string;
}

export function CabecalhoFinanceiro({
  totais,
  aoRecalcular,
  recalculando = false,
  observacao,
}: CabecalhoFinanceiroProps) {
  const saldoNegativo = totais.saldo < 0;

  return (
    <View style={styles.container}>
      <Text style={styles.sobretitulo}>CONTROLE FINANCEIRO</Text>

      <Text style={styles.titulo}>Gestor de Fluxo de Caixa</Text>

      <View style={styles.regua} />

      {observacao && <Text style={styles.observacao}>{observacao}</Text>}

      <View style={styles.linha}>
        <View style={styles.colunaCartoes}>
          <View style={[styles.cartao, styles.cartaoReceita]}>
            <Text style={[styles.rotulo, { color: cores.receita }]}>
              ENTROU
            </Text>

            <Text
              style={[styles.valor, { color: cores.receita }]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {formatarMoeda(totais.receitas)}
            </Text>
          </View>

          <View style={[styles.cartao, styles.cartaoDespesa]}>
            <Text style={[styles.rotulo, { color: cores.despesa }]}>SAIU</Text>

            <Text
              style={[styles.valor, { color: cores.despesa }]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {formatarMoeda(totais.despesas)}
            </Text>
          </View>
        </View>

        <View style={styles.selo}>
          <View style={styles.seloInterno}>
            <Text style={styles.rotuloSelo}>SALDO{'\n'}APURADO</Text>

            <Text
              style={[
                styles.valorSaldo,
                saldoNegativo && { color: cores.despesa },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {formatarMoeda(totais.saldo)}
            </Text>

            {aoRecalcular && (
              <Pressable
                accessibilityRole="button"
                onPress={aoRecalcular}
                disabled={recalculando}
                style={({ pressed }) => [
                  styles.botaoRecalcular,
                  (pressed || recalculando) && { opacity: 0.6 },
                ]}
              >
                <Text style={styles.textoRecalcular}>
                  {recalculando ? '...' : 'Recalcular'}
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

const TAMANHO_SELO = 128;

const styles = StyleSheet.create({
  container: {
    marginBottom: espacos.lg,
  },

  sobretitulo: {
    color: cores.dourado,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
  },

  titulo: {
    color: cores.tinta,
    fontFamily: fonteSerifada,
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

  observacao: {
    color: '#d97706',
    marginBottom: espacos.sm,
  },

  linha: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.sm,
  },

  colunaCartoes: {
    flex: 1,
    gap: espacos.sm,
  },

  cartao: {
    borderRadius: raio,
    padding: espacos.md,
  },

  cartaoReceita: {
    backgroundColor: cores.receitaFundo,
  },

  cartaoDespesa: {
    backgroundColor: cores.despesaFundo,
  },

  rotulo: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },

  valor: {
    fontFamily: fonteMono,
    fontSize: 18,
    fontWeight: '700',
    marginTop: espacos.xs,
  },

  selo: {
    width: TAMANHO_SELO,
    height: TAMANHO_SELO,
    borderRadius: TAMANHO_SELO / 2,
    borderWidth: 3,
    borderColor: cores.tinta,
    backgroundColor: cores.papelCartao,
    padding: 5,
  },

  seloInterno: {
    flex: 1,
    borderRadius: TAMANHO_SELO / 2,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: cores.dourado,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: espacos.sm,
  },

  rotuloSelo: {
    color: cores.tintaSuave,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1,
    textAlign: 'center',
  },

  valorSaldo: {
    color: cores.tinta,
    fontFamily: fonteMono,
    fontSize: 15,
    fontWeight: '700',
    marginVertical: espacos.xs,
  },

  botaoRecalcular: {
    backgroundColor: cores.tinta,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  textoRecalcular: {
    color: cores.papelCartao,
    fontSize: 10,
    fontWeight: '700',
  },
});
