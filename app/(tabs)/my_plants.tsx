import React, {useEffect, useState} from "react";
import {View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, FlatList} from 'react-native';
import COLORS from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import {Planta} from "../../types/Planta";
import {getUsuarioId} from "../../utils/AuthStorageUtils";
import {router} from "expo-router";
import {buscarPlantasPorUsuario} from "../../api/apiMetodos";
import ContainerPlanta from "../../components/ContainerPlanta";

const MyPlants = () => {
  const [plantas, setPlantas] = useState<Planta[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarPlantas = async () => {
      try {
          setLoading(true);
          const usuarioId = await getUsuarioId();

          if(!usuarioId){
              Alert.alert("Erro", "Usuário não encontrado. Faça login novamente")
              router.replace("/login");
              return;
          }

          const dados = await buscarPlantasPorUsuario();
          setPlantas(dados)
      }catch (error){
          Alert.alert('Erro', "não foi possível carregar as suas plantas")
      }finally {
          setLoading(false);
      }
  }

  useEffect(()=> {
      carregarPlantas();
  }, [])

    const componenteVazio =  () => (
        <View style={styles.containerVazio}>
            <Text style={styles.containerVazioTexto}> Você ainda não cadastrou nenhuma planta</Text>
        </View>
    )

    return (
        <View style={styles.container}>
            <Text style={styles.texto}>Minhas Plantas</Text>
            {loading ? (
                <ActivityIndicator size="large" color={COLORS.verdeMedio} style={styles.loader} />
            ) : (
                <FlatList
                    data={plantas}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => (
                        <ContainerPlanta planta={item} />
                    )}
                    ListEmptyComponent={componenteVazio}
                />
            )}
            <TouchableOpacity>
                <Ionicons name="add-circle" size={64} style={styles.add} />
            </TouchableOpacity>
        </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.begeFundo,
        alignItems: "center",
    },
    texto: {
        marginBottom: 30,
        fontSize: 30,
        fontFamily: "Inter",
        color: COLORS.verdeEscuro,
        marginTop: 20,
    },
    containerVazio: {
        marginTop: 50,
        alignItems: 'center'
    },
    containerVazioTexto: {
        fontSize: 16,
        color: COLORS.verdeMedio,
    },
    add: {
        position: 'absolute',
        bottom: 30,
        right: -30,
        color: COLORS.verdeEscuro,
        shadowColor: "#000",
    },
    loader: {
        marginTop: 50,
    },

    }      
  );

export default MyPlants;