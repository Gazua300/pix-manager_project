import { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'
import { url } from '../../constants/url'
import { View, Text, StyleSheet, FlatList, Button } from 'react-native'



export default function Products(props){
    const [items, setItems] = useState([])
    const [valor, setValor] = useState({})
    

  
    
    useEffect(()=>{
        mostrarProdutos()
    }, [])


    const mostrarProdutos = ()=>{
        axios.get(`${url}/products`).then(res=>{
            setItems(res.data)
        }).catch(e=>{
            alert(e.response.data)
        })
    }
        

    const solicitarProduto = async(produto)=>{
        const body = {
            nome: produto.nome,
            preco: produto.preco,
            provider: await AsyncStorage.getItem('id')
        }
        axios.post(`${url}/cart`, body).then(()=>{
            setValor(produto)
        }).catch(e=>{
            alert(e.response.data)
        })        
    }



    return(
        <View>
            <View style={{alignItems:'center', marginTop:'10%', marginBottom:20}}>
                <Button title='atualizar lista' onPress={mostrarProdutos}/>
            </View>  
            {Object.keys(valor).length > 0 ? (
                <View style={styles.compra}>
                    <Text style={{fontSize:18}}>{valor.nome}</Text>
                    <Text style={{fontSize:18}}>R$ {valor.preco.toFixed(2)}</Text>
                </View>
            ) : null}              
            <FlatList
                data={items}
                keyExtractor={item => item.id}
                renderItem={({item: produto})=>(
                    <View style={styles.card}>
                        <Text>{produto.nome}</Text>
                        <Text>R$ {produto.preco.toFixed(2)}</Text>
                        <Button title='carrinho' onPress={()=> solicitarProduto(produto)}/>
                    </View>
                )}
                />
        </View>
    )
}


const styles = StyleSheet.create({
    compra: {
        marginTop: 25,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    inputContainer: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    input: {
        height: 40,
        margin: 10,
        fontSize: 15,
        textAlign: 'center',
        borderBottomWidth: 1,
        width: '35%'
    },
    btnContainer: {
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
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