
//============================================================== IMPORTS ==============================================================

import React, { Component } from 'react';
import {
	View,
	TextInput,
	Button,
	StyleSheet,
	Alert,
	PermissionsAndroid,
	Image, Text,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
import {Colors} from 'react-native/Libraries/NewAppScreen';

//============================================================== PAGE CLASS & PAGE FUNCTIONS ==============================================================

class updateFeed extends Component
{
	constructor(props)
	{
		super(props);

		this.state=
		{
			chit: null,
			chit_content: ' ',
			locationPermission: false,
			location: null,
			imageExists: false,
			chitCount: 0,
			photo: "",
			sections: null,
			chits: [],
		};
	}

	componentDidMount()
	{
        
		this.reloadChit = this.props.navigation.addListener('focus', () =>
		{
			if(this.props.route.params?.photo != null)
			{
				
                const photo = this.props.route.params.photo;
                
				this.setState({photo: photo});
				this.setState({imageExists: true});
			}
		
			this.findLocation().then();
		});
	}

	componentWillUnmount()
	{
		this.reloadChit();
		this.setState({imageExists: false});
    }
    
    findLocation = async () =>
	{
		if(!this.state.locationPermission)
		{
			this.state.locationPermission = await requestLocationPermission();
		}

		async function requestLocationPermission()
		{
			try {
				const granted = await PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
					{
						title: 'Location Permission',
						message: 'This app requires access to your location.',
						buttonNeutral: 'Later',
						buttonNegative: 'Decline',
						buttonPositive: 'Accept',
					},
				);

				if (granted === PermissionsAndroid.RESULTS.GRANTED) {			
				} else {
					return false;
				}
			} catch (error) {
			}
		}

		await Geolocation.getCurrentPosition((position) =>
		{
			this.state.location = position;
		},
		(error) =>
		{
			Alert.alert("Could not find location: " + error.message);
		},
        {
			enableHighAccuracy: true,
			timeout: 20000,
			maximumAge: 1000
		});
    };


	async postChit()
	{
        const chit_content = this.state.chit_content;
        const location = this.state.location;
        const token = await this.currentToken();
		
		let longitude;
		let latitude;
		const timeStamp = Date.now();

		if(!chit_content.length)
		{
			Alert.alert("Please Enter A Chit");
			return;
		}

		if(this.state.locationPermission === true)
		{
			
			longitude = location.coords.longitude;
			latitude = location.coords.latitude;
		}
		else
		{
			longitude = 0;
			latitude = 0;
			
		}


		const chitData =
		{
            "chit_id": 0,
			"timestamp": timeStamp,
			"chit_content": chit_content,
			"location":
			{
				"longitude": longitude,
				"latitude": latitude
            }
            //NEEDS USER DATA 
		};

		const chitDataJson = JSON.stringify(chitData);

		console.log("CHIT DATA " + JSON.stringify(chitData));

		return fetch("http://10.0.2.2:3333/api/v0.0.5/chits",
		{
			method:'POST',
			headers:
			{
				Accept: 'application/json',
				'Content-Type': 'application/json',
				'X-Authorization': token
			},
			body:chitDataJson
		})
		.then((response) =>
		{
			if(response.status !== 201)
			{
				throw "!!! Response was: " + response.status;
			}
			return response.json();
		})
		.then((response) =>
		{

			if(this.state.imageExists == true)
			{
				this.setState({chit_id : response.chit_id});
                this.postPhoto().then();
			}
			else
			{
                this.props.navigation.navigate('mainFeed');
			}

		})
		.catch((e) =>
		{
            this.state.error = e;
            console.log(e);
			
		});
	}

	async postPhoto()
	{
        const id = this.state.chit_id;
        let photo = this.state.photo;
		const url = "http://10.0.2.2:3333/api/v0.0.5/chits/" + id + "/photo";
		const token = await this.currentToken();
		
		
		return fetch(url,
		{
				method:'POST',
				headers:
					{
						Accept: "application/json",
						'X-Authorization': token,
					},
				body:photo
			})
			.then((response) =>
			{
				if(response.status !== 201)
				{
					throw "Response was: " + response.status;
				}
			})
			.then(() =>
			{
				this.props.navigation.navigate('mainFeed');
			})
			.catch((error) =>
			{
				this.state.error = error;
			});
	}

    
    async currentToken()
	{
        //gets the current token from asyncstorage
        console.log("!!! TOKEN PACKAGE "+ AsyncStorage.getItem('token'));

		try
		{
            const token = await AsyncStorage.getItem('token');
            //token is false
            
            if(token == null){
                Alert.alert("Session not valid, please log in");
                this.props.navigation.navigate('Home');}
            return token;
            
		}
		catch (e)
		{
			this.props.navigation.navigate('Home');
		}
	}


//============================================================== PAGE RENDER ==============================================================
    render(){
		return(
		<View>
			
            <Text style={styles.title}>Post An Update!</Text>
            
			<TextInput
                style={styles.textInput}
                placeholder={"What are you thinking about?"}
				onChangeText={chit_content => this.setState({chit_content:chit_content})}
				multiline
				numberOfLines={2}
				value = {this.state.chit_content}
				
			/>

            <Image
				style={styles.photo}
				source={{uri:this.state.photo.uri}}
			/>
			
            <View style={{paddingTop:20,margin:50}}>
                <Button
                    title='Post'
                    color="darkgreen"
                    onPress={() => 
                    {
						if(this.state.chit_content === null || this.state.chit_content.match(/^\s*$/) !== null)
						{
							Alert.alert("Please enter a chit");
						}
						else
						{
                            this.postChit().then();
                        }
                    }
                }
            />
            <View style={styles.buttonContainer}>
			
            <Button
                title='Take Picture'
                color="yellowgreen"
            onPress={() => {
                this.props.navigation.navigate("cameraTest");
            }}
        />
            
      </View>
				
			</View>
		</View>
	);}

}
export default updateFeed;

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
