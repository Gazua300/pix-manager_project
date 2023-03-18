import { useEffect, useState, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Context from '../../global/Context'
import axios from 'axios'
import { url } from '../../constants/url'
import { convertDate } from '../../utils/ConvertDate'
import { convertHour } from '../../utils/ConvertDate'
import { Searchbar } from 'react-native-paper'
import {
    View,
    Text,
    StyleSheet,
    Button,
    FlatList,
} from 'react-native'


export default function Charges(props){
    const [searchTime, setSearchTime] = useState('')
    const [cobs, setCobs] = useState([])

    
    useEffect(()=>{
        consultarListaDeCobranca()
    }, [])


    const consultarListaDeCobranca = async()=>{
        const body = {
            userId: await AsyncStorage.getItem('id')
        }
        axios.post(`${url}/listcob`, body).then(res=>{
            setCobs(res.data)            
        }).catch(e=>{
            alert(e.response.data)
            if(cobs.length > 0){
                setCobs([])
                setTotal('')
            }
        })
        
    }


//========================BUSCA==============================
    const found = cobs && cobs.filter(cob=>{
        const date = (convertDate(cob.criacao))
        const time = (convertHour(cob.criacao))
        
        return time.includes(searchTime) || date.includes(searchTime)
    })

//======================================================================

    

    return(
        <View style={styles.container}>          
            <View style={styles.btnContainer}>
                <Button title='Atualizr lista' onPress={consultarListaDeCobranca}/>    
            </View>
            <Searchbar style={{marginVertical:20, marginHorizontal:10, backgroundColor:'lightgray'}}
                placeholder='Data ou hora da cobrança'
                onChangeText={setSearchTime}
                value={searchTime}/>            
            <FlatList
                data={found}
                keyExtractor={cob => cob.txid}
                renderItem={({item: cob})=>(
                    <View style={styles.card}>
                        <Text style={styles.listFontStyle}>
                            Valor: R$ {cob.valor}
                        </Text>
                        <Text style={styles.listFontStyle}>
                            {cob.criacao}
                        </Text>
                        <Text style={styles.listFontStyle}>
                            Status: {cob.status}
                        </Text>
                    </View>
                )}/>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    btnContainer: {
        alignItems: 'center',
        marginTop: '10%',
        marginBottom: 30
    },
    card: {
        margin: 10,
        backgroundColor: 'lightgray',
        padding: 10,
        borderRadius: 5
    },
    listFontStyle: {
        fontSize: 16,
        fontWeight: 'bold'
    }
})