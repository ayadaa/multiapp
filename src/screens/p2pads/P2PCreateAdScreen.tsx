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
import { Picker } from '@react-native-picker/picker'; //ayad
import { classNameList, cityNameList } from '../../types/ads';
import { launchImagePicker, openCamera, uploadImageAsync } from "./imagePickerHelper";

export default function P2PCreateAdScreen() {
  const navigation = useNavigation<NavigationProp>();
  const user = useSelector((state: RootState) => state.auth.user);
  
  const { createNewAd, refreshAds } = useAds(user?.uid || '');
  
  const [adTitle, setAdTitle] = useState('');
  const [adDescription, setAdDescription] = useState('');
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