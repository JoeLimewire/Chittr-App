
//============================================================== IMPORTS ==============================================================
import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, Image, Button} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'react-native-fetch-blob';
import {Colors} from 'react-native/Libraries/NewAppScreen';


//============================================================== PAGE CLASS & PAGE FUNCTIONS ==============================================================

class myProfile extends Component
{
	constructor(props)
	{
		super(props);

		this.state={
			givenName: '',
			familyName: '',
			email: '',
			password: '',
			chits: [],
			userId: -1,
			photo: null,
			token: null,
			sections: '',
			};
	}

	componentDidMount()
	{
        //reloads if it has been updated
		this.accountReload = this.props.navigation.addListener('focus', () =>
		{
			if(this.props.route.params?.photo)
			{
				this.updatePhoto(this.props.route.params.photo).then();
            }
          
			this.getUserDetails().then();
		});
	}

	componentWillUnmount()
	{
		this.accountReload();
	}

	async getUserDetails()
	{
		console.log("Retrieving user details... ")
		this.setState({ID: await this.currentId()});
		let ID = this.state.ID;

		let url = "http://10.0.2.2:3333/api/v0.0.5/user/" + ID;
		return fetch(url)
		.then((response) =>
		{
			if(response.status !== 200)
			{
				throw("!!! Response code: " + response.status + " " + ID);
			}
			else
			{
				return response.json();
			}
		})
		.then((responseJson) =>
		{
			let forename = (responseJson)['given_name'];
			let surname = (responseJson)['family_name'];
			let email = (responseJson)['email'];
			
			let content = (responseJson)['recent_chits'];

            this.setState({
                ID:ID,
                forename:forename,
                surname:surname,
                email:email,
                chits:content,
            });

            
			this.currentPhoto(ID);
		})
		.catch((e) =>
		{
			console.log("Details Exception: " + e);
		});
	}

	async currentPhoto(id)
	{
		
		let url = "http://10.0.2.2:3333/api/v0.0.5/user/" + id + "/photo";


		RNFetchBlob.fetch('GET',url)
		.then((response) =>
		{
			let image = response.base64();
			this.setState({photo : "data:image/png;base64," + image});
			console.log("Got photo...");
		})
		.catch((e) =>
		{
			console.log("Error on getting photo: " + e);
		});
	}

	async updatePhoto(photo)
	{
		

		let token = await this.currentToken();
		let url = "http://10.0.2.2:3333/api/v0.0.5/user/photo";

		fetch(url,
	{
			method: 'POST',
			headers:
			{
				'X-Authorization': token,
				'Content-Type': 'application/octet-stream',
			},
			body: photo,
		})
		.catch((e) =>
		{
			console.log(e)
		});
	}
	

    async currentId()
	{
		try
		{
            const id = await AsyncStorage.getItem('id');
            
			return  id;
		}
		catch (e)
		{
			this.props.navigation.navigate('Home');
		}
	}


	async currentToken()
	{
        
		try
		{

			const token = await AsyncStorage.getItem('token');
			console.log("DEBUG: token found: " + token);
			return token;
		}
		catch (e)
		{
			console.log("DEBUG: Failed to get id: " + e);
			this.props.navigation.navigate('Logout');
		}
	}
	
	logout(){

		console.log(" Attempting to Logout... ")
		return fetch("http://10.0.2.2:3333/api/v0.0.5/logout/",
		{
			method:'POST',
			headers:
				{
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'token': this.currentToken(),
				},
		})
		.then((response) =>
		{
			if(response.status == 200)
			{
				this.props.navigation.navigate('HomeScreen');
				return response.json();	
      		}
      		else{
        		throw "Response was: " + response.status;
      		}
		})
		.catch((response) => {
			console.log("DEBUG: " + response);
			return false;
		});
	}
    

//============================================================== PAGE RENDER ==============================================================

    render(){
		return(
			<View style={styles.container}>
				<Image
					style={styles.profilePhoto}
					source={{uri:this.state.photo}}
				/>
				<Button
					style={styles.buttonButton}
                    title={'FOLLOW'}
                    color ="grey"				
				/>
				<View>
					<View>
					<Text style={styles.subtitle}>{this.state.forename + " " + this.state.surname}</Text>
						<Text  style={{padding:0, fontSize:20}}>Email: {this.state.email}</Text>
					</View>
					<View style={styles.buttonContainer}>
						<Button title={'Update Profile'} color ="yellowgreen"onPress={() => this.props.navigation.navigate('profileUpdateDetails')}/>
                        
                        <Button
					style={styles.changePhotoButton}
                    title={'Change Profile Photo'}
                    color ="darkgreen"
					onPress={() => this.props.navigation.navigate('cameraTest',true)}
				/>
				<Button
					style={styles.buttonButton}
                    title={'LOGOUT'}
                    color ="darkred"
					onPress={() => this.logout()}
				/>
					
                    </View>
				</View>
				<View>
				<ScrollView>
                        { this.state.chits.map((item) => {
                            return(
                                <View style = {styles.chit}>
                                    <Image
                                    style={styles.userImage}
                                    source={{uri: 'https://img.icons8.com/office/64/000000/earth-element.png'}}
                                    />
                                        
                                        <Text style={styles.userName}>{this.state.forename + " " + this.state.surname}</Text>

                                    <Text style={styles.userContent}>{item.chit_content}</Text>
                                </View>
                            )
                           })}
					
				</ScrollView>
                </View>
			</View>
		);
	}
}
export default myProfile;

//============================================================== INTERNAL STYLE SHEET ==============================================================
const styles = StyleSheet.create(
	{
		
		buttonContainer:
		{
            display: 'flex',
            flexDirection:'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            marginTop:30,
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
		profilePhoto:{
            marginLeft: 'auto',
			marginRight: 'auto',
			height: 100,
			width: 100,
			resizeMode: 'contain',
			marginTop: 10,
            marginBottom: 10,
            borderColor:"black",
            borderWidth:1,
        },
        title: {
            textAlign: "center",
            color:"#fe9801",
            fontSize:30,
            padding:20,
        },
        textInput: {
            backgroundColor:"#f4eec7",
            borderRadius:10,
            padding:10,
            margin:10,
        },
        subtitle:{
            padding:10,
            fontSize:28
        },
        chit:{
            marginTop:2,
            padding:15,
            paddingTop:30,
            backgroundColor:'#f4eec7',
            flexDirection:'column',
            
        },
    
        userImage:{
            width:60,
            height:60,
           
        },
        userName:{
            fontSize:25,
            color:'#fe9801',
            position:'absolute',
            left:100,
            top:10
        },
        userLocation:{
            alignSelf:'flex-end',
            color:'grey'
        },
        userContent:{
            alignSelf:'stretch',
            fontSize:18,
            paddingTop:30
    
        },

        
    });

         /*
  Joseph Higgins
  Chittr
  Version-0.0.6
  */
