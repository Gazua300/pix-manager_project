import { useContext, useState } from 'react'
import Context from '../../global/Context'
import axios from 'axios'
import { url } from '../../constants/url'
import { convertDate } from '../../utils/ConvertDate'
import { convertHour } from '../../utils/ConvertDate'
import { View, Text, Button, StyleSheet, TextInput } from 'react-native'


export default function Detail(props){
    const { states } = useContext(Context)
    const cob = states.cob
    const [mode, setMode] = useState(false)
    const [valor, setValor] = useState('')
    const [titulo, setTitulo] = useState('Alterar valor')


    const mostrarInput = ()=>{
        mode ? setMode(false) : setMode(true)
        titulo === 'Alterar valor' ? setTitulo('Ocultar') : setTitulo('Alterar valor')
    }


    const alterarValor = (id)=>{
        body = {
            valor,
            txid: id
        }
        axios.patch(`${url}/editcob`, body).then(res=>{
            alert(res.data)
        }).catch(e=>{
            console.log(e.response.data)
        })
    }


    return(
        <View>
            <View style={styles.card}>
                <Text style={{textAlign:'center', fontSize:16}}>
                    Valor da cobrança: R$ {cob.valor.original}{'\n'}
                </Text>
                <Text style={{marginLeft:5}}>
                    Data da cobrança: {convertDate(cob.loc.criacao)}{'\n'}
                    Horário: {convertHour(cob.loc.criacao)}{'\n'}
                    Status: {cob.status}
                </Text>
                <View style={{margin:10}}>
                    <Button title={titulo}
                        onPress={mostrarInput}/>
                </View>
            </View>
            {mode ? (
                <View style={styles.updateCob}>
                    <TextInput style={styles.input} placeholder='R$ 00.00'
                        onChangeText={setValor} value={valor} keyboardType='numeric'/>
                    <Button title='Alterar' onPress={()=> alterarValor(cob.txid)} />
                </View>
            ) : null}
        </View>
    )
}


const styles = StyleSheet.create({
    card: {
        width: '80%',
        backgroundColor: 'lightgray',
        margin: '10%',
        padding: 7,
        borderRadius: 5
    },
    input: {
        height: 40,
        margin: 10,
        borderBottomWidth: 1,
        width: '30%'
    },
    updateCob: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    }
})