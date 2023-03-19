import { useState, createContext, useEffect } from "react"
import * as Notifications from 'expo-notifications'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as LocalAuthentication from 'expo-local-authentication'
import axios from 'axios'
import { url } from "../constants/url"


const Context = createContext()


Notifications.setNotificationHandler({
    handleNotification: async()=>({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true
    })
})



export const Provider = (props)=>{
    const [cob, setCob] = useState({})
    const [status, setStatus] = useState('')
    const [items, setItems] = useState([])
    const [total, setTotal] = useState('')
    const [expoPushToken, setExpoPushToken] = useState(null)


console.log('Token do usuário:', expoPushToken)
    
    
    useEffect(()=>{
        registerForNotifications().then(async token=>{
            setExpoPushToken(token)
        })

        atualizarToken()
        
    }, [])


    const atualizarToken = async()=>{
        const id = await AsyncStorage.getItem('id')
            if(expoPushToken){
                const body = {
                    expoPushToken
                }
                axios.patch(`${url}/pushtoken/${id}`, body).then(res=>{
                    console.log(res.data)
                }).catch(e=>{
                    console.log(e.response.data)
                })
            }else{
                console.log('ExpoPushToken está null')
            }
    }


    const autenticacao = async()=>{
        await LocalAuthentication.authenticateAsync()
    }


    const getClients = ()=>{
        axios.get(`${url}/clients`).then(async res=>{
            await AsyncStorage.setItem('clientId', res.data[0].id)
        }).catch(e=>{
            alert(e.response.data)
        })
    }


    const registerForNotifications = async()=>{
        let token
        
        const { status: existingStatus } = await Notifications.getPermissionsAsync()
        let finalStatus = existingStatus

        if(existingStatus !== 'granted'){
            const { status } = await Notifications.requestPermissionsAsync()
            finalStatus = status
        }
        if(finalStatus !== 'granted'){
            alert('Permissão necessária para gerar token de notificação')
        }

        token = (await Notifications.getExpoPushTokenAsync()).data
        
        return token
    }

    registerForNotifications()



    const scheduleNotification = async(title, body, time)=>{
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body
            },
            trigger: { seconds: time }
        })
    }



    const cartItems = async()=>{
        const id = await AsyncStorage.getItem('id')

        axios.get(`${url}/cart/${id}`).then(res=>{
            setItems(res.data)
            somarPreco()
        }).catch(e=>{
            alert(e.response.data)
        })        
    }

    
    const somarPreco = ()=>{        
        if(items.length > 0){
            const precos = items && items.map(valor=>{
                return valor.preco
            })
            
            const resultado = precos && precos.reduce((accumulator, value)=>{
                return accumulator + value
            })
            setters.setTotal(resultado)
        }else{
            setters.setTotal('')
        }
    }


    
    states = { cob, total, items, status }
    setters = { setCob, setTotal, setItems, somarPreco, setStatus, autenticacao }
    requests = { cartItems, scheduleNotification, getClients, atualizarToken }

    return(
        <Context.Provider value={{states, setters, requests}}>
            { props.children }            
        </Context.Provider>
    )
}

export default Context