
//============================================================== IMPORTS ==============================================================
import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, Image, Button, Alert} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'react-native-fetch-blob';


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
				this.updateProfilePhoto(this.props.route.params.photo).then();
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
        let item = this.props.route.params;
        console.log("ATTEMPTING TO RETRIEVE ID");
        try
        {
            
            console.log("DEBUG: " + JSON.stringify(item.user.user_id));
            this.setState(ID = JSON.stringify(item.user.user_id));
        }
        catch(e){
            console.log("ERROR: "+ e)
        }
		
		//this.setState({ID: await this.currentId()});
		let ID = item.user.user_id;

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
            console.log("!!! Response: " + JSON.stringify(responseJson))
			console.log((responseJson)['recent_chits']);
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
		
		async follow(){
			let token = await this.currentToken();
			let item = this.props.route.params;
      console.log("ATTEMPTING TO RETRIEVE ID");
      try
        {
            
            console.log("DEBUG: " + JSON.stringify(item.user.user_id));
            this.setState(ID = JSON.stringify(item.user.user_id));
        }
        catch(e){
            console.log("ERROR: "+ e)
        }
		
			//this.setState({ID: await this.currentId()});
			let ID = item.user.user_id;
			
			console.log("RETURNED TOKEN: " + token)

			console.log("Attempting to Follow... " + ID);

			let url = "http://10.0.2.2:3333/api/v0.0.5/user/" + ID + "/follow";

			return fetch(url,
			{
				method:'POST',
				headers:
				{
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'X-Authorization': token
				},
			})
		.then((response) =>
		{
			if(response.status == 400){
				Alert.alert("It appears you already follow this profile.")
			}
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
			console.log("Follow Response: " + JSON.stringify(responseJson));
			
	
		})
		.catch((e) =>
		{
			console.log("DEBUG DUMP")
			console.log("	Follow Exception: " + e)
			console.log("	URL: " + url)
			console.log("	Token: " + token)
		});

		}
		//UNFOLLOW
		async unfollow(){
			let token = await this.currentToken();
			let item = this.props.route.params;
      console.log("ATTEMPTING TO RETRIEVE ID");
      try
        {
            
            console.log("DEBUG: " + JSON.stringify(item.user.user_id));
            this.setState(ID = JSON.stringify(item.user.user_id));
        }
        catch(e){
            console.log("ERROR: "+ e)
        }
		
			let ID = item.user.user_id;
			
			console.log("RETURNED TOKEN: " + token)

			console.log("Attempting to Follow... " + ID);

			let url = "http://10.0.2.2:3333/api/v0.0.5/user/" + ID + "/follow";

			return fetch(url,
			{
				method:'DELETE',
				headers:
				{
					Accept: 'application/json',
					'Content-Type': 'application/json',
					'X-Authorization': token
				},
			})
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
				console.log("Follow Response: " + JSON.stringify(responseJson));
				
		
			})
			.catch((e) =>
			{
				console.log("DEBUG DUMP")
				console.log("	Follow Exception: " + e)
				console.log("	URL: " + url)
				console.log("	Token: " + token)
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
					  color ="yellowgreen"
						onPress={()=>this.follow()}
														
				/>
				<Button
					  style={styles.buttonButton}
            title={'UNFOLLOW'}
					  color ="darkred"
						onPress={()=>this.unfollow()}
														
				/>
				<View>
					<View>
						<Text style={styles.subtitle}>{this.state.forename +" "+ this.state.surname}</Text>
						<Text  style={{padding:0, fontSize:20}}>Email: {this.state.email}</Text>
					</View>
					<View style={styles.buttonContainer}>
						
					
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
            padding:50,
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
            height:200,
        },
    
        userImage:{
            width:60,
            height:60,
           
        },
        userName:{
            fontSize:25,
            color:'#fe9801',
            position:'absolute',
            left:60,
            top:0
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
  Version-0.0.3
  */
