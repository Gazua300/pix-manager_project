import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { url } from '../constants/url'
import { Avatar } from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker'
import Save from '@expo/vector-icons/Entypo'
import Refresh from '@expo/vector-icons/SimpleLineIcons'
import { View, Text, TouchableOpacity, StyleSheet, DevSettings } from 'react-native'


export default function CustomDrawer(props){
    const [usuario, setUsuario] = useState({})
    const [imagem, setImagem] = useState(null)
    const [pic, setPic] = useState(null)
    const [mode, setMode] = useState(false)
    

    

    const mostrarUsuario = async()=>{
        const id = await AsyncStorage.getItem('id')

        axios.get(`${url}/user/${id}`).then(res=>{
            setUsuario(res.data)
        }).catch(e=>{
            console.log(e.response.data)
        })
    }    


    useEffect(()=>{
        mostrarUsuario()            
    }, [])

        
    const pegarImagem = async()=>{
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
        if(status !== 'granted'){
            alert('Necessário permissão para acessar imagens')
        }else{
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                quality: 1
            })
    
            // console.log(result)
    
            if(!result.canceled){
                setImagem(result.assets[0].uri)
                enviarImagem() 
                setMode(true)                 
            }   
        }  
    }


    const enviarImagem = async()=>{
        const id = await AsyncStorage.getItem('id')
        const formData = new FormData()

        formData.append('foto', {
            name: imagem,
            uri: imagem,
            type: 'image/jpg' || 'image/png'
        })

        axios.create({
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).post(`${url}/user/image/${id}`, formData).then(res=>{
            console.log(res.data)
        }).catch(e=>{
            console.log(e)
        })
    }


    const salvarImagem = async()=>{
        const id = await AsyncStorage.getItem('id')

        axios.get(`${url}/user/image/${id}`).then(res=>{
            setPic(res.data)
            setMode(false)
        }).catch(e=>{
            alert(e.response.data)
        })
    }


    

    return(
        <View style={styles.container}>
            <View style={{
                width: '100%',
                height: '25%',
                backgroundColor:'lightblue'
            }}> 
                <View style={{flexDirection:'row', margin:10, alignItems:'center'}}>
                    <TouchableOpacity onPress={pegarImagem}>
                        {!pic && !imagem && !mode? (
                            <Avatar rounded size='medium' source={require('../../assets/user-icon.png')}/>
                        ) : null}
                        {!pic && imagem && mode?  (
                            <Avatar rounded size='medium' source={{ uri: imagem }}/>
                        ) : null}                        
                        {imagem && pic && mode?  (
                            <Avatar rounded size='medium' source={{ uri: imagem }}/>
                        ) : null}                        
                        {(pic && imagem && !mode) || (pic && !imagem && !mode) 
                          ? (
                            <Avatar rounded size='medium' source={{ uri: `data:image/jpeg;base64,${pic}` }}/>                             
                        ) : null}
                        
                    </TouchableOpacity>
                    <Text style={{fontSize:20, margin:10, color:'gray'}}>Loja Online</Text>
                </View>
                {mode ? (
                    <TouchableOpacity onPress={salvarImagem}
                        style={{marginTop:-20, marginLeft:30}}>
                        <Save name='save' color='blue' size={25}/>
                    </TouchableOpacity>
                ) : null}
                {!mode && !imagem && !pic ? (
                    <TouchableOpacity onPress={salvarImagem}
                        style={{marginTop:-20, marginLeft:30}}>
                        <Refresh name='refresh' color='blue' size={20}/>
                    </TouchableOpacity>
                ) : null}
                <Text style={{fontSize:15, margin:10, color:'gray'}}>
                    {usuario.name}
                </Text>
            </View>
            
            <View style={{marginLeft:7}}>
                <TouchableOpacity onPress={()=>{
                    props.navigation.navigate('Home')
                    mostrarUsuario()
                }}>
                    <Text style={styles.txtStyle}>
                        Home
                    </Text>
                </TouchableOpacity>
                
                <TouchableOpacity onPress={()=>{
                    props.navigation.navigate('Produtos')
                    mostrarUsuario()
                }}>
                    <Text style={styles.txtStyle}>
                        Produtos
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>{
                    props.navigation.navigate('Carrinho')
                    mostrarUsuario()
                }}>
                    <Text style={styles.txtStyle}>
                        Carrinho
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>{
                    props.navigation.navigate('Charges')
                    mostrarUsuario()
                }}>
                    <Text style={styles.txtStyle}>
                        Lista de cobranças
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>{
                    props.navigation.navigate('PixSent')
                    mostrarUsuario()
                }}>
                    <Text style={styles.txtStyle}>
                        Pix enviados
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=>{
                    props.navigation.navigate('PixRcvd')
                    mostrarUsuario()
                }}>
                    <Text style={styles.txtStyle}>
                        Pix recebidos
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={{marginTop:20}} 
                    onPress={async()=>{
                        await AsyncStorage.clear()                
                        props.navigation.navigate('Login')
                        DevSettings.reload()
                    }}>
                    <Text style={styles.txtStyle}>
                        Sair
                    </Text>
                </TouchableOpacity>
            </View>

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
    },
    txtStyle: {
        fontSize:17,
        color:'#1919e6',
        margin: 5,
        marginTop: 15
    }
})