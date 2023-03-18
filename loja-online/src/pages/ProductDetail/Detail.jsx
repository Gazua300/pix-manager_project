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


    return(
        <View>
            <View style={styles.card}>
                <Text style={{textAlign:'center', fontSize:16}}>
                    Valor da cobrança: R$ {cob.valor}{'\n'}
                </Text>
                <Text style={{marginLeft:5}}>
                    Data da cobrança: {convertDate(cob.criacao)}{'\n'}
                    Horário: {convertHour(cob.criacao)}{'\n'}
                    Status: {states.status}
                </Text>
            </View>
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