import { useState, createContext, useEffect } from "react"
import * as Notifications from 'expo-notifications'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { url } from "../constants/url"

const Context = createContext()


Notifications.setNotificationHandler({
    handleNotification: async()=>({
        shouldShowAlert: true,
        shouldSetBadge: true,
        shouldPlaySound: true
    })
})


export const Provider = (props)=>{
    const [cob, setCob] = useState({})
    const [total, setTotal] = useState('')
    const [expoPushToken, setExpoPushToken] = useState(null)

console.log('Token do cliente: ', expoPushToken)


    useEffect(()=>{
        registerForNotifications().then(async(token)=>{
            setExpoPushToken(token)
        })
    }, [])

    useEffect(()=>{
        (async()=>{
            const id = await AsyncStorage.getItem('id')
            if(expoPushToken){
                const body = {
                    expoPushToken
                }            
                axios.patch(`${url}/client/pushtoken/${id}`, body).then(res=>{
                    console.log(res.data)
                }).catch(e=>{
                    console.log(e.response.data)
                })
            }else{
                console.log('ExpoPushToken está null')
            }
        })()        
    }, [])


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


    const scheduleNotification = async(title, body, fct)=>{
        await Notifications.scheduleNotificationAsync({
            content: {
                title,
                body,
            },
            trigger: { seconds: 3 }
        })
        
        fct()
    }


    states = { cob, total }
    setters = { setCob, setTotal }
    requests = { scheduleNotification }

    return(
        <Context.Provider value={{states, setters, requests}}>
            { props.children }            
        </Context.Provider>
    )
}

export default Context