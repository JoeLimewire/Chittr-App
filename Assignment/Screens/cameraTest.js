
//============================================================== IMPORTS ==============================================================
import React, { Component } from 'react';
import { Text, View, StyleSheet, Button} from 'react-native';
import { RNCamera } from 'react-native-camera';

//============================================================== PAGE CLASS & PAGE FUNCTIONS ==============================================================

class cameraTest extends Component
{
	constructor(props)
	{
		super(props);

		this.state=
		{
			photo: null,
		};
	}


	takePicture = async() =>
	{
		if (this.camera)
		{
			const options = { quality: 0.5, base64: true };
			const data = await this.camera.takePictureAsync(options);
			this.setState({photo: data});

			let help = this.props.route.params;
			console.log("DEBUG: " + help);


            //NEED TO IDENTIFY WHAT PAGE
			if(help)
			{

				this.props.navigation.navigate('myProfile', {photo: data});
			}
			else
			{
				this.props.navigation.navigate('updateFeed', {photo: data});
			}
		}
    };
    
    
	render(){
		return(
		<View style={styles.container}>
               <Button
                    title='TAKE PICTURE'
                    color="yellowgreen"
				    onPress={this.takePicture.bind(this)}
			/>
			<RNCamera
				ref={ref =>
					{
						this.camera = ref;
					}
				}
                style={styles.cameraView}
                captureAudio = {false}
				
			>
			</RNCamera>
		</View>

	);}
}
export default cameraTest;

//============================================================== INTERNAL STYLE SHEET ==============================================================
const styles = StyleSheet.create(
	{
		container:
		{
			flex: 1,
			flexDirection: 'column',
		},
		cameraView:
		{
			flex: 1,
			justifyContent: 'flex-end',
			alignItems: 'center',
		},
		capture:
		{
			flex: 0,
			borderRadius: 5,
			padding: 15,
			paddingHorizontal: 20,
			alignSelf: 'center',
			margin: 20,
		},
	});
	
	//Adding a comment so i can commit to Github
        /*
  Joseph Higgins
  Chittr
  Version-0.0.6
  */
