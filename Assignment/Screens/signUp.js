//============================================================== IMPORTS ==============================================================
import React, { Component } from 'react';
import { Text, View, TextInput, Button, StyleSheet, Alert} from 'react-native';

//============================================================== PAGE CLASS & PAGE FUNCTIONS ==============================================================

class signUp extends Component
{
	constructor(props)
	{
		super(props);
		this.state={
			given_name: '',
			family_name: '',
			email: '',
			password: '',
			error: ''}

	}
	
	// Main method of page
	signPress()
	{
		
		//Gets the info from Text Input
		let jsonData = JSON.stringify({
				given_name:this.state.given_name,
				family_name:this.state.family_name,
				email:this.state.email,
				password:this.state.password
			});


		//Start of API request
		return fetch("http://10.0.2.2:3333/api/v0.0.5/user/",
		{
			method:'POST',
			headers:
			{
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: jsonData
		})
		.then((response) => {
			if(response.status != 201)
			{
				//Response Not Okay
				Alert.alert("Sorry, some of the details seem to be wrong. Please try again.");
				this.setState({registration:'Failed to create account'});
			}
			else
			{
				//Response OK
				Alert.alert("Welcome to Chittr, " + this.state.given_name + "!");
				this.props.navigation.navigate('mainFeed');
			}

		})
		 .catch((e) =>
		 {
			this.state.error = e;
			console.log(e);
		 });
	}


//============================================================== PAGE RENDER ==============================================================

	render(){
		return(
			<View >
			<Text style={styles.title}>Sign Up</Text>
			<TextInput
				style={styles.textInput}
				onChangeText={forename => this.setState({given_name:forename})}
				placeholder={"First Name"}
			/>
			<TextInput
				style={styles.textInput}
				onChangeText={surname => this.setState({family_name:surname})}
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
        title='Login'
        color="yellowgreen"
				onPress={() => this.signPress()}
			/>
      <View style={{paddingTop:20,margin:50}}>
      <Button
        title='Back'
        color="darkgreen"
				onPress={() => this.props.navigation.navigate('Home')}
			/>
      </View>
      </View>
			
			
			</View>
		);
	}

}

export default signUp;
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
