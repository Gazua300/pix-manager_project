import { useContext, useEffect, useState } from 'react'
import Context from '../../global/Context'
import * as LocalAuthentication from 'expo-local-authentication'
import axios from 'axios'
import { url } from '../../constants/url'
import { Searchbar } from 'react-native-paper'
import Refresh from '@expo/vector-icons/SimpleLineIcons'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Button,
    TextInput,
    Alert,
    TouchableOpacity,
    Modal,
    Switch
} from 'react-native'



export default function Products(props){
    const { requests } = useContext(Context)
    const [nome, setNome] = useState('')
    const [preco, setPreco] = useState('')
    const [items, setItems] = useState([])
    const [mode, setMode] = useState(false)
    const [title, setTitle] = useState('inserir produto')
    const [searchWord, setSearchWord] = useState('')
    const [modalExcluir, setModalExcluir] = useState(false)
    const [modalInput, setModalInput] = useState(false)
    const [selecionado, setSelecionado] = useState(false) 
    const [item, setItem] = useState({})
    

  console.log(selecionado)
    
    
    useEffect(()=>{
         mostrarProdutos()
         requests.atualizarToken()

    }, [])


    const mostrarProdutos = ()=>{
        axios.get(`${url}/products`).then(res=>{
            setItems(res.data)
        }).catch(e=>{
            alert(e.response.data)
        })
    }



    const mostrarInput = async()=>{
        if(!mode){
            const result = await LocalAuthentication.authenticateAsync()
    
            if(result.success){
                mode ? setMode(false) : setMode(true)
                title === 'inserir produto' ? setTitle('ocultar') : setTitle('inserir produto')
            }
        }
    }


    const confirmarMostrarInput = async()=>{        
        const hasHardware = await LocalAuthentication.hasHardwareAsync()
        const isEnrolled = await LocalAuthentication.isEnrolledAsync()
        
        if(!mode){
            if(hasHardware && isEnrolled){
                mostrarInput()
            }else{
                setModalInput(true)
            } 
        }          

    }


    const inserirProduto = ()=>{
        const body = {
            preco,
            nome            
        }
        axios.post(`${url}/products`, body).then(()=>{
            mostrarProdutos()
            notificarInsercaoDeProduto()
            limpar()
        }).catch(e=>{
            alert(e.response.data)
        })
        
    }


    const deletarProduto = async()=>{
        if(item){
            const result = await LocalAuthentication.authenticateAsync()
    
            if(result.success){
                axios.delete(`${url}/products/${item.id}`).then(()=>{
                    mostrarProdutos()
                    notificarExclusaoDeProduto(item)
                }).catch(e=>{
                    alert(e.response.data)
                })
            }            
        }
    }
        

    const bloqueioDeTelaExclusao = async(produto)=>{
        const hasHardware = await LocalAuthentication.hasHardwareAsync()
        const isEnrolled = await LocalAuthentication.isEnrolledAsync()

        if(hasHardware && isEnrolled){  
            deletarProduto(produto)
        }else{
            if(selecionado){
                deletarProduto(produto)
            }
            setItem(produto)
            setModalExcluir(true)
        }
        
    }


    const confirmarExclusaoDeProduto = (produto)=>{
        Alert.alert(
            'Atenção:',
            `Tem certeza que deseja excluir ${produto.nome}? Seus clientes não poderão mais comprar o produto`,
            [
                {
                    text:'Cancelar'
                },
                {
                    text:'Ok',
                    onPress: ()=> bloqueioDeTelaExclusao(produto)
                }
            ]
        )
    }


    const limpar = ()=>{
        setNome('')
        setPreco('')
    }


    const notificarInsercaoDeProduto = ()=>{
        const body = {
            title: 'Novo produto adicionado',
            body: `${nome}: R$ ${preco}`
        }
        axios.post(`${url}/notifications`, body).then(res=>{
            console.log(res.data)
        }).catch(e=>{
            console.log(e.response.data)
        })
    }

    const notificarExclusaoDeProduto = (produto)=>{
        const body = {
            title: 'Produto exluído',
            body: `${produto.nome} de R$ ${produto.preco} foi excluído(a)`
        }
        axios.post(`${url}/notifications`, body).then(res=>{
            console.log(res.data)
        }).catch(e=>{
            console.log(e.response.data)
        })
    }


//================BUSCAR PRODUTO================================
    const found = items && items.filter(item=>{
        return item.nome.toLowerCase().includes(searchWord.toLowerCase())
    })

//==============================================================



    return(
        <View>
            <View style={{marginHorizontal:'30%', marginTop:'10%'}}>
                <Button title={title} onPress={()=>{
                    if(mode){
                        setMode(false)
                        setTitle('inserir produto')
                    }else{
                        confirmarMostrarInput()
                    }
                }}/>
            </View>   
            {mode ? (
                <>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.input}
                        placeholder='Nome do produto'
                        onChangeText={setNome}
                        value={nome}/>
                    <TextInput style={styles.input}
                        placeholder='R$ 0.00'
                        onChangeText={setPreco}
                        value={preco}
                        keyboardType='numeric'/>
                </View>
                <View style={styles.btnContainer}>
                    <Button title='Registrar' onPress={inserirProduto}/>
                    <Button title='Limpar' onPress={limpar}/>
                </View>
                </>
            ) : null}         
            <Searchbar style={{
                        backgroundColor:'lightgray',
                        marginHorizontal: 10,
                        marginVertical: 20
                    }}
                onChangeText={setSearchWord}
                value={searchWord}
                placeholder='Nome do produto'/>
            
{/*==========ALERTA DE BLOQUEIO DE TELA PARA MOSTRAR INPUT============== */}
            {!selecionado ? (
                <Modal
                    animationType='slide'
                    visible={modalInput}
                    transparent={true}
                    onRequestClose={()=> setModalInput(false)}>
                    <View style={{
                        flex:1,
                        alignItems:'center',
                        justifyContent:'center',
                        backgroundColor:'rgba(0, 0, 0, 0.5)'
                        }}>
                        <View style={{ backgroundColor:'white', width:'80%', height:'40%', padding:20 }}>
                            <Text style={{fontSize:17, fontWeight:'bold'}}>
                                Por motivos de segurança ative o bloqueio de tela!
                            </Text>
                            <Text style={{fontSize:15, marginVertical:20}}>
                                Ative o bloqueio de tela nas configurações ou pode seguir por sua conta e risco.
                            </Text>

                            <View style={{flexDirection:'row', alignItems:'center'}}>
                                <Switch onValueChange={setSelecionado} value={selecionado}/>
                                <Text>
                                    Não mostrar{'\n'}mais essa mensagem
                                </Text>
                            </View>
                            
                            <View style={{
                                marginTop:'10%',
                                marginLeft:90,
                                flexDirection:'row',
                                alignItems:'center',
                                justifyContent:'space-around'

                                }}>
                                <TouchableOpacity onPress={()=> setModalInput(false)}>
                                    <Text style={{color:'blue', fontSize:18}}>
                                        Cancelar
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>{
                                    setModalInput(false)
                                    mostrarInput()
                                }}>
                                    <Text style={{color:'blue', fontSize:18}}>
                                        Ok
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
             ) : null}

