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
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Screen } from '../../components/common/Screen';
import { Button } from '../../components/common/Button';
import { useAds } from '../../hooks/ad/use-ads';
import type { RootState } from '../../store';
import type { NavigationProp } from '../../types/navigation';
import { Picker } from '@react-native-picker/picker';
import { launchImagePicker, openCamera, uploadImageAsync } from "./imagePickerHelper";
import { SafeAreaView } from 'react-native-safe-area-context';

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

export default function CreateAdScreen() {
  const navigation = useNavigation<NavigationProp>();
  const user = useSelector((state: RootState) => state.auth.user);
  const { createNewAd } = useAds(user?.uid || '');
  const [adTitle, setAdTitle] = useState('');
  const [adDescription, setAdDescription] = useState('');
  const [adPrice, setAdPrice] = useState('');
  const [className, setClassName] = useState('Real estate');
  const [typeName, setTypeName] = useState('sale');
  const [cityName, setCityName] = useState('Bagdad');
  const [isCreating, setIsCreating] = useState(false);
  const [tempImageUri, setTempImageUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = useCallback(async () => {
    try {
      const tempUri = await launchImagePicker();
      if (!tempUri) return;

      setTempImageUri(tempUri);
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
        handleCreateAd(uploadUrl)
        setTimeout(() => setTempImageUri(null), 500);
      }
    } catch (error) {
      console.log(error);
    }
  }, [tempImageUri, adTitle, adDescription, typeName, className, cityName, user, createNewAd, navigation]);

  const handleCreateAd = useCallback(async (url: string) => {
    if (!adTitle.trim() || !adDescription.trim() || !typeName.trim() || !className.trim() || !cityName.trim()) {
      Alert.alert('Ad Data Required', 'Please enter all data for your ad.');
      console.log('All ad data required!')
      console.log(`data: ${adTitle.trim(), adDescription.trim(), typeName.trim(), className.trim(), cityName.trim()}`)
      console.log(`adTitle: ${adTitle}`)
      console.log(`cityName: ${cityName}`)
      return;
    }
    if (!user) return;
    setIsCreating(true);
    try {
      const adId = await createNewAd({
        title: adTitle.trim(),
        description: adDescription.trim(),
        price: adPrice,
        // adPicture: imageUrl,
        adPicture: url,
        createdBy: user.uid,
        className: className.trim(),
        typeName: typeName.trim(),
        country: 'Iraq',
        city: cityName.trim()
      });
      console.log(`adId: ${adId}`)
      // handleRefresh; // Refresh ads list
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
      setIsCreating(false);
      setAdTitle('');
      setAdDescription('');
      setAdPrice('');
      // setClassName('');
      // setTypeName('');
      // setCityName('');
    }
  }, [tempImageUri, adTitle, adDescription, typeName, className, cityName, user, createNewAd, navigation]);

  return (
    // <Screen backgroundColor="#FFFFFF">
      // <View style={styles.container}>
      <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
        {/* Ad Inputs */}
        <View style={styles.inputContainer}>
          {/* image picker */}
          <Text style={styles.inputLabel}>Image</Text>
          <TouchableOpacity style={styles.textInput} onPress={pickImage}>
            <Text style={styles.textInput}>Pick an image</Text>
          </TouchableOpacity>
          {/* {image && ( */}
          {tempImageUri && (
            <View style={{ alignItems: 'center' }}>
              <Image
                source={{ uri: tempImageUri }}
                style={{ width: 200, height: 200, alignItems: 'center' }}
              />
            </View>

          )}
          <Text style={styles.inputLabel}>Title</Text>
          <TextInput
            style={styles.textInput}
            value={adTitle}
            onChangeText={setAdTitle}
            placeholder="Enter ad title..."
            placeholderTextColor="rgba(0, 0, 0, 0.4)"
            maxLength={50}
          />
          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={styles.textInput}
            value={adDescription}
            onChangeText={setAdDescription}
            placeholder="Enter ad title..."
            placeholderTextColor="rgba(0, 0, 0, 0.4)"
            maxLength={500}
          />

          <Text style={styles.inputLabel}>Price</Text>
          <TextInput
            style={styles.textInput}
            value={adPrice}
            onChangeText={setAdPrice}
            placeholder="Enter ad price..."
            placeholderTextColor="rgba(0, 0, 0, 0.4)"
            maxLength={500}
          />

          <Text style={styles.inputLabel}>Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={className}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) =>
                setClassName(itemValue)
              }
            >
              <Picker.Item label={classNameList.RealEstate} value={classNameList.RealEstate} />
              <Picker.Item label={classNameList.Animals} value={classNameList.Animals} />
              <Picker.Item label={classNameList.Electronics} value={classNameList.Electronics} />
              <Picker.Item label={classNameList.Fashion} value={classNameList.Fashion} />
              <Picker.Item label={classNameList.Games} value={classNameList.Games} />
              <Picker.Item label={classNameList.Works} value={classNameList.Works} />
              <Picker.Item label={classNameList.Cars} value={classNameList.Cars} />
            </Picker>
          </View>
          <Text style={styles.inputLabel}>Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={typeName}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) =>
                setTypeName(itemValue)
              }>
              <Picker.Item label="sale" value="sale" />
              <Picker.Item label="buy" value="buy" />
            </Picker>
          </View>
          <Text style={styles.inputLabel}>City</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={cityName}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) =>
                setCityName(itemValue)
              }>
              <Picker.Item label={cityNameList.Bagdad} value={cityNameList.Bagdad} />
              <Picker.Item label={cityNameList.Babil} value={cityNameList.Babil} />
              <Picker.Item label={cityNameList.Karbala} value={cityNameList.Karbala} />
              <Picker.Item label={cityNameList.AlAnbar} value={cityNameList.AlAnbar} />
              <Picker.Item label={cityNameList.Amarah} value={cityNameList.Amarah} />
              <Picker.Item label={cityNameList.Basra} value={cityNameList.Basra} />
              <Picker.Item label={cityNameList.Diwaniyah} value={cityNameList.Diwaniyah} />
              <Picker.Item label={cityNameList.Diyala} value={cityNameList.Diyala} />
              <Picker.Item label={cityNameList.Dohuk} value={cityNameList.Dohuk} />
              <Picker.Item label={cityNameList.Erbil} value={cityNameList.Erbil} />
              <Picker.Item label={cityNameList.Kirkuk} value={cityNameList.Kirkuk} />
              <Picker.Item label={cityNameList.Mosul} value={cityNameList.Mosul} />
              <Picker.Item label={cityNameList.Najaf} value={cityNameList.Najaf} />
              <Picker.Item label={cityNameList.Nasiriyah} value={cityNameList.Nasiriyah} />
              <Picker.Item label={cityNameList.Saladin} value={cityNameList.Saladin} />
              <Picker.Item label={cityNameList.Samawah} value={cityNameList.Samawah} />
              <Picker.Item label={cityNameList.Sulaymaniyah} value={cityNameList.Sulaymaniyah} />
              <Picker.Item label={cityNameList.Wasit} value={cityNameList.Wasit} />
            </Picker>
          </View>
        </View>
        {/* Create Ad Button */}
        <View style={{ marginTop: 16, paddingHorizontal: 16, paddingVertical: 12 }}>
          <Button
            title={isLoading ? 'Loading...' : isCreating ? 'Creating...' : 'Create Ad'}
            onPress={uploadImage}
            disabled={isCreating || isLoading || !adTitle.trim() || !adDescription.trim() || !typeName.trim() || !className.trim() || !cityName.trim() || !adPrice}
            style={styles.createButton}
          />
        </View>
      </ScrollView>
      </SafeAreaView>
      // </View>
    // </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
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
  createButton: {
    backgroundColor: '#0084FF',
    paddingVertical: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
  },
  picker: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 12,
    borderColor: 'rgba(255, 255, 255, 1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
  },
});
