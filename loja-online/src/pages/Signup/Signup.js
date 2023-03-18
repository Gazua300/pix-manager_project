import { useState, useContext } from 'react'
import Context from '../../global/Context'
import axios from 'axios'
import { url } from '../../constants/url'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { 
    View,
    TextInput,
    Button,
 } from 'react-native'



export default function Signup(props){ 
    const { requests } = useContext(Context)
    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    
    

    const signup = ()=>{
        const body = {
            name: nome,
            email,
            password: senha
        }
        axios.post(`${url}/signup`, body).then(async res=>{
            await AsyncStorage.setItem('id', res.data)
            requests.getClients()
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