import {mediaDevices, MediaStream, RTCIceCandidate, RTCPeerConnection, RTCSessionDescription, RTCView} from 'react-native-webrtc';
import React from 'react';
import {SectionList,ScrollView, ImageBackground, Image, SafeAreaView, StyleSheet,Text,Dimensions,FlatList,StatusBar,View,TouchableOpacity} from 'react-native';
import {Janus, JanusVideoRoomPlugin} from 'react-native-janus';

Janus.setDependencies({
    RTCPeerConnection,
    RTCSessionDescription,
    RTCIceCandidate,
    MediaStream,
});

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            stream: null,
            publishers: [],
        };
    }

    async receivePublisher(publisher) {
        try {
            let videoRoom = new JanusVideoRoomPlugin(this.janus);
            videoRoom.setRoomID(1234);
            videoRoom.setOnStreamListener((stream) => {
                this.setState(state => ({
                    publishers: [
                        ...state.publishers,
                        {
                            publisher: publisher,
                            stream: stream,
                        },
                    ],
                }));
            });

            await videoRoom.createPeer();
            await videoRoom.connect();
            await videoRoom.receive(this.videoRoom.getUserPrivateID(), publisher);
        } catch (e) {
            console.error(e);
        }
    }

    async removePublisher(publisherID) {
        try {
            this.setState(state => ({
                publishers: state.publishers.filter(pub => pub.publisher == null || pub.publisher.id !== publisherID),
            }));
        } catch (e) {
            console.error(e);
        }
    }

    async initJanus(stream) {
        try {
            this.setState(state => ({
                publishers: [
                    {
                        publisher: null,
                        stream: stream,
                    },
                ],
            }));

            //this.janus = new Janus('ws://192.168.0.57:8188');
            this.janus = new Janus('ws://77.32.100.208:8188');
            this.janus.setApiSecret('2468abcd');
            await this.janus.init();

            this.videoRoom = new JanusVideoRoomPlugin(this.janus);
            this.videoRoom.setRoomID(1234);
            this.videoRoom.setDisplayName('campanello');
            this.videoRoom.setOnPublishersListener((publishers) => {
                for (let i = 0; i < publishers.length; i++) {
                    this.receivePublisher(publishers[i]);
                }
            });
            this.videoRoom.setOnPublisherJoinedListener((publisher) => {
                this.receivePublisher(publisher);
            });
            this.videoRoom.setOnPublisherLeftListener((publisherID) => {
                this.removePublisher(publisherID);
            });
            this.videoRoom.setOnWebRTCUpListener(async () => {

            });
            await this.videoRoom.createPeer();
            await this.videoRoom.connect();
            await this.videoRoom.join();
            await this.videoRoom.publish(stream);

        } catch (e) {
            console.error('main', JSON.stringify(e));
        }
    }

    getMediaStream = async () => {
        let isFront = true;
        let sourceInfos = await mediaDevices.enumerateDevices();
        let videoSourceId;
        for (let i = 0; i < sourceInfos.length; i++) {
            const sourceInfo = sourceInfos[i];
            console.log(sourceInfo);
            if (sourceInfo.kind == 'videoinput' && sourceInfo.facing == (isFront ? 'front' : 'environment')) {
                videoSourceId = sourceInfo.deviceId;
            }
        }

        let stream = await mediaDevices.getUserMedia({
            audio: true,
            //video: false,
            video: {
                facingMode: (isFront ? 'user' : 'environment'),
            },
        });
        await this.initJanus(stream);
    };

    async componentDidMount() {
        this.getMediaStream();
    }

    componentWillUnmount = async () => {
        if (this.janus) {
            await this.janus.destroy();
        }
    };

    apriCancelletto = async () => {
        console.log("Apri Cancelletto")
    };

    apriCancello = async () => {
        console.log("Apri Cancello")
    };

    renderView() {
    }


    render() {
/*
        var iconCancello = require('./images/cancello_grande.png');
        var iconCancelletto = require('./images/cancello_piccolo.png');
*/


        return (
        <SafeAreaView style={{ flex: 1, }}>
            <StatusBar backgroundColor="lightblue" barStyle={'dark-content'}/>
            <View style={{...styles.buttons}}>
                <View style={{flex: 1,}}>
                  <TouchableOpacity onPress={this.apriCancello} style={styles.button}>
                     <Text style={{ ...styles.textContent, }}>Cancello</Text>
                     <Image source={{uri: 'cancello_grande.png'}} style={{width: 200, height: 200}} resizeMode='contain' style={{flex:.4 }} />
                  </TouchableOpacity>
                </View>
                <View style={{flex: 1,}}>
                  <TouchableOpacity onPress={this.apriCancelletto}  style={styles.button}>
                     <Text style={{ ...styles.textContent, }}>Cancelletto</Text>
                     <ImageBackground source={{uri: 'cancello_piccolo.png'}} resizeMode='contain' style={{flex:.4 }} />
                  </TouchableOpacity>
                </View>
                <View style={{flex: 1,}}>
                  <TouchableOpacity onPress={this.getMediaStream} style={styles.button}>
                      <Text style={{ ...styles.textContent, }}>Citofono</Text>
                  </TouchableOpacity>
                </View>
            </View>
          <View style={{flex: 1, width: '100%', height: '50%', backgroundColor: 'lightblue', flexDirection: 'row'}}>
                <FlatList inverted extraData={this.state.publishers}
                    data={this.state.publishers}
                    //numColumns={2}
                    keyExtractor={(item, index) => {
                        if (item.publisher === null) {
                            return `rtc-default`;
                        }
                        return `rtc-${item.publisher.id}`;
                    }}
                    renderItem={({item}) => (
                        <RTCView style={{
                            flex: 1,
                            height: (Dimensions.get('window').height/2),
                            //width: (Dimensions.get('screen').width),
                        }} objectFit={'cover'} streamURL={item.stream.toURL()}/>
                    )}
                />
            </View>
        </SafeAreaView>
        );
    }
}

let styles = StyleSheet.create({
	button: {
        margin: 5,
        paddingVertical: 10,
        backgroundColor: 'lightgray',
        borderRadius: 150,
	},
      textContent: {
        fontFamily: 'Avenir',
        fontSize: 20,
        textAlign: 'center',
        color: 'darkblue'
      },
      videosContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
      },
    buttons: {
      flexDirection: 'row',
       textAlign: "center",
       backgroundColor: 'lightblue',
    },
});

export default App;