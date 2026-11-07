import { useCallback, useState } from 'react';

import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { contarLocal } from '../banco/banco';

import { CabecalhoTela } from '../components/CabecalhoTela';

import { registrarErro } from '../erros/erros';

import { cores, espacos, raio } from '../tema/tema';

export default function TelaSobre() {
  const [guardadas, setGuardadas] = useState('...');

  // Recontar sempre que a aba ganhar foco.
  useFocusEffect(
    useCallback(() => {
      let cancelado = false;

      contarLocal()
        .then((total) => {
          if (!cancelado) {
            setGuardadas(String(total));
          }
        })
        .catch((erro: unknown) => {
          registrarErro('contagem', erro);

          if (!cancelado) {
            setGuardadas('indisponível');
          }
        });

      return () => {
        cancelado = true;
      };
    }, []),
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <CabecalhoTela
        sobretitulo="VERSÃO MOBILE"
        titulo="Gestor de Fluxo de Caixa"
      />

      <View style={styles.card}>
        <Text style={styles.tituloCard}>Dados no aparelho</Text>

        <Text style={styles.item}>
          Transações guardadas no aparelho: {guardadas}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.tituloCard}>Sobre o Projeto</Text>

        <Text style={styles.texto}>
          Sistema desenvolvido para auxiliar no gerenciamento de receitas,
          despesas e fluxo de caixa.
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.tituloCard}>Funcionalidades</Text>

        <Text style={styles.item}>• Dashboard Financeiro</Text>

        <Text style={styles.item}>• Controle de Categorias</Text>

        <Text style={styles.item}>• Cadastro de Transações</Text>

        <Text style={styles.item}>• Filtros de Consulta</Text>

        <Text style={styles.item}>• Importação de Imagem PIX</Text>

        <Text style={styles.item}>• Importação de PDF PIX</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.tituloCard}>Tecnologias</Text>

        <Text style={styles.item}>• React Native</Text>

        <Text style={styles.item}>• Expo</Text>

        <Text style={styles.item}>• TypeScript</Text>

        <Text style={styles.item}>• SQLite</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.tituloCard}>Informações do Projeto</Text>

        <Text style={styles.item}>• Instituição: SENAC RN</Text>

        <Text style={styles.item}>• Unidade Curricular: UC8</Text>

        <Text style={styles.item}>• Projeto: Gestor de Fluxo de Caixa</Text>

        <Text style={styles.item}>• Plataforma: Mobile</Text>

        <Text style={styles.item}>
          • Diferencial: Importação de comprovantes PIX por imagem e PDF
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: espacos.md,
    paddingTop: 50,
    backgroundColor: cores.papel,
  },

  card: {
    backgroundColor: cores.papelCartao,

    borderWidth: 1,

    borderColor: cores.borda,

    borderRadius: raio,

    padding: espacos.md,

    marginBottom: espacos.md,
  },

  tituloCard: {
    color: cores.tinta,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: espacos.sm,
  },

  texto: {
    color: cores.tinta,
    lineHeight: 24,
  },

  item: {
    color: cores.tinta,
    marginBottom: 8,
  },
});
