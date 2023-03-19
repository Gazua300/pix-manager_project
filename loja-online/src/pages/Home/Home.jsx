import { useState, useContext } from 'react'
import Context from '../../global/Context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as LocalAuthentication from 'expo-local-authentication'
import axios from 'axios'
import { url } from '../../constants/url'
import * as Clipboard from 'expo-clipboard'
import Ionicons from '@expo/vector-icons/Ionicons'
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Button,
    Modal,
    Switch
} from 'react-native'




export default function Home(props){
    const { states, requests } = useContext(Context)
    const [qrcodeImage, setQrcodeImage] = useState('')
    const [copyAndPaste, setCopyAndPaste] = useState('')
    const total = states.total
    const [mode, setMode] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [selecionado, setSelecionado] = useState(false)
    



    const gerarQrCode = async()=>{
        requests.atualizarToken()
        const result = await LocalAuthentication.authenticateAsync()

        if(result.success){
            const date = new Date()
            const options = { timeZone: 'UTC' }
            const body = {
                valor: total.toFixed(2),
                criacao: `${date.toLocaleDateString('pt-BR', options)} às ${date.toLocaleTimeString()}`, 
                userId: await AsyncStorage.getItem('id')
            }
            axios.post(`${url}/qrcode`, body).then(res=>{
                setQrcodeImage(res.data.qrCode.imagemQrcode)
                setCopyAndPaste(res.data.qrCode.qrcode)
                notificar()
            }).catch(e=>{
                alert(e)
            })
        }
    }


    const verificarBloqueioDeTela = async()=>{
        const hasHardware = await LocalAuthentication.hasHardwareAsync()
        const isEnrolled = await LocalAuthentication.isEnrolledAsync()
                
        if(hasHardware && isEnrolled){
            gerarQrCode()        
        }else{
            selecionado ? gerarQrCode() : setShowModal(true)
        }
    }


    const verificarValorQrCode = ()=>{
        if(total === ''){
            alert('Necessário solicitar um produto para gerar uma cobranças')
            props.navigation.navigate('Produtos')
        }else{
            verificarBloqueioDeTela()
        }
    }
    

    const copyToCliboard = async()=>{
        await Clipboard.setStringAsync(copyAndPaste)
       
        setMode(true)
        setTimeout(()=>{
        setMode(false)
        }, 2000)

    }


    const notificar = async()=>{
        const id = await AsyncStorage.getItem('clientId')
        const body = {
            title: `Cobrança realizada`,
            body: `Nova cobrança no valor de R$ ${total.toFixed(2)}`
        }
        axios.post(`${url}/notification/${id}`, body).then(res=>{
            console.log(res.data)
        }).catch(e=>{
            console.log(e.response.data)
        })
    }


    return(
        <View style={styles.container}>
            <View style={{marginTop:'25%'}}>
                <Button title='gerar qrcode' onPress={verificarValorQrCode}/>
            </View>
            <Text style={{fontSize:20, margin:10}}>
                Total à pagar: R$ {total ?  total.toFixed(2) : null}
            </Text>
            {qrcodeImage && (
                <Image style={{width:150, height:150}}
                source={{uri: qrcodeImage}}/>
            )}
            {mode ? (
                <Text style={styles.subtitle}>
                    Copiado ✔️
                </Text>
            ) : null}

            
            {!selecionado ? (
                <Modal
                    animationType='slide'
                    visible={showModal}
                    transparent={true}
                    onRequestClose={()=> setShowModal(false)}>
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
                                alignItems:'center'
                                }}>
                                <TouchableOpacity onPress={()=> setShowModal(false)}>
                                    <Text style={{color:'blue', fontSize:18, marginLeft:50}}>
                                        Cancelar
                                    </Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>{ 
                                    setShowModal(false)
                                    gerarQrCode()
                                }}>
                                    <Text style={{color:'blue', fontSize:18, marginLeft:50}}>
                                        Ok
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            ) : null}




            <TouchableOpacity style={styles.cpStyle}
                onPress={copyToCliboard}>
                {copyAndPaste ? (
                    <>
                        <Text style={{fontWeight:'bold'}}>
                            Pix copia e cola{'  '}
                        </Text>
                        <Ionicons name='copy' size={20}/>   
                    </>             
                ) : null}
            </TouchableOpacity>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    },
    cpStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop:20
    },
    subtitle: {
        backgroundColor: 'lightblue',
        borderRadius: 10,
        padding: 10,
        margin: 5
    }
})