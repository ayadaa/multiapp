import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { UpdateProfileForm } from '../../components/forms/UpdateProfileForm';
import { UserProfile } from '../../services/firebase/firestore.service';
import type { AppStackParamList } from '../../types/navigation';
import { type StackNavigationProp } from '@react-navigation/stack';

type UpdateProfileScreenRouteProp = RouteProp<AppStackParamList, 'UpdateProfile'>;
type UpdateProfileScreenNavigationProp = StackNavigationProp<AppStackParamList, 'UpdateProfile'>;

export function UpdateProfileScreen() {
  const route = useRoute<UpdateProfileScreenRouteProp>();
  const navigation = useNavigation<UpdateProfileScreenNavigationProp>();
  const User = route.params;

  const handleSignupSuccess = () => {
    console.log('Update successful - navigating to profile page');
    navigation.navigate('Profile');
  };

  return (
    <Screen keyboardAvoidingView={true}>
      <View style={{ flex: 1, padding: 16 }}>

        {/* Profile Form */}
        <UpdateProfileForm
          User={User}
          onSuccess={handleSignupSuccess}
        />
      </View>
    </Screen>
  );
} 
