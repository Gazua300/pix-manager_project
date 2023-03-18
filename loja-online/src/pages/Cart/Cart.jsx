import { useContext, useEffect, useState } from 'react'
import Context from '../../global/Context'
import axios from 'axios'
import { url } from '../../constants/url'
import { View, Text, StyleSheet, FlatList, Button } from 'react-native'



export default function Cart(props){
    const { states, requests } = useContext(Context)
    const items = states.items
    const total = states.total
        


    
    useEffect(()=>{
        requests.cartItems()
    }, [])    


    const delCartItem = (id)=>{
        axios.delete(`${url}/cart/${id}`).then(()=>{
            requests.cartItems()
        }).catch(e=>{
            alert(e.response.data)
        })
    }


    

    return(
        <View>
            <View style={styles.totalStyle}>
                <Text style={styles.txtStyle}>Total: R$ {total}</Text>
                <Button title='Atualizar' onPress={requests.cartItems}/>
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