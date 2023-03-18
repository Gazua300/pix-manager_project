import { useEffect, useState, useContext } from 'react'
import Context from '../../global/Context'
import axios from 'axios'
import { url } from '../../constants/url'
import { convertDate } from '../../utils/ConvertDate'
import { convertHour } from '../../utils/ConvertDate'
import { TextInputMask } from 'react-native-masked-text'
import {
    View,
    Text,
    StyleSheet,
    Button,
    FlatList,
    TouchableOpacity
} from 'react-native'


export default function PixSent(props){
    const { states, setters } = useContext(Context)
    const [inicio, setInicio] = useState('')
    const [fim, setFim] = useState('')
    const [pix, setPix] = useState([])
    const [total, setTotal] = useState('')



    
    const consultarPixEnviados = ()=>{
        const body = {
            inicio,
            fim
        }
        axios.post(`${url}/pixsent`, body).then(res=>{
            console.log(res.data.pix)
        }).catch(e=>{
            console.log(e.response.data)
        })

        valorTotal()
    }


    const valorTotal = ()=>{
        if(pix.length > 0){
            const valores = pix.map(cob=>{
                return Number(cob.valor.original)
            })
        
            const resultado = valores.reduce((accumulator, value)=>{
                return accumulator + value
            })
                        
            setTotal(resultado)
        }
    }


    const limpar = ()=>{
        setFim('')
        setInicio('')
    }

    

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
                <Button title='Gerar lista' onPress={consultarPixEnviados}/>
                <Button title='limpar' onPress={limpar}/>
            </View>
            <Text style={{textAlign:'center', fontWeight:'bold', fontSize:18}}>
                Total: R$ {total}
            </Text>
            <FlatList
                data={pix}
                keyExtractor={pix => pix.txid}
                renderItem={({item: pix})=>(
                    <TouchableOpacity style={styles.card}>
                        <Text style={styles.listFontStyle}>
                            Valor: R$ {pix.valor.original}
                        </Text>
                        <Text style={styles.listFontStyle}>
                            Cobrança efetuada em: {convertDate(pix.loc.criacao)}{' '}
                            às {convertHour(pix.loc.criacao)}
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