import { useContext, useEffect, useState } from 'react'
import Context from '../../global/Context'
import axios from 'axios'
import { url } from '../../constants/url'
import { Searchbar } from 'react-native-paper'
import { View, Text, StyleSheet, FlatList, Button, TextInput } from 'react-native'



export default function Products(props){
    const { states, requests } = useContext(Context)
    const [nome, setNome] = useState('')
    const [preco, setPreco] = useState('')
    const [items, setItems] = useState([])
    const [searchWord, setSearchWord] = useState('')
    

  
    
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


    const inserirProduto = ()=>{
        const body = {
            preco,
            nome            
        }
        axios.post(`${url}/products`, body).then(()=>{
            mostrarProdutos()
            notificarInsercaoDeProduto()
            limpar()
        }).catch(e=>{
            alert(e.response.data)
        })
    }
        

    const deletarProduto = (produto)=>{
        axios.delete(`${url}/products/${produto.id}`).then(()=>{
            mostrarProdutos()
            notificarExclusaoDeProduto(produto)
        }).catch(e=>{
            alert(e.response.data)
        })
    }


    const limpar = ()=>{
        setNome('')
        setPreco('')
    }


    const notificarInsercaoDeProduto = ()=>{
        const body = {
            title: 'Novo produto adicionado',
            body: `${nome}: R$ ${preco}`
        }
        axios.post(`${url}/notifications`, body).then(res=>{
            console.log(res.data)
        }).catch(e=>{
            alert(e.response.data)
        })
    }

    const notificarExclusaoDeProduto = (produto)=>{
        const body = {
            title: 'Produto exluído',
            body: `${produto.nome} de R$ ${produto.preco} foi excluído(a)`
        }
        axios.post(`${url}/notifications`, body).then(res=>{
            console.log(res.data)
        }).catch(e=>{
            console.log(e.response.data)
        })
    }


//================BUSCAR PRODUTO================================
    const found = items && items.filter(item=>{
        return item.nome.toLowerCase().includes(searchWord.toLowerCase())
    })

//==============================================================



    return(
        <View>   
            <Text style={{textAlign:'center', fontSize:18, marginTop:20}}>
                Inserir Produto
            </Text>         
            <View style={styles.inputContainer}>
                <TextInput style={styles.input}
                    placeholder='Nome do produto'
                    onChangeText={setNome}
                    value={nome}/>
                <TextInput style={styles.input}
                    placeholder='R$ 0.00'
                    onChangeText={setPreco}
                    value={preco}
                    keyboardType='numeric'/>
            </View>
            <View style={styles.btnContainer}>
                <Button title='Registrar' onPress={inserirProduto}/>
                <Button title='Limpar' onPress={limpar}/>
            </View>
            <Searchbar style={{
                        backgroundColor:'lightgray',
                        marginHorizontal: 10,
                        marginVertical: 20
                    }}
                onChangeText={setSearchWord}
                value={searchWord}
                placeholder='Buscar'/>
            <View style={{margin:5, marginBottom:35}}>
                <FlatList
                    data={found}
                    keyExtractor={item => item.id}
                    renderItem={({item: produto})=>(
                        <View style={styles.card}>
                            <Text>{produto.nome}</Text>
                            <Text>R$ {produto.preco.toFixed(2)}</Text>
                            <Button title='Excluir' onPress={()=> deletarProduto(produto)}/>
                        </View>
                    )}
                    />
            </View>             
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
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    card: {
        margin: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'lightgray',
        padding: 5,
        borderRadius: 5
    },
})