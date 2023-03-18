import { useContext, useEffect, useState } from 'react'
import Context from '../../global/Context'
import * as Notifications from 'expo-notifications'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { url } from '../../constants/url'
import { View, Text, StyleSheet, FlatList, Button } from 'react-native'



export default function Cart(props){
    const { states, setters, requests } = useContext(Context)
    const total = states.total
    const [items, setItems] = useState([])
    


    
    useEffect(()=>{
        cartItems()        
    }, [])


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
        axios.get(`${url}/cart`).then(res=>{
            const valores = res.data
            const precos = valores && valores.map(valor=>{
                return valor.preco
            })
            
            const resultado = precos && precos.reduce((accumulator, value)=>{
                return accumulator + value
            })
            setters.setTotal(resultado)
        }).catch(e=>{
            alert(e.response.data)
        })
    }


    const delCartItem = (id)=>{
        axios.delete(`${url}/cart/${id}`).then(()=>{
            cartItems()

        }).catch(e=>{
            alert(e.response.data)
        })
    }


    const onTapNotifications = ()=>{
        const subcription = Notifications.addNotificationResponseReceivedListener(res=>{
            props.navigation.navigate('Carrinho')
        })
        subcription.remove()
    }
    


    

    return(
        <View>
            <View style={styles.totalStyle}>
                <Text style={styles.txtStyle}>Total: R$ {total}</Text>
                <Button title='Atualizar' onPress={cartItems}/>
            </View>  
            <FlatList
                data={items}
                keyExtractor={item => item.id}
                renderItem={({item: produto})=>(
                    <View style={styles.card}>
                        <Text>{produto.nome}</Text>
                        <Text>R$ {produto.preco.toFixed(2)}</Text>
                        <Button title='excluir' onPress={()=> delCartItem(produto.id)}/>
                    </View>
                )}/>
        </View>
    )
}


const styles = StyleSheet.create({
    totalStyle: {
        margin: 20,
        flexDirection: 'column',
        alignItems: 'center',
    },
    txtStyle: {
        marginTop: 30,
        marginBottom: 5,
        fontSize:18,
        textAlign:'center'
    },
    card: {
        margin: 10,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'lightgray',
        padding: 5,
        borderRadius: 5
    },
})