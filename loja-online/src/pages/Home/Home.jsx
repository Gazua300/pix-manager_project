import { useState, useContext } from 'react'
import Context from '../../global/Context'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { url } from '../../constants/url'
import * as Clipboard from 'expo-clipboard'
import Ionicons from '@expo/vector-icons/Ionicons'
import { View, Text, Image, StyleSheet, TouchableOpacity, Button } from 'react-native'




export default function Home(props){
    const { states } = useContext(Context)
    const [qrcodeImage, setQrcodeImage] = useState('')
    const [copyAndPaste, setCopyAndPaste] = useState('')
    const total = states.total
    const [mode, setMode] = useState(false)




    const getQrCode = async()=>{
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


    const gerarQrcode = ()=>{
        if(total === ''){
            alert('Necessário solicitar um produto para gerar uma cobranças')
            props.navigation.navigate('Produtos')
        }else{
            getQrCode()
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
            alert(e.response.data)
        })
    }


    return(
        <View style={styles.container}>
            <View style={{marginTop:'25%'}}>
                <Button title='gerar qrcode' onPress={gerarQrcode}/>
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