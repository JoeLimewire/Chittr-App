
//============================================================== IMPORTS ==============================================================
import React, { Component } from 'react';
import { View, TextInput, Button, StyleSheet, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

//============================================================== PAGE CLASS & PAGE FUNCTIONS ==============================================================

class profileUpdateDetails extends Component
{
	constructor(props)
	{
		super(props);

		this.state={
			given: '',
			family: '',
			email: '',
			password: ''}
	}


	async updatePress()
	{

		let jsonData = JSON.stringify({
				given:this.state.given,
				family:this.state.family,
				email:this.state.email,
				password:this.state.password
			});

		let id = await this.currentId();
		let token = await this.currentToken();

		let url = "http://10.0.2.2:3333/api/v0.0.5/user/" + id;

		return fetch(url,
		{
			method:'PATCH',
			headers:
			{
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'X-Authorization': token
			},
			body: jsonData
		})
		.then((response) =>
		{
			if(response.status === 201)
			{
				this.props.navigation.navigate('myProfile');
			}
			else
			{
                console.log("!!! - Can't update profile " + response)
			}
		})
		 .catch((e) =>
		 {
			console.log(e);
			
		 });
	}

	async currentId()
	{
		try
		{
			const id = await AsyncStorage.getItem('id');
			return id;
		}
		catch (e)
		{
			console.log("ID: " + e);
			this.props.navigation.navigate('Home');
		}
	}
	async currentToken()
	{
		try
		{
			const token = await AsyncStorage.getItem('token');
			return token;
		}
		catch (e)
		{
			console.log("TOKEN: " + e);
			this.props.navigation.navigate('Home');
		}
    }
    //============================================================== PAGE RENDER ==============================================================

    
    render(){
		return(
            <View >
			
			<TextInput
				style={styles.textInput}
				onChangeText={forename => this.setState({given:forename})}
				placeholder={"First Name"}
			/>
			<TextInput
				style={styles.textInput}
				onChangeText={surname => this.setState({family:surname})}
				placeholder={"Last Name"}
			/>
			<TextInput
				style={styles.textInput}
				onChangeText={email => this.setState({email:email})}
				placeholder={"Email"}
			/>
			<TextInput
				style={styles.textInput}
				onChangeText={password => this.setState({password:password})}
				placeholder={"Password"}
			/>
      <View style={{padding:20}}>
      <Button
        title='Update'
        color="yellowgreen"
				onPress={() => this.updatePress()}
			/>
      <View style={{paddingTop:20,margin:50}}>
      <Button
        title='Back'
        color="darkgreen"
				onPress={() => this.props.navigation.navigate('myProfile')}
			/>
      </View>
      </View>
			
			
			</View>
		);
	}

}

export default profileUpdateDetails;

//============================================================== INTERNAL STYLE SHEET ==============================================================
const styles = StyleSheet.create(
	{
		
		buttonContainer:
		{
			display: 'flex',
			alignItems: 'center',
		},
		
		photo:
		{
			marginLeft: 'auto',
			marginRight: 'auto',
			height: 100,
			width: 100,
			resizeMode: 'contain',
			marginTop: 10,
			marginBottom: 10,
        },
		
        title: {
            textAlign: "center",
            color:"#fe9801",
            fontSize:30,
            padding:50,
        },
        textInput: {
            backgroundColor:"#f4eec7",
            borderRadius:10,
            padding:10,
            margin:10,
        },
        
    });
    /*
  Joseph Higgins
  Chittr
  Version-0.0.3
  */