{/*==============ALERTA DE BLOQUEIO DE TELA PARA EXCLUIR PRODUTO=================*/}
            {!selecionado ? (
                <Modal
                    animationType='slide'
                    visible={modalExcluir}
                    transparent={true}
                    onRequestClose={()=> setModalExcluir(false)}>
                    <View style={{
                        flex:1,
                        alignItems:'center',
                        justifyContent:'center',
                        backgroundColor:'rgba(0, 0, 0, 0.5)'
                        }}>
                        <View style={{ backgroundColor:'white', width:'80%', height:'40%', padding:20 }}>
                            <Text style={{fontSize:17, fontWeight:'bold'}}>
                                Por motivos de segurança ative o bloqueio de tela!
                            </Text>
                            <Text style={{fontSize:15, marginVertical:20}}>
                                Ative o bloqueio de tela nas configurações ou pode seguir por sua conta e risco.
                            </Text>

                            <View style={{flexDirection:'row', alignItems:'center'}}>
                                <Switch onValueChange={setSelecionado} value={selecionado}/>
                                <Text>
                                    Não mostrar{'\n'}mais essa mensagem
                                </Text>
                            </View>
                            
                            <View style={{
                                marginTop:'10%',
                                marginLeft:90,
                                flexDirection:'row',
                                alignItems:'center',
                                justifyContent:'space-around'

                                }}>
                                <TouchableOpacity onPress={()=> setModalExcluir(false)}>
                                    <Text style={{color:'blue', fontSize:18}}>
                                        Cancelar
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>{
                                    setModalExcluir(false)
                                    deletarProduto()
                                }}>
                                    <Text style={{color:'blue', fontSize:18}}>
                                        Ok
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            ) : null}
            <View style={{margin:5, marginBottom:35}}>
                <View style={{alignItems:'center'}}>                    
                    <TouchableOpacity style={styles.refreshBtn}
                        onPress={mostrarProdutos}>
                        <Refresh name='refresh' size={20} color='whitesmoke'/>
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={found}
                    keyExtractor={item => item.id}
                    renderItem={({item: produto})=>(
                        <View style={styles.card}>
                            <Text>{produto.nome}</Text>
                            <Text>R$ {produto.preco.toFixed(2)}</Text>
                            <Button title='Excluir' onPress={()=> confirmarExclusaoDeProduto(produto)}/>
                        </View>
                    )}
                    />
            </View>             
        </View>
    )
}


const styles = StyleSheet.create({
    compra: {
        marginTop: 25,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    inputContainer: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    input: {
        height: 40,
        margin: 10,
        fontSize: 15,
        textAlign: 'center',
        borderBottomWidth: 1,
        width: '35%'
    },
    btnContainer: {
        marginTop: 10,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    refreshBtn: {
        backgroundColor: '#3994BC',
        width: '15%',
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,
        borderRadius: 20
    },
    card: {
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'lightgray',
        padding: 5,
        borderRadius: 5
    },
})