import { useState } from 'react';

import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import DateTimePicker, {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import { dataParaTexto, dateParaIso, isoParaDate } from '../utils/datas';

import { cores, espacos, raio } from '../tema/tema';

interface CampoDataProps {
  rotulo: string;
  // "aaaa-mm-dd" ou "" (sem data)
  valor: string;
  aoMudar: (iso: string) => void;
  // Permite apagar a data (usado nos filtros).
  permitirVazio?: boolean;
  textoVazio?: string;
}

export function CampoData({
  rotulo,
  valor,
  aoMudar,
  permitirVazio = false,
  textoVazio = 'Selecionar data',
}: CampoDataProps) {
  // No iOS o calendário aparece dentro da tela.
  const [mostrarIos, setMostrarIos] = useState(false);

  const dataAtual = valor ? isoParaDate(valor) : new Date();

  function aoEscolher(evento: DateTimePickerEvent, data?: Date) {
    setMostrarIos(false);

    if (evento.type === 'set' && data) {
      aoMudar(dateParaIso(data));
    }
  }

  function abrir() {
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: dataAtual,
        mode: 'date',
        onChange: aoEscolher,
      });
    } else {
      setMostrarIos((atual) => !atual);
    }
  }

  return (
    <View style={styles.grupo}>
      <Text style={styles.rotulo}>{rotulo}</Text>

      <View style={styles.linha}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`${rotulo}: ${valor ? dataParaTexto(valor) : textoVazio}`}
          onPress={abrir}
          style={({ pressed }) => [
            styles.entrada,
            pressed && styles.pressionado,
          ]}
        >
          <Text style={valor ? styles.texto : styles.textoVazio}>
            📅 {valor ? dataParaTexto(valor) : textoVazio}
          </Text>
        </Pressable>

        {permitirVazio && valor !== '' && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Limpar ${rotulo}`}
            onPress={() => aoMudar('')}
            style={styles.limpar}
          >
            <Text style={styles.textoLimpar}>✕</Text>
          </Pressable>
        )}
      </View>

      {Platform.OS === 'ios' && mostrarIos && (
        <DateTimePicker
          value={dataAtual}
          mode="date"
          display="inline"
          onChange={aoEscolher}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  grupo: {
    marginBottom: espacos.sm,
  },

  rotulo: {
    color: cores.tintaSuave,
    marginBottom: espacos.xs,
  },

  linha: {
    flexDirection: 'row',
    gap: espacos.sm,
  },

  entrada: {
    flex: 1,
    backgroundColor: cores.papelCartao,
    borderRadius: raio,
    borderWidth: 1,
    borderColor: cores.borda,
    padding: espacos.md,
  },

  pressionado: {
    opacity: 0.7,
  },

  texto: {
    color: cores.tinta,
  },

  textoVazio: {
    color: cores.tintaSuave,
  },

  limpar: {
    justifyContent: 'center',
    paddingHorizontal: espacos.md,
    borderRadius: raio,
    borderWidth: 1,
    borderColor: cores.borda,
    backgroundColor: cores.papelCartao,
  },

  textoLimpar: {
    color: cores.tinta,
    fontWeight: '700',
  },
});
