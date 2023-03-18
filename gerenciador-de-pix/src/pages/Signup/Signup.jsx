import { useState } from 'react'
import axios from 'axios'
import { url } from '../../constants/url'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { 
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    TouchableOpacity
 } from 'react-native'



export default function Signup(props){ 
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    
    

    const signup = ()=>{
        const body = {
            name: nome,
            email,
            password: senha
        }
        axios.post(`${url}/client/signup`, body).then(async res=>{
            await AsyncStorage.setItem('id', res.data)
            props.navigation.navigate('MyDrawer')
            limpar()
        }).catch(e=>{
            alert(e.response.data)
        })
    }


    const limpar = ()=>{
        setNome('')
        setEmail('')
        setSenha('')
    }



    return(
        <View>
            <View >
                <TextInput placeholder='Seu nome'
                    onChangeText={setNome}
                    value={nome}/>
                <TextInput placeholder='nome@email.com'
                    onChangeText={setEmail}
                    value={email}/>
                <TextInput placeholder='Sua senha'
                    onChangeText={setSenha}
                    value={senha}
                    secureTextEntry={true}/>
            </View>
            <View>
                <Button title='Registrar' onPress={signup}/>
            </View>
        </View>
    )
}