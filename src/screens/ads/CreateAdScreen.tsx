// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// const CreateAdScreen = () => {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Welcome to My App!</Text>
//       <Text style={styles.subtitle}>This is a basic home page.</Text>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0', // Light gray background
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     color: '#333', // Dark gray text
//   },
//   subtitle: {
//     fontSize: 16,
//     color: '#666', // Medium gray text
//   },
// });

// export default CreateAdScreen;


/**
 * Create Ad Screen
 * Allows users to create new ads
 */
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
  Platform 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { Screen } from '../../components/common/Screen';
import { Button } from '../../components/common/Button';
import { useAds } from '../../hooks/ad/use-ads'; //ayad
import type { RootState } from '../../store';
import type { NavigationProp } from '../../types/navigation';
// import { SelectList } from 'react-native-dropdown-select-list' //ayad
// import { Dropdown } from 'react-native-material-dropdown-v2-fixed'; //ayad
import { Picker } from '@react-native-picker/picker'; //ayad
// import { classNameList, cityNameList } from '../../types/ads';
import * as ImagePicker from 'expo-image-picker';
// import * as FileSystem from 'expo-file-system';
import { fetch } from 'expo/fetch';

import AsyncStorage from '@react-native-async-storage/async-storage'; // Or
// import { useImage } from '../../hooks/imageH/use-image';
import { uploadImageToStorage } from '../../services/firebase/storage.service';
import { setImageAsync } from 'expo-clipboard';
// import { launchImageLibrary } from 'react-native-image-picker';
// import ImageCropPicker from 'react-native-image-crop-picker'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebase'; // Assuming your Firebase config is in firebaseConfig.js
import { launchImagePicker, openCamera, uploadImageAsync } from "./imagePickerHelper";

export const classNameList = {
    RealEstate: 'Real estate', 
    WorkAndBusiness: 'Work and business', 
    MobileAndComputer: 'Mobile and computer'
};

export const cityNameList = {
    Bagdad: 'Bagdad',
    Babylon: 'Babylon',
    Karbala: 'Karbala'
}

export default function CreateAdScreen() {
  const navigation = useNavigation<NavigationProp>();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const { createNewAd, refreshAds } = useAds(user?.uid || '');
  
  const [adTitle, setAdTitle] = useState('');
  const [adDescription, setAdDescription] = useState('');
  const [className, setClassName] = useState('Real estate');
  const [typeName, setTypeName] = useState('sale');
  const [cityName, setCityName] = useState('Bagdad');
  
  const [isCreating, setIsCreating] = useState(false);

  // const classNameData = [
  //   {key:'1', value:`${classNameList.RealEstate}`},
  //   {key:'2', value:`${classNameList.WorkAndBusiness}`},
  //   {key:'3', value:`${classNameList.MobileAndComputer}`},
  // ]
  // const typeNameData = [
  //   {key:'1', value:`sale`},
  //   {key:'2', value:`buy`},
  // ]
  // const cityNameData = [
  //   {key:'1', value:`${cityNameList.Bagdad}`},
  //   {key:'2', value:`${cityNameList.Babylon}`},
  //   {key:'3', value:`${cityNameList.Karbala}`}
  // ]

  const [image, setImage] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUri, setImageUri] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  // const [img, setImg] = useState<any>(null);
  // const [loading, setLoading] = useState<bool>(false);
  // const [selectedRegion, setSelectedRegion] = useState<any>(null)


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
    if (!adTitle.trim() || !adDescription.trim() || !typeName.trim() || !className.trim() || !cityName.trim() ) {
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
    }
  // }, [image, imageUrl, adTitle, adDescription, typeName, className, cityName, user, createNewAd, navigation]);
  }, [tempImageUri, adTitle, adDescription, typeName, className, cityName, user, createNewAd, navigation]);

  return (
    <Screen style={styles.container}>
      {/* <ScrollView showsVerticalScrollIndicator={false}> */}
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Ad</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Ad Inputs */}
        <View style={styles.inputContainer}>
          {/* image picker */}
          <Text style={styles.inputLabel}>Image</Text>
          <TouchableOpacity style={styles.textInput} onPress={pickImage}>
          {/* <TouchableOpacity style={styles.textInput} onPress={pickAndUploadImage}> */}
          {/* <TouchableOpacity style={styles.textInput} onPress={openGallery}> */}
            <Text style={styles.textInput}>Pick an image</Text>
          </TouchableOpacity>
          {/* {image && ( */}
          {tempImageUri && (
            <Image
              // source={{ uri: image }}
              source={{ uri: tempImageUri }}
              style={{ width: 200, height: 200 }}
            />
          )}
          {/* <TouchableOpacity style={styles.textInput} onPress={uploadMedia}> */}
          {/* <TouchableOpacity style={styles.textInput} onPress={handleSave}> */}
          {/* <TouchableOpacity style={styles.textInput} onPress={pickAndUploadImage}> */}
            {/* <Text style={styles.textInput}>Upload Media</Text> */}
          {/* </TouchableOpacity> */}

          <Text style={styles.inputLabel}>Title</Text>
          <TextInput
            style={styles.textInput}
            value={adTitle}
            onChangeText={setAdTitle}
            placeholder="Enter ad title..."
            placeholderTextColor="#AAAAAA"
            maxLength={50}
          />
          <Text style={styles.inputLabel}>Description</Text>
          <TextInput
            style={styles.textInput}
            value={adDescription}
            onChangeText={setAdDescription}
            placeholder="Enter ad title..."
            placeholderTextColor="#AAAAAA"
            maxLength={500}
          />
          <Text style={styles.inputLabel}>Category</Text>
          {/* <SelectList 
              setSelected={(val: string) => setClassName(val)} 
              data={classNameData} 
              save="value"
              boxStyles={styles.textInput} //تحتاج تعديل
              inputStyles={{color: '#FFFFFF',}}
              dropdownTextStyles={{color: '#FFFFFF',}}
          /> */}
          <Picker
            selectedValue={className}
            style={styles.textInput}
            onValueChange={(itemValue, itemIndex) =>
              setClassName(itemValue)
            }>
            <Picker.Item label={classNameList.RealEstate} value={classNameList.RealEstate} />
            <Picker.Item label={classNameList.WorkAndBusiness} value={classNameList.WorkAndBusiness} />
            <Picker.Item label={classNameList.MobileAndComputer} value={classNameList.MobileAndComputer} />
          </Picker>
          <Text style={styles.inputLabel}>Type</Text>
          {/* <SelectList 
              setSelected={(val: string) => setTypeName(val)} 
              data={typeNameData} 
              save="value"
              boxStyles={styles.textInput} //تحتاج تعديل
              inputStyles={{color: '#FFFFFF',}}
              dropdownTextStyles={{color: '#FFFFFF',}}
          /> */}
          <Picker
            selectedValue={typeName}
            style={styles.textInput}
            onValueChange={(itemValue, itemIndex) =>
              setTypeName(itemValue)
            }>
            <Picker.Item label="sale" value="sale" />
            <Picker.Item label="buy" value="buy" />
          </Picker>
          <Text style={styles.inputLabel}>City</Text>
          {/* <SelectList 
              setSelected={(val: string) => setCityName(val)} 
              data={cityNameData} 
              save="value"
              boxStyles={styles.textInput} //تحتاج تعديل
              inputStyles={{color: '#FFFFFF',}}
              dropdownTextStyles={{color: '#FFFFFF',}}
          /> */}
          <Picker
            selectedValue={cityName}
            style={styles.textInput}
            onValueChange={(itemValue, itemIndex) =>
              setCityName(itemValue)
            }>
            <Picker.Item label={cityNameList.Bagdad} value={cityNameList.Bagdad} />
            <Picker.Item label={cityNameList.Babylon} value={cityNameList.Babylon} />
            <Picker.Item label={cityNameList.Karbala} value={cityNameList.Karbala} />
          </Picker>
          {/* Create Ad Button */}
          {/* <Button
            title={isCreating ? 'Creating...' : 'Create Ad'}
            onPress={handleCreateAd}
            disabled={isCreating || !adTitle.trim() || !adDescription.trim() || !typeName.trim() || !className.trim() || !cityName.trim() }
            style={styles.createButton}
          /> */}
        </View>

        {/* Create Ad Button */}
        <View style={{ marginTop: 16, paddingHorizontal: 16, paddingVertical: 12 }}>
          <Button
            title={isCreating ? 'Creating...' : 'Create Ad'}
            // onPress={handleCreateAd}
            onPress={uploadImage}
            disabled={isCreating || !adTitle.trim() || !adDescription.trim() || !typeName.trim() || !className.trim() || !cityName.trim() }
            style={styles.createButton}
          />
        </View>

        {/* Create Ad Button */}
        {/* <View style={styles.buttonContainer}>
          <Button
            title={isCreating ? 'Creating...' : 'Create Ad'}
            onPress={handleCreateAd}
            disabled={isCreating || !adTitle.trim() || !adDescription.trim() || !typeName.trim() || !className.trim() || !cityName.trim() }
            style={styles.createButton}
          />
        </View> */}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  inputContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  selectedContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 132, 255, 0.1)',
  },
  selectedText: {
    fontSize: 14,
    color: '#0084FF',
    fontWeight: '500',
  },
  friendsContainer: {
    flex: 1,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  friendsList: {
    paddingBottom: 100,
  },
  friendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  friendInfo: {
    flex: 1,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  checkboxSelected: {
    backgroundColor: '#0084FF',
    borderColor: '#0084FF',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#AAAAAA',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#AAAAAA',
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  createButton: {
    backgroundColor: '#0084FF',
    paddingVertical: 16,
  },
}); 