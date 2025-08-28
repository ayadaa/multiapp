import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
 
const SearchButton = () => {
    const navigation = useNavigation<any>();

    const handleSearchPress = () => {
        navigation.navigate('Search' as never);
    }

    return (
        <TouchableOpacity onPress={handleSearchPress}>
            <View style={styles.searchBtn}>
                <Ionicons name="search" size={24} />
                <View>
                    <Text style={{ fontFamily: 'mon-sb' }}>What do you want?</Text>
                    <Text style={{ color: '#5E5D5E', fontFamily: 'mon' }}>Sale · buy</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    searchBtn: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        gap: 10,
        padding: 6,
        alignItems: 'center',
        width: 280,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#c2c2c2',
        borderRadius: 30,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 8,
        shadowOffset: {
            width: 1,
            height: 1,
        },
    },
});

export default SearchButton;