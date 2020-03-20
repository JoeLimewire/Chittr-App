
//============================================================== IMPORTS ==============================================================
import React, { Component } from 'react';
import {Text, View, TextInput, Button, StyleSheet,StatusBar} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-community/async-storage';

//============================================================== PAGE CLASS & PAGE FUNCTIONS ==============================================================

class HomeScreen extends Component
{
	constructor(props)
	{
		super(props);

		this.state={
			email: '',
			password: '',
		}
	}

	componentDidMount()
	{
		this.currentID().then((response) =>
		{
			if(response !== 'null')
			{
				this.props.navigation.navigate('mainFeed');
			}
		})
	}


	submitLogin()
	{
    //PRESSING THE LOGIN BUTTON
		let jsonData = JSON.stringify({
				email:this.state.email,
				password:this.state.password
			});
    
    //Post request to API
		return fetch("http://10.0.2.2:3333/api/v0.0.5/login/",
		{
			method:'POST',
			headers:
			{
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: jsonData
		})
		.then((response) =>
		{
			if(response.status == 200)
			{
        return response.json();	
      }
      else{
        throw "Response was: " + response.status;
      }
		})
		.then((responseJson) =>
		{
			console.log("!!! Response" + responseJson);
			let reqId = (responseJson)['id'];
			let reqToken = (responseJson)['token'];

			console.log("ID: " + reqId + " " + " Token: " + reqToken);

			this.setState({id:reqId});
      this.setState({token:reqToken});
      
      this.props.navigation.navigate('mainFeed');

		})
		.catch((e) =>
		{
			this.setState
		({
			loginData: e
		});
			console.log(e);
		});
	}

	async currentID()
	{
		try
		{
      //We have found the user ID
			const id = await AsyncStorage.getItem('id');
      return id + "" ;
		}
		catch (e)
		{
       //We have not found the user ID
			console.log("Exception of USER ID: " + e);
			this.props.navigation.navigate('Logout');
		}
  }

  //============================================================== PAGE RENDER ==============================================================

	render(){
		return(
      
			<View >
        <StatusBar barStyle = "dark-content"
        backgroundColor = "yellowgreen" />

        <Text style={styles.title}> Chittr </Text>

			<TextInput
				style={styles.textInput}
				onChangeText={email_data => this.setState({email:email_data})}
				placeholder={"Email"}
			/>
      
			<TextInput
        style={styles.textInput}
        secureTextEntry={true}
				onChangeText={password_data => this.setState({password:password_data})}
				placeholder={"Password"}
			/>

      <View style={{padding:20}}>

			<Button
        title='Login'
        color="yellowgreen"
				onPress={() => this.submitLogin()}
			/>
      <View style={{paddingTop:20,margin:50}}>
      <Button
        title='Sign up'
        color="darkgreen"
				onPress={() => this.props.navigation.navigate('SignUp')}
			/>

      </View>
      </View>
			</View>
		);
	}
  
}

//Exporting Page for navigation
export default HomeScreen;

//============================================================== INTERNAL STYLE SHEET ==============================================================

const styles = StyleSheet.create(
	{
		title: {
      textAlign: "center",
      color:"#fe9801",
      fontSize:100,
      paddingTop:30,
  },
  textInput: {
      backgroundColor:"#f4eec7",
      borderRadius:10,
      padding:10,
      margin:15,
  },
	});

  /*
  Joseph Higgins
  Chittr
  Version-0.0.3
  */