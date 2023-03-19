import { useState, useEffect } from 'react'
import axios from 'axios'
import { url } from '../../constants/url'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { 
    View,
    TextInput,
    Button,
    StyleSheet,
    BackHandler,
 } from 'react-native'



export default function Login(props){   
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    



    BackHandler.addEventListener('hardwareBackPress', ()=>{
        return true
    })



    useEffect(()=>{
        (async()=>{
            if(await AsyncStorage.getItem('id')){
                props.navigation.navigate('MyDrawer')
            }
        })()
    }, [])


    const login = ()=>{
        const body = {
            email,
            password: senha
        }
        axios.post(`${url}/client/login`, body).then(async res=>{
            await AsyncStorage.setItem('id', res.data)
            props.navigation.navigate('MyDrawer')
            limpar()
        }).catch(e=>{
            alert(e.response.data)
        })
    }


    const limpar = ()=>{
        setEmail('')
        setSenha('')
    }



    return(
        <View>
            <View >
                <TextInput placeholder='nome@email.com'
                    onChangeText={setEmail}
                    value={email}/>
                <TextInput placeholder='Sua senha'
                    onChangeText={setSenha}
                    value={senha}
                    secureTextEntry={true}/>
            </View>
            <View>
                <Button title='Entrar' onPress={login}/>
            </View>
        </View>
    )
}