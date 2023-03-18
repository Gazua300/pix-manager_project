import { useState, useEffect, useContext } from 'react'
import Context from '../../global/Context'
import axios from 'axios'
import { url } from '../../constants/url'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { 
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    BackHandler,
    TouchableOpacity
 } from 'react-native'



export default function Login(props){    
    const { requests } = useContext(Context)
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
        axios.post(`${url}/login`, body).then(async res=>{
            await AsyncStorage.setItem('id', res.data)
            requests.getClients()
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
            <View style={styles.txtContainer}>
                <Text style={styles.txtStyle}>Ou{' '}</Text>
                <TouchableOpacity onPress={()=> props.navigation.navigate('Signup')}>
                    <Text style={[styles.txtStyle, { color:'blue' }]}>
                        cadastre-se
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    txtContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20
    },  
    txtStyle: {
        fontSize:18
    }
})