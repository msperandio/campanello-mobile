import React from 'react';
import { View, Stylesheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

interface Props {
    onPress: any;
    iconName: string;
    backgroundColor: string;
    style: any;
}

export default function Button(props: Props){
    return(
        <View>
            <TouchableOpacity
             onPress={props.onPress}
             style={[
                {backgroundColor=props.backgroundColor},
                props.style,
                styles.button,
             ]}>
            <Icon name={props.iconName} color="white" size={20}>
            </TouchableOpacity>
        </View>);
}

const styles = Stylesheet.create({
    button: {},
});