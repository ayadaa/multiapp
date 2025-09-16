import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Screen } from '../../components/common/Screen';
import { Button } from '../../components/common/Button';
import { useAds } from '../../hooks/ad/use-ads'; //ayad
import type { RootState } from '../../store';
// import type { NavigationProp } from '../../types/navigation';
import { Picker } from '@react-native-picker/picker'; //ayad
import { launchImagePicker, openCamera, uploadImageAsync } from "./imagePickerHelper";
import type { AppStackParamList } from '../../types/navigation';
import { type StackNavigationProp } from '@react-navigation/stack';
import i18n from '../../language/i18n';

type UpdateAdScreenRouteProp = RouteProp<AppStackParamList, 'UpdateAd'>;
type UpdateAdScreenNavigationProp = StackNavigationProp<AppStackParamList, 'UpdateAd'>;

export const classNameList = {
  RealEstate: 'Real estate',
  Cars: 'Cars',
  Electronics: 'Electronics',
  Works: 'Works',
  Animals: 'Animals',
  Fashion: 'Fashion',
  Games: 'Games',
};

export const cityNameList = {
  Bagdad: 'Bagdad',
  Babil: 'Babil',
  Karbala: 'Karbala',
  Mosul: 'Mosul',
  Basra: 'Basra',
  Kirkuk: 'Kirkuk',
  Erbil: 'Erbil',
  Najaf: 'Najaf',
  Sulaymaniyah: 'Sulaymaniyah',
  Nasiriyah: 'Nasiriyah',
  Amarah: 'Amarah',
  Diwaniyah: 'Diwaniyah',
  Wasit: 'Wasit',
  Dohuk: 'Dohuk',
  Diyala: 'Diyala',
  AlAnbar: 'Al Anbar',
  Samawah: 'Samawah',
  Saladin: 'Saladin',
}

export default function UpdateAdScreen() {
  const route = useRoute<UpdateAdScreenRouteProp>();
  const navigation = useNavigation<UpdateAdScreenNavigationProp>();
  const ad = route.params;

  const user = useSelector((state: RootState) => state.auth.user);
  const { updateAnAd } = useAds(user?.uid || '');
  const [adTitle, setAdTitle] = useState(ad.title);
  const [adDescription, setAdDescription] = useState(ad.description);
  const [adPrice, setAdPrice] = useState(ad.price);
  const [className, setClassName] = useState(ad.className);
  const [typeName, setTypeName] = useState(ad.typeName);
  const [cityName, setCityName] = useState(ad.city);
  const [isUpdateing, setIsUpdateing] = useState(false);
  const [tempImageUri, setTempImageUri] = useState<string | null>(null);
  const [tempImageUrl, setTempImageUrl] = useState<string | null>(ad.adPicture!);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = useCallback(async () => {
    try {
      const tempUri = await launchImagePicker();
      if (!tempUri) return;

      setTempImageUri(tempUri);
      setTempImageUrl(null);
    } catch (error) {
      console.log(error);
    }
  }, [tempImageUri]);

  const uploadImage = useCallback(async () => {
    setIsLoading(true);
    try {
      if (tempImageUri) {
        const uploadUrl = await uploadImageAsync(tempImageUri, true);
        setIsLoading(false);
        handleUpdateAd(uploadUrl)
        setTimeout(() => setTempImageUri(null), 500);
      }
      else if (tempImageUrl) {
        setIsLoading(false);
        handleUpdateAd(tempImageUrl)
        setTimeout(() => setTempImageUri(null), 500);
      }
    } catch (error) {
      console.log(error);
    }
  }, [tempImageUri, adTitle, adDescription, typeName, className, cityName, user, updateAnAd, navigation]);

  const handleUpdateAd = useCallback(async (url: string) => {
    if (!adTitle.trim() || !adDescription.trim() || !typeName.trim() || !className.trim() || !cityName.trim()) {
      Alert.alert('Ad Data Required', 'Please enter all data for your ad.');
      console.log('All ad data required!')
      console.log(`data: ${adTitle.trim(), adDescription.trim(), typeName.trim(), className.trim(), cityName.trim()}`)
      console.log(`adTitle: ${adTitle}`)
      console.log(`cityName: ${cityName}`)
      return;
    }
    if (!user) return;
    setIsUpdateing(true);
    try {
      const adId = await updateAnAd({
        id: ad.id,
        title: adTitle.trim(),
        description: adDescription.trim(),
        price: adPrice,
        adPicture: url,
        createdBy: user.uid,
        className: className.trim(),
        typeName: typeName.trim(),
        country: 'Iraq',
        city: cityName.trim()
      });
      console.log(`adId: ${adId}`)
      Alert.alert(
        'Ad Created!',
        `"Ad has been created successfully.`,
        [
          {
            text: 'OK',
            onPress: () => {
              // Navigate to the ads tab
              // navigation.navigate('Ads');
              navigation.goBack(); //ayad
            }
          }
        ]
      );
      Alert.alert(
        'Ad Created',
        'Ad has been created.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to create ad. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsUpdateing(false);

      setAdTitle('');
      setAdDescription('');
      setAdPrice('');
    }
  }, [tempImageUri, adTitle, adDescription, typeName, className, cityName, user, updateAnAd, navigation]);

  return (
    <Screen keyboardAvoidingView={true}>
      {/* <View style={styles.container}> */}
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {/* Ad Inputs */}
        <View style={styles.inputContainer}>
          {/* image picker */}
          <Text style={styles.inputLabel}>{i18n.t('image')}</Text>
          <TouchableOpacity style={styles.textInput} onPress={pickImage}>
            <Text style={styles.textInput}>{i18n.t('pickAnImage')}</Text>
          </TouchableOpacity>
          {/* {image && ( */}
          {(tempImageUri || tempImageUrl) && (
            <View style={{ alignItems: 'center', marginVertical: 2 }}>
              <Image
                source={{ uri: tempImageUri || tempImageUrl || '' }}
                style={{ width: 200, height: 200, alignItems: 'center' }}
              />
            </View>
          )}
          <Text style={styles.inputLabel}>{i18n.t('title')}</Text>
          <TextInput
            style={styles.textInput}
            value={adTitle}
            onChangeText={setAdTitle}
            placeholder={i18n.t('enterAdTitle')}
            placeholderTextColor="rgba(0, 0, 0, 0.4)"
            maxLength={50}
          />
          <Text style={styles.inputLabel}>{i18n.t('description')}</Text>
          <TextInput
            style={styles.textInput}
            value={adDescription}
            onChangeText={setAdDescription}
            placeholder={i18n.t('enterAdDescription')}
            placeholderTextColor="rgba(0, 0, 0, 0.4)"
            maxLength={500}
          />
          <Text style={styles.inputLabel}>{i18n.t('price')}</Text>
          <TextInput
            style={styles.textInput}
            value={adPrice}
            onChangeText={setAdPrice}
            placeholder={i18n.t('enterAdPrice')}
            placeholderTextColor="rgba(0, 0, 0, 0.4)"
            maxLength={500}
          />
          <Text style={styles.inputLabel}>{i18n.t('category')}</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={className}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) =>
                setClassName(itemValue)
              }
            >
              <Picker.Item label={i18n.t('realEstate')} value={classNameList.RealEstate} />
              <Picker.Item label={i18n.t('animals')} value={classNameList.Animals} />
              <Picker.Item label={i18n.t('electronics')} value={classNameList.Electronics} />
              <Picker.Item label={i18n.t('fashion')} value={classNameList.Fashion} />
              <Picker.Item label={i18n.t('games')} value={classNameList.Games} />
              <Picker.Item label={i18n.t('works')} value={classNameList.Works} />
              <Picker.Item label={i18n.t('cars')} value={classNameList.Cars} />
            </Picker>
          </View>
          <Text style={styles.inputLabel}>{i18n.t('type')}</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={typeName}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) =>
                setTypeName(itemValue)
              }>
              <Picker.Item label={i18n.t('sale')} value="sale" />
              <Picker.Item label={i18n.t('buy')} value="buy" />
            </Picker>
          </View>
          <Text style={styles.inputLabel}>{i18n.t('city')}</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={cityName}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) =>
                setCityName(itemValue)
              }>
              <Picker.Item label={i18n.t('Bagdad')} value={cityNameList.Bagdad} />
              <Picker.Item label={i18n.t('Babil')} value={cityNameList.Babil} />
              <Picker.Item label={i18n.t('Karbala')} value={cityNameList.Karbala} />
              <Picker.Item label={i18n.t('AlAnbar')} value={cityNameList.AlAnbar} />
              <Picker.Item label={i18n.t('Amarah')} value={cityNameList.Amarah} />
              <Picker.Item label={i18n.t('Basra')} value={cityNameList.Basra} />
              <Picker.Item label={i18n.t('Diwaniyah')} value={cityNameList.Diwaniyah} />
              <Picker.Item label={i18n.t('Diyala')} value={cityNameList.Diyala} />
              <Picker.Item label={i18n.t('Dohuk')} value={cityNameList.Dohuk} />
              <Picker.Item label={i18n.t('Erbil')} value={cityNameList.Erbil} />
              <Picker.Item label={i18n.t('Kirkuk')} value={cityNameList.Kirkuk} />
              <Picker.Item label={i18n.t('Mosul')} value={cityNameList.Mosul} />
              <Picker.Item label={i18n.t('Najaf')} value={cityNameList.Najaf} />
              <Picker.Item label={i18n.t('Nasiriyah')} value={cityNameList.Nasiriyah} />
              <Picker.Item label={i18n.t('Saladin')} value={cityNameList.Saladin} />
              <Picker.Item label={i18n.t('Samawah')} value={cityNameList.Samawah} />
              <Picker.Item label={i18n.t('Sulaymaniyah')} value={cityNameList.Sulaymaniyah} />
              <Picker.Item label={i18n.t('Wasit')} value={cityNameList.Wasit} />
            </Picker>
          </View>
        </View>
        {/* Update Ad Button */}
        <View style={{ marginTop: 16, paddingHorizontal: 16, paddingVertical: 12 }}>
          <Button
            title={isLoading ? i18n.t('loading') : isUpdateing ? i18n.t('updateing'): i18n.t('updateAd')}
            onPress={uploadImage}
            disabled={isUpdateing || isLoading || !adTitle.trim() || !adDescription.trim() || !typeName.trim() || !className.trim() || !cityName.trim() || !adPrice}
            style={styles.updateButton}
          />
        </View>
      </ScrollView>
      {/* </View> */}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  updateButton: {
    // backgroundColor: '#0084FF',
    // paddingVertical: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,

    backgroundColor: 'rgba(255, 255, 255, 1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  picker: {
    // backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 12,
    borderColor: 'rgba(255, 255, 255, 1)',
    // paddingHorizontal: 16,
    // paddingVertical: 12,
    fontSize: 16,
    color: '#000000',

    borderWidth: 1,
  },
});
