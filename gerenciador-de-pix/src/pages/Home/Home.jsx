import { useEffect, useState, useContext } from 'react'
import Context from '../../global/Context'
import axios from 'axios'
import { url } from '../../constants/url'
import { View, Text, StyleSheet } from 'react-native'




export default function Home(props){
    const [saldo, setSaldo] = useState('')
    

    
    useEffect(()=>{
        axios.get(`${url}/balance`).then(res=>{
            setSaldo(res.data.saldo)
        }).catch(e=>{
            alert(e.response.data)
        })
    }, [])
    


    return(
        <View style={styles.container}>
            <Text style={{marginVertical:'25%', fontSize:16}}>
                Seu saldo: R$ {saldo}
            </Text>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center'
    }
})