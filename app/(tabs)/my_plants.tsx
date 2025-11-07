import React, {useEffect, useState} from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    FlatList,
    Modal,
    Button, TextInput
} from 'react-native';
import COLORS from '../../constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import {Planta} from "../../types/Planta";
import {getUsuarioId} from "../../utils/AuthStorageUtils";
import {router} from "expo-router";
import {adicionarPlanta, buscarPlantasPorUsuario, NovaPlantaDTO} from "../../api/apiMetodos";
import ContainerPlanta from "../../components/ContainerPlanta";

const MyPlants = () => {
  const [plantas, setPlantas] = useState<Planta[]>([]);
  const [loading, setLoading] = useState(true);

  const [modalVisivel, setModalVisivel] = useState(false);
  const [novaPlantaNome, setNovaPlantaNome] = useState("");
  const [novaPlantaEspecie, setNovaPlantaEspecie] = useState("");
  const [salvando, setSalvando] = useState(false);

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

    const salvarPlanta = async () => {
        if (!novaPlantaNome || !novaPlantaEspecie) {
            Alert.alert("Erro", "Por favor, preencha o nome e a espécie.");
            return;
        }

        setSalvando(true);
        try {
            const dadosDTO: NovaPlantaDTO = {
                nome: novaPlantaNome,
                especie: novaPlantaEspecie
            };

            const plantaCriada = await adicionarPlanta(dadosDTO);

            setPlantas(listaAntiga => [plantaCriada, ...listaAntiga]);

            setModalVisivel(false);
            setNovaPlantaNome("");
            setNovaPlantaEspecie("");

        } catch (error) {
            Alert.alert("Erro", "Não foi possível salvar a planta.");
        } finally {
            setSalvando(false);
        }
    };

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
            <TouchableOpacity onPress={() => setModalVisivel(true)}>
                <Ionicons name="add-circle" size={64} style={styles.add}/>
            </TouchableOpacity>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisivel}
                onRequestClose={() => setModalVisivel(false)}
            >
                <View style={styles.modalBackdrop}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitulo}>Adicionar Nova Planta</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Nome da Planta (ex: Samambaia)"
                            value={novaPlantaNome}
                            onChangeText={setNovaPlantaNome}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder="Espécie (ex: Nephrolepis exaltata)"
                            value={novaPlantaEspecie}
                            onChangeText={setNovaPlantaEspecie}
                        />

                        <View style={styles.modalBotoes}>
                            <Button
                                title="Cancelar"
                                onPress={() => setModalVisivel(false)}
                                color="red"
                            />
                            <Button
                                title={salvando ? "Salvando..." : "Salvar"}
                                onPress={salvarPlanta}
                                disabled={salvando}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
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
    modalBackdrop: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    modalTitulo: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 15,
    },
    modalBotoes: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 10,
    }
    }      
  );

export default MyPlants;