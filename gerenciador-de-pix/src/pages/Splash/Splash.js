import { useEffect } from 'react'
import LottieView from 'lottie-react-native'
import { View } from 'react-native'


export default function Splash(props){

    useEffect(()=>{
        setTimeout(() => {
            props.navigation.navigate('Login')
        }, 3000);
    }, [])

    return(
        <View style={{flex:1}}>
            <LottieView
                autoPlay
                speed={1}
                source={require('../../../assets/72816-icon-1-mobile.json')}/>
        </View>
    )
}