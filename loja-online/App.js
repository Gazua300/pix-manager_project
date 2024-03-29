import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { Provider } from "./src/global/Context"
import Signup from './src/pages/Signup/Signup'
import Login from './src/pages/Login/Login'
import Home from './src/pages/Home/Home'
import Products from "./src/pages/Products/Products"
import Cart from "./src/pages/Cart/Cart"
import Charges from "./src/pages/Charges/Charges"
// import Detail from "./src/pages/ProductDetail/Detail"
import PixSent from "./src/pages/PixSent/PixSent"
import PixRcvd from "./src/pages/PixRcvd/PixRcvd"
import CustomDrawer from "./src/components/CustomDrawer"
import { StatusBar, View } from "react-native"


const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator()



function MyDrawer(){
  return(
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={props => <CustomDrawer {...props}/>}
      screenOptions={{
        drawerStyle: {
          width: '70%'
        }
      }}
      >      

      <Drawer.Screen
        name="Home"
        component={Home}/>

      <Drawer.Screen
        name="Produtos"
        component={Products}/>
      
      <Drawer.Screen
        name="Carrinho"
        component={Cart}/>

      <Drawer.Screen
        name="Charges"
        component={Charges}
        options={{
          title: 'Lista de cobranças'
        }}/>
      
      <Drawer.Screen
        name="PixSent"
        component={PixSent}
        options={{
          title: 'Pix enviados'
        }}/>
      
      <Drawer.Screen
        name="PixRcvd"
        component={PixRcvd}
        options={{
          title: 'Pix recebidos'
        }}
        />
            
    </Drawer.Navigator>
  )
}


export default function App() {
  return (
    <Provider>
      <NavigationContainer>
        <StatusBar backgroundColor='lightgray' barStyle='dark-content'/>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerTitleAlign:'center' }}>
          
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerLeft: ()=>(
              <View/>
            )
          }}/>            
          
        <Stack.Screen
          name="Signup"
          component={Signup}
          options={{ title: 'Cadastrar usuário' }}/>
        
          <Stack.Screen
            name="MyDrawer"
            component={MyDrawer}
            options={{
              headerShown: false
            }}/>

          {/* <Stack.Screen
            name="Detail"
            component={Detail}
            options={{
              title: 'Detalhes da cobrança'
            }}/> */}
        
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}


