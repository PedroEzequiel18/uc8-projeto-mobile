import { useEffect, useRef, useState } from 'react';

import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import { useNavigation, useRoute } from '@react-navigation/native';

import type { RouteProp } from '@react-navigation/native';

import * as ImagePicker from 'expo-image-picker';

import * as DocumentPicker from 'expo-document-picker';

import { useIncomingShare } from 'expo-sharing';

import type { RotasDaPilha } from '../navegacao/tipos';

import { CabecalhoTela } from '../components/CabecalhoTela';

import { FormularioTransacao } from '../components/FormularioTransacao';

import { useTransacoes } from '../contexto/TransacoesContexto';

import { registrarErro } from '../erros/erros';

import { lerTextoDoArquivo, type ArquivoParaOcr } from '../servicos/ocr';

import { extrairDadosPix } from '../servicos/pix';

import type { Transacao } from '../types/Transacao';

import { cores, espacos, raio } from '../tema/tema';

type Preenchimento = Partial<Omit<Transacao, 'id'>>;

export default function TelaNovaTransacao() {
  const { adicionar } = useTransacoes();

  const navigation = useNavigation();

  const route = useRoute<RouteProp<RotasDaPilha, 'NovaTransacao'>>();

  const idCategoriaInicial = route.params?.idCategoria;

  // Comprovante enviado pelo botão Compartilhar do app do banco.
  const { resolvedSharedPayloads, clearSharedPayloads } = useIncomingShare();

  // Evita ler o mesmo compartilhamento duas vezes.
  const compartilhamentoLido = useRef(false);

  const [erro, setErro] = useState<string | undefined>();

  const [arquivoSelecionado, setArquivoSelecionado] = useState<
    string | undefined
  >();

  const [lendo, setLendo] = useState(false);

  const [resultadoOcr, setResultadoOcr] = useState<string | undefined>();

  const [erroOcr, setErroOcr] = useState<string | undefined>();

  const [preenchimento, setPreenchimento] = useState<Preenchimento | undefined>(
    idCategoriaInicial !== undefined
      ? { id_categoria: idCategoriaInicial }
      : undefined,
  );

  // Muda a cada leitura para recriar o formulário com os novos valores.
  const [versaoFormulario, setVersaoFormulario] = useState(0);

  // Chegou um comprovante pelo Compartilhar: lê e preenche o formulário.
  useEffect(() => {
    // Sem nada compartilhado: libera para o próximo comprovante.
    if (resolvedSharedPayloads.length === 0) {
      compartilhamentoLido.current = false;
      return;
    }

    if (compartilhamentoLido.current) {
      return;
    }

    const arquivo = resolvedSharedPayloads.find(
      (item) =>
        (item.contentType === 'image' || item.contentType === 'file') &&
        item.contentUri !== null,
    );

    if (!arquivo || arquivo.contentUri === null) {
      return;
    }

    compartilhamentoLido.current = true;

    const mimeType =
      arquivo.contentMimeType ??
      (arquivo.contentType === 'image' ? 'image/jpeg' : 'application/pdf');

    lerComprovante({
      uri: arquivo.contentUri,
      nome: arquivo.originalName ?? 'comprovante',
      mimeType,
    }).then(() => {
      clearSharedPayloads();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedSharedPayloads]);

  async function lerComprovante(arquivo: ArquivoParaOcr) {
    setArquivoSelecionado(arquivo.nome);
    setResultadoOcr(undefined);
    setErroOcr(undefined);
    setLendo(true);

    try {
      const texto = await lerTextoDoArquivo(arquivo);
      const dados = extrairDadosPix(texto);

      setPreenchimento({
        nome: dados.nome ? `PIX - ${dados.nome}` : 'PIX',
        descricao: '',
        valor: dados.valor,
        data: dados.data,
        id_categoria: idCategoriaInicial,
      });
      setVersaoFormulario((atual) => atual + 1);

      const faltando = [
        dados.valor === undefined && 'valor',
        dados.data === undefined && 'data',
      ].filter(Boolean);

      setResultadoOcr(
        faltando.length === 0
          ? 'Valor e data preenchidos. Confira e escolha a categoria.'
          : `Não encontrei: ${faltando.join(' e ')}. Preencha manualmente.`,
      );
    } catch (falha: unknown) {
      setErroOcr(registrarErro('ocr', falha).mensagem);
    } finally {
      setLendo(false);
    }
  }

  async function escolherImagem() {
    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      // Reduz o tamanho: o plano grátis do OCR aceita até 1 MB.
      quality: 0.5,
    });

    if (resultado.canceled) {
      return;
    }

    const imagem = resultado.assets[0];

    await lerComprovante({
      uri: imagem.uri,
      nome: imagem.fileName ?? 'comprovante.jpg',
      mimeType: imagem.mimeType ?? 'image/jpeg',
    });
  }

  async function escolherPdf() {
    const resultado = await DocumentPicker.getDocumentAsync({
      type: 'application/pdf',
      copyToCacheDirectory: true,
    });

    if (resultado.canceled) {
      return;
    }

    const pdf = resultado.assets[0];

    await lerComprovante({
      uri: pdf.uri,
      nome: pdf.name,
      mimeType: pdf.mimeType ?? 'application/pdf',
    });
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
      .then(() => {
        navigation.goBack();
      })
      .catch((falha: unknown) => {
        setErro(registrarErro('cadastro', falha).mensagem);
      });
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Pressable
        accessibilityRole="button"
        onPress={() => navigation.goBack()}
        style={styles.voltar}
      >
        <Text style={styles.textoVoltar}>‹ Voltar</Text>
      </Pressable>

      <CabecalhoTela sobretitulo="MOVIMENTAÇÕES" titulo="Nova Transação" />

      <Text style={styles.dica}>
        Importe um comprovante PIX para preencher valor e data automaticamente.
      </Text>

      <Pressable
        style={[styles.botaoImportar, lendo && styles.desabilitado]}
        onPress={escolherImagem}
        disabled={lendo}
      >
        <Text style={styles.textoBotao}>📷 Importar Imagem</Text>
      </Pressable>

      <Pressable
        style={[styles.botaoImportar, lendo && styles.desabilitado]}
        onPress={escolherPdf}
        disabled={lendo}
      >
        <Text style={styles.textoBotao}>📄 Importar PDF</Text>
      </Pressable>

      {arquivoSelecionado && (
        <View style={styles.caixaArquivo}>
          <Text style={styles.nomeArquivo}>Arquivo selecionado:</Text>

          <Text style={styles.caminho}>{arquivoSelecionado}</Text>

          {lendo && (
            <View style={styles.linhaLendo}>
              <ActivityIndicator size="small" color={cores.receita} />
              <Text style={styles.caminho}>Lendo comprovante...</Text>
            </View>
          )}

          {resultadoOcr && (
            <Text style={styles.sucessoOcr}>{resultadoOcr}</Text>
          )}

          {erroOcr && <Text style={styles.erro}>{erroOcr}</Text>}
        </View>
      )}

      <FormularioTransacao
        key={versaoFormulario}
        aoCriar={criar}
        valoresIniciais={preenchimento}
      />

      {erro && <Text style={styles.erro}>{erro}</Text>}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: espacos.md,
    paddingTop: 50,
    paddingBottom: espacos.lg * 2,
    backgroundColor: cores.papel,
  },

  voltar: {
    alignSelf: 'flex-start',
    marginBottom: espacos.sm,
  },

  textoVoltar: {
    color: cores.receita,
    fontWeight: '700',
  },

  titulo: {
    color: cores.tinta,
    fontSize: 22,
    fontWeight: '700',
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
    textAlign: 'center',
    color: cores.tinta,
    fontWeight: '600',
  },

  caixaArquivo: {
    backgroundColor: cores.papelCartao,

    borderRadius: raio,

    padding: espacos.md,

    marginBottom: espacos.md,
  },

  nomeArquivo: {
    color: cores.tinta,
    fontWeight: '700',
    marginBottom: 4,
  },

  caminho: {
    color: cores.tintaSuave,
    fontSize: 12,
  },

  dica: {
    color: cores.tintaSuave,
    marginBottom: espacos.md,
  },

  desabilitado: {
    opacity: 0.5,
  },

  linhaLendo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: espacos.sm,
    marginTop: espacos.sm,
  },

  sucessoOcr: {
    color: cores.receita,
    fontWeight: '700',
    marginTop: espacos.sm,
  },

  erro: {
    color: '#dc2626',
    marginTop: espacos.sm,
    fontWeight: '700',
  },
});
