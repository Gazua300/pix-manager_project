import { useEffect, useState, useContext } from 'react'
import Context from '../../global/Context'
import * as Notifications from 'expo-notifications'
import axios from 'axios'
import { url } from '../../constants/url'
import { convertDate } from '../../utils/ConvertDate'
import { convertHour } from '../../utils/ConvertDate'
import { Searchbar } from 'react-native-paper'
import { TextInputMask } from 'react-native-masked-text'
import {
    View,
    Text,
    StyleSheet,
    Button,
    FlatList,
    TouchableOpacity
} from 'react-native'


export default function Charges(props){
    const { states, setters, requests } = useContext(Context)
    const [inicio, setInicio] = useState('')
    const [fim, setFim] = useState('')
    const [cobs, setCobs] = useState([])
    const [usuariosCobs, setUsuariosCobs] = useState([])
    const [searchTime, setSearchTime] = useState('')
    const [total, setTotal] = useState('')




    useEffect(()=>{
        // checarUsuarioListaDeCobranca()
    }, [])

    
    const consultarListaDeCobranca = ()=>{
        const body = {
            inicio,
            fim
        }
        axios.post(`${url}/client/listcob`, body).then(res=>{
            setCobs(res.data)            
        }).catch(e=>{
            alert(e.response.data)
            if(cobs.length > 0){
                setCobs([])
            }
        })
        
    }


    // const valorTotal = ()=>{
    //     if(cobs.length > 0){
    //         const valores = cobs.map(cob=>{
    //             return Number(cob.valor.original)
    //         })
        
    //         const resultado = valores.reduce((accumulator, value)=>{
    //             return accumulator + value
    //         })
                        
    //         setTotal(resultado)
    //     }else{
    //         setTotal('')
    //     }
        
    // }


    const consultarCobranca = (id)=>{
        axios.get(`${url}/client/cob/${id}`).then(res=>{
            setters.setCob(res.data)
            props.navigation.navigate('CobDetail')
        }).catch(e=>{
            alert(e.response.data)
        })
    }
    
    const limpar = ()=>{
        setInicio('')
        setFim('')
    }


    const checarUsuarioListaDeCobranca = ()=>{
        axios.get(`${url}/client/userlistcob`).then(res=>{
            setUsuariosCobs(res.data)
        }).catch(e=>{
            alert(e.response.data)
        })
    }


    const testar = ()=>{
        const subscription = Notifications.addNotificationResponseReceivedListener(res=>{
            props.navigation.navigate('Carrinho')
        })
    }


    if(usuariosCobs.length > 0){
        if(usuariosCobs.length + 1){
            requests.scheduleNotification('Nova cobrança', 'Um dos clientes acabou de comprar um produto', testar)
        }
    }


//========================BUSCA==============================
    const found = cobs && cobs.filter(cob=>{
        const date = (convertDate(cob.loc.criacao))
        const time = (convertHour(cob.loc.criacao))
        return time.includes(searchTime) || date.includes(searchTime)
    })

//======================================================================

    

    return(
        <View style={styles.container}>
            <View style={styles.periodStyle}>
                <Text style={{fontSize:18}}>Inicio:</Text>
                <Text style={{fontSize:18}}>Fim:</Text>
            </View>
            <View style={styles.initStyle}>
                <TextInputMask type={'datetime'} options={{format:'DD/MM/YYYY'}}
                    style={styles.input} keyboardType='numeric'
                    placeholder='DD/MM/AAAA' onChangeText={setInicio} value={inicio}/>
                <TextInputMask type={'datetime'} options={{format:'DD/MM/YYYY'}}
                    style={styles.input} keyboardType='numeric'
                    placeholder='DD/MM/AAAA' onChangeText={setFim} value={fim}/>
            </View>            
            <View style={styles.btnContainer}>
                <Button title='Gerar lista' onPress={consultarListaDeCobranca}/>                
                <Button title='limpar' onPress={limpar}/>
            </View>
            {/* <Text style={{textAlign:'center', fontWeight:'bold', fontSize:18}}>
                Total: R$ {total}
            </Text> */}
            <Searchbar style={{
                        marginVertical:20,
                        marginHorizontal:10,
                        backgroundColor:'lightgray',
                    }}
                placeholder='Data ou hora da cobrança'
                onChangeText={setSearchTime}
                value={searchTime}/>            
            <FlatList
                data={found}
                keyExtractor={cob => cob.txid}
                renderItem={({item: cob})=>(
                    <TouchableOpacity style={styles.card} onPress={()=> consultarCobranca(cob.txid)}>
                        <Text style={styles.listFontStyle}>
                            Valor: R$ {cob.valor.original}
                        </Text>
                        <Text style={styles.listFontStyle}>
                            Cobrança efetuada em: {convertDate(cob.loc.criacao)}{' '}
                            às {convertHour(cob.loc.criacao)}
                        </Text>
                    </TouchableOpacity>
                )}/>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    periodStyle: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    inputContainer: {
        width: '90%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        margin: 20
    },
    initStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    input: {
        height: 40,
        margin: 10,
        textAlign:'center',
        borderBottomWidth: 1,
        width: '30%'
    },
    btnContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 20,
        marginBottom: 30
    },
    card: {
        margin: 10,
        backgroundColor: 'lightgray',
        padding: 5,
        borderRadius: 5
    },
    listFontStyle: {
        fontSize: 16,
        fontWeight: 'bold'
    }
})