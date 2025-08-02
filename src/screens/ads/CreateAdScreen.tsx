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
import { SelectList } from 'react-native-dropdown-select-list' //ayad
import { classNameList, cityNameList } from '../../types/ads';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Or
// import { useImage } from '../../hooks/imageH/use-image';
import { uploadImageToStorage } from '../../services/firebase/storage.service';
import { setImageAsync } from 'expo-clipboard';
// import { launchImageLibrary } from 'react-native-image-picker';
// import ImageCropPicker from 'react-native-image-crop-picker'

export default function CreateAdScreen() {
  const [image, setImage] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
  const [imageUri, setImageUri] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');

  // const [img, setImg] = useState<any>(null);
  // const [loading, setLoading] = useState<bool>(false);
  // const [selectedRegion, setSelectedRegion] = useState<any>(null)

  // const openGallery = () => {
  //   const options = { mediaTypes: 'photo', includeBase64: true, maxHeight: 2000, maxWidth: 2000 };
  //   launchImageLibrary(options, (response) => {
  //     if (response.assets && response.assets.length > 0) {
  //       const imgUri = response.assets[0].uri;
  //       setImg(imgUri);

  //       ImageCropPicker.openCropper({ path: imgUri, width: 300, height: 400 }).then(image => {
  //         setSelectedRegion(image);
  //       }).catch(e => console.log(e))
  //     }
  //   })
  // }

  // const handleSave = useCallback(async () => {
  //   if(!img) {
  //     Alert.alert('Error', 'Please provide an image.');
  //     console.log('Error, please provide an image.')
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     const blob = await new Promise((resolve, reject) => {
  //       const xhr = new XMLHttpRequest();
  //       xhr.onload = function () {
  //         resolve(xhr.response);
  //       };
  //       xhr.onerror = function (e) {
  //         console.log(e);
  //         reject(new TypeError('Network request failed'));
  //       };
  //       xhr.responseType = 'blob';
  //       xhr.open('GET', img, true);
  //       xhr.send(null); 
  //     });

  //     const fileName = img.substring(image.lastIndexOf('/') + 1);
  //     const url = await uploadImageToStorage(fileName, blob as string);
  //     setLoading(false);
  //     Alert.alert('Image uploaded successfully', url);
  //     console.log('image url', url)
  //     setImg(null)
  //   } catch (error) {
  //     console.log(error);
  //     setLoading(false);
  //   }      
  // }, [img]);

  //pick an image
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // all images and vides
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri)
    }
  }
  //upload media files
  const uploadMedia = useCallback(async () => {
    setUploading(true);
    try {
      // if (!image) return;
      const { uri } = await FileSystem.getInfoAsync(image);

      // if (Platform.OS === 'web') {
      //   // Use web-compatible storage like AsyncStorage or localStorage
      //   const uri = await AsyncStorage.getItem(image);
      //   setImageUri(uri || '')
      // } else {
      //   const { uri } = await FileSystem.getInfoAsync(image);
      //   setImageUri(uri || '')
      // }
      // Use web-compatible storage like AsyncStorage or localStorage
      // const uri = await AsyncStorage.getItem(image);
      // const uri = image; //ayad
      console.log('uri', uri)
      if (!uri) return;
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
          resolve(xhr.response);
        };
        xhr.onerror = function (e) {
          console.log(e);
          reject(new TypeError('Network request failed'));
        };
        xhr.responseType = 'blob';
        xhr.open('GET', uri, true);
        xhr.send(null); 
      });

      const fileName = image.substring(image.lastIndexOf('/') + 1);
      const url = await uploadImageToStorage(fileName, blob as string);
      setImageUrl(url)
      setUploading(false);
      Alert.alert('Image uploaded successfully', url);
      console.log('image url', url)
      setImage(null)
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  }, [image, imageUri])
  
  // delete image
  // const deleteImage = async () => {
  //   setUploading(true);
  //   try {
  //     setImage(null)
  //   } catch (error) {
  //     console.log(error);
  //     setUploading(false);
  //   }
  // }

  const navigation = useNavigation<NavigationProp>();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const { createNewAd, refreshAds } = useAds(user?.uid || '');
  
  const [adTitle, setAdTitle] = useState('');
  const [adDescription, setAdDescription] = useState('');
  const [className, setClassName] = useState('');
  const [typeName, setTypeName] = useState('');
  const [cityName, setCityName] = useState('');
  
  const [isCreating, setIsCreating] = useState(false);

  const classNameData = [
    {key:'1', value:`${classNameList.RealEstate}`},
    {key:'2', value:`${classNameList.WorkAndBusiness}`},
    {key:'3', value:`${classNameList.MobileAndComputer}`},
  ]
  const typeNameData = [
    {key:'1', value:`sale`},
    {key:'2', value:`buy`},
  ]
  const cityNameData = [
    {key:'1', value:`${cityNameList.Bagdad}`},
    {key:'2', value:`${cityNameList.Babylon}`},
    {key:'3', value:`${cityNameList.Karbala}`}
  ]

  /**
   * Handle ad creation
   */
  const handleCreateAd = useCallback(async () => {
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
        adPicture: imageUrl,
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
  }, [adTitle, adDescription, typeName, className, cityName, user, createNewAd, navigation]);

  /**
   * Handle refresh
   */
  // const handleRefresh = async () => {
  //   try {
  //     await refreshAds();
  //   } catch (error) {
  //     console.error('Error refreshing ads:', error);
  //   }
  // };

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
        {/* Group Name Input */}
        {/* <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Group Name</Text>
          <TextInput
            style={styles.textInput}
            value={groupName}
            onChangeText={setGroupName}
            placeholder="Enter group name..."
            placeholderTextColor="#AAAAAA"
            maxLength={50}
          />
        </View> */}

        {/* Ad Inputs */}
        <View style={styles.inputContainer}>
          {/* image picker */}
          <Text style={styles.inputLabel}>Image</Text>
          <TouchableOpacity style={styles.textInput} onPress={pickImage}>
          {/* <TouchableOpacity style={styles.textInput} onPress={openGallery}> */}
            <Text style={styles.textInput}>Pick an image</Text>
          </TouchableOpacity>
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 200 }}
            />
          )}
          <TouchableOpacity style={styles.textInput} onPress={uploadMedia}>
          {/* <TouchableOpacity style={styles.textInput} onPress={handleSave}> */}
            <Text style={styles.textInput}>Upload Media</Text>
          </TouchableOpacity>

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
          <SelectList 
              setSelected={(val: string) => setClassName(val)} 
              data={classNameData} 
              save="value"
              boxStyles={styles.textInput} //تحتاج تعديل
              inputStyles={{color: '#FFFFFF',}}
              dropdownTextStyles={{color: '#FFFFFF',}}
          />
          <Text style={styles.inputLabel}>Type</Text>
          <SelectList 
              setSelected={(val: string) => setTypeName(val)} 
              data={typeNameData} 
              save="value"
              boxStyles={styles.textInput} //تحتاج تعديل
              inputStyles={{color: '#FFFFFF',}}
              dropdownTextStyles={{color: '#FFFFFF',}}
          />
          <Text style={styles.inputLabel}>City</Text>
          <SelectList 
              setSelected={(val: string) => setCityName(val)} 
              data={cityNameData} 
              save="value"
              boxStyles={styles.textInput} //تحتاج تعديل
              inputStyles={{color: '#FFFFFF',}}
              dropdownTextStyles={{color: '#FFFFFF',}}
          />
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
            onPress={handleCreateAd}
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