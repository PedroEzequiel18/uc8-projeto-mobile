import { useState } from "react";

import { View, StyleSheet, Text, Pressable } from "react-native";

import * as ImagePicker from "expo-image-picker";

import * as DocumentPicker from "expo-document-picker";

import { FormularioTransacao } from "../components/FormularioTransacao";

import { useTransacoes } from "../contexto/TransacoesContexto";

import { registrarErro } from "../erros/erros";

import { cores, espacos, raio } from "../tema/tema";
export default function TelaNovaTransacao() {
  const { adicionar } = useTransacoes();

  const [erro, setErro] = useState<string | undefined>();

  const [arquivoSelecionado, setArquivoSelecionado] = useState<
    string | undefined
  >();

  async function escolherImagem() {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,

      quality: 1,
    });

    if (!resultado.canceled) {
      setArquivoSelecionado(resultado.assets[0].uri);
    }
  }

  async function escolherPdf() {
    const resultado = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });

    if (resultado.canceled === false) {
      setArquivoSelecionado(resultado.assets[0].name);
    }
  }

  function criar(
    nome: string,
    descricao: string,
    valor: number,
    idCategoria: number,
    data: string,
  ) {
    setErro(undefined);

    adicionar(nome, descricao, valor, idCategoria, data)
      .then(() => {})
      .catch((falha: unknown) => {
        setErro(registrarErro("cadastro", falha).mensagem);
      });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Comprovante PIX</Text>

      <Pressable style={styles.botaoImportar} onPress={escolherImagem}>
        <Text style={styles.textoBotao}>📷 Importar Imagem</Text>
      </Pressable>

      <Pressable style={styles.botaoImportar} onPress={escolherPdf}>
        <Text style={styles.textoBotao}>📄 Importar PDF</Text>
      </Pressable>

      {arquivoSelecionado && (
        <View style={styles.caixaArquivo}>
          <Text style={styles.nomeArquivo}>Arquivo selecionado:</Text>

          <Text style={styles.caminho}>{arquivoSelecionado}</Text>
        </View>
      )}

      <FormularioTransacao aoCriar={criar} />

      {erro && <Text style={styles.erro}>{erro}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: espacos.md,
    backgroundColor: cores.papel,
  },

  titulo: {
    color: cores.tinta,
    fontSize: 22,
    fontWeight: "700",
    marginBottom: espacos.md,
  },

  botaoImportar: {
    backgroundColor: cores.papelCartao,

    borderWidth: 1,
    borderColor: cores.borda,

    borderRadius: raio,

    padding: espacos.md,

    marginBottom: espacos.sm,
  },

  textoBotao: {
    textAlign: "center",
    color: cores.tinta,
    fontWeight: "600",
  },

  caixaArquivo: {
    backgroundColor: cores.papelCartao,

    borderRadius: raio,

    padding: espacos.md,

    marginBottom: espacos.md,
  },

  nomeArquivo: {
    color: cores.tinta,
    fontWeight: "700",
    marginBottom: 4,
  },

  caminho: {
    color: cores.tintaSuave,
    fontSize: 12,
  },

  erro: {
    color: "#dc2626",
    marginTop: espacos.sm,
    fontWeight: "700",
  },
});
