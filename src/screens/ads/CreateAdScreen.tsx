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
  Image
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
// import { useImage } from '../../hooks/imageH/use-image';
import { uploadImageToStorage } from '../../services/firebase/storage.service';
import { setImageAsync } from 'expo-clipboard';
 
export default function CreateAdScreen() {
  const [image, setImage] = useState<any>(null);
  const [uploading, setUploading] = useState(false);
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
  const uploadMedia = async () => {
    setUploading(true);
    try {
      // if (!image) return;
      const { uri } = await FileSystem.getInfoAsync(image);
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
      setUploading(false);
      Alert.alert('Image uploaded successfully', url);
      console.log('image url', url)
      setImage(null)
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  }
  
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
            <Text style={styles.textInput}>Pick an image</Text>
          </TouchableOpacity>
          {image && (
            <Image
              source={{ uri: image }}
              style={{ width: 200, height: 200 }}
            />
          )}
          <TouchableOpacity style={styles.textInput} onPress={uploadMedia}>
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