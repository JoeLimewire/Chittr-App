
//============================================================== IMPORTS ==============================================================

import React, { Component } from 'react';
import {Text, View, StyleSheet, ScrollView, TouchableOpacity, RefreshControl,  Image, Alert,} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-community/async-storage';

//============================================================== PAGE CLASS & PAGE FUNCTIONS ==============================================================

class mainFeed extends Component
{
	constructor(props)
	{
		super(props);

		this.state=
		{
			start: 0,
			count: 20,
            chits: [],
            refresh:false,
		};
    }

    async currentID()
	{
		try
		{
            //Get Item from the AsyncStorage Register
			const id = await AsyncStorage.getItem('id');
			return "" + id;
		}
		catch (e)
		{
            Alert.alert("Error Occured: Exception " + e);
			this.props.navigation.navigate('LoginPage');
		}
    }

	componentDidMount()
	{
	    this.getScrollChunk(); 
    }
    
    async getScrollChunk()
	{
		//Get An ID
        this.currentID();
        
		return fetch("http://10.0.2.2:3333/api/v0.0.5/chits?start=" +
			this.state.start + "&count=" + this.state.count + 1)
		.then((response) =>
		{
			console.log("DEBUG: Response code: " + response.status);
			
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
            //Got Chits sucessfully
            this.setState({chits: responseJson});
		})
		 .catch((error) =>
		 {
			this.state.error = error;
         });
	}
    
    _onRefresh(){
            console.log("Refreshing...");
            this.setState({refreshing:true});
            this.getScrollChunk().then(() =>{
                this.setState({refreshing:false});
            });
    }
	
    
//============================================================== PAGE RENDER ==============================================================

    render(){
		return(
		<View>
            <View>
				<ScrollView refreshControl={<RefreshControl refreshing={this.state.refresh}onRefresh={this._onRefresh.bind(this)}/>}>
                        { this.state.chits.map((item) => {
                            return(
                                <View style = {styles.chit}>
                                    <TouchableOpacity
                                    style={styles.listButton}
                                    onPress={() =>
                                    {
                                        console.log(item.user.user_id);
                                        this.props.navigation.navigate("external", item);
                                    }}
                                >
                                    <Image
                                    style={styles.userImage}
                                    source={{uri: 'https://img.icons8.com/office/64/000000/earth-element.png'}}
                                    />
                                    
                                        
                                        <Text style={styles.userName}>{item.user.given_name + " " + item.user.family_name}</Text>

                                    <Text style={styles.userContent}>{item.chit_content}</Text>
                                    </TouchableOpacity>
                                </View>
                            )
                           })}
					
				</ScrollView>
                </View>
			
                <View style={styles.bottomTabContainer}>
                <TouchableOpacity
                    style={styles.tabButton}
                    onPress={() =>
                    {
                        this.props.navigation.navigate("updateFeed");
                    }}

                >
                    <Image
                         style={styles.tabImage}
                         source={{uri: 'https://img.icons8.com/material-sharp/24/000000/pencil--v1.png'}}
         
                    /> 
                    <Text>MAKE CHIT</Text>
         
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.tabButton}
                    onPress={() =>
                    {
                         this.props.navigation.navigate("myProfile");
                    }}

                >
                    <Image
                        style={styles.tabImage}
                        source={{uri: 'https://img.icons8.com/material-sharp/24/000000/contract-job.png'}}
                    /> 
                    <Text>PROFILE</Text>
         
                </TouchableOpacity>
        
         </View>
           

		</View>
         
    );}
}
export default mainFeed;

//============================================================== INTERNAL STYLE SHEET ==============================================================
const styles = StyleSheet.create(
	{
        textInput: {
            backgroundColor:"#f4eec7",
            borderRadius:10,
            padding:10,
            margin:10,
        },
        header:{
            position:'absolute',
            left:0,
            right:0,
            top:0,
        },    
        chit:{
            marginTop:2,
            padding:15,
            paddingTop:30,
            backgroundColor:'#f4eec7',
            flexDirection:'column',
            height:150,
        },
    
        userImage:{
            width:60,
            height:60,
            position:'absolute'
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
            top:40,
            fontSize:18,
            paddingTop:30
    
        },
        bottomTabContainer:{          
            position: 'absolute',
            width: '100%',
            height: 50,
            backgroundColor: 'yellowgreen',
            alignItems: 'center',
            position: 'absolute',
            bottom: 0, 
            flexDirection:"row" ,
            justifyContent:"space-around",
        },
        tabButton:{
        },
        tabImage:{
            height:30,
            width:30,
        },
        listButton:{
            height:500,
            margin:0,
            
        },
	});
  /*
  Joseph Higgins
  Chittr
  Version-0.0.3
  */