import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
  Image,
  SectionList,
  // Button
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { useP2PAds } from '../../hooks/p2pAd/use-p2pAds';
// import { useAuth } from '../../hooks/auth/use-auth';
import type { NavigationProp } from '../../types/navigation';
import type { P2PAd, P2PRequest } from '../../types/p2pads';
import type { UserProfile } from '../../services/firebase/firestore.service'
import { useAppSelector } from '../../store/hooks';
import { Button } from '../../components/common/Button';
import { RedButton } from '../../components/common/RedButton';
import P2PRequestCard from '../../components/cards/P2PRequestCard'
import BottomSheet, { BottomSheetView, BottomSheetBackdrop, BottomSheetFooter } from "@gorhom/bottom-sheet";

interface P2PAdsSection {
  title: string;
  // data: (P2PAd & UserProfile)[];
  data: ((P2PAd & UserProfile) | (P2PRequest & UserProfile))[];
  type: 'p2pRequests' | 'p2pAds';
}

export function P2PAdsScreen() {
  // const [complete, setComplete] = React.useState<boolean>(false);
  // const [reRender, setReRender] = React.useState<boolean>(false);
  const user = useAppSelector((state) => state.auth.user);
  const navigation = useNavigation<NavigationProp>();
  const {
    p2pAdsWithUsers,
    isLoadingP2PAdsWithUsers,
    p2pAdsWithUsersError,
    refreshP2PAdsWithUsers,
    p2pRequestsWithUsers,
    isLoadingP2PRequestsWithUsers,
    p2pRequestsWithUsersError,
    refreshP2PRequestsWithUsers,
    completeP2PRequest,
    approveP2PRequest,
    cancelP2PRequest,
    rejectP2PRequest,
  } = useP2PAds();
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = React.useMemo(() => ["25%", "50%", "75%"], []);
  const [p2pRequest, setP2PRequest] = React.useState<(P2PRequest & UserProfile) | null>(null);

  const showBottomSheet = React.useCallback((adRequest: P2PRequest & UserProfile) => {
    setP2PRequest(adRequest);
    bottomSheetRef.current?.expand();
  }, []);

const renderBackdrop = React.useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1} // Hides backdrop when sheet is fully closed
        appearsOnIndex={0}    // Shows backdrop when sheet is at index 0 or higher
        pressBehavior="close" // Closes the bottom sheet when backdrop is pressed
      />
    ),
    []
  );

  const handleSheetChanges = React.useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const handleCreateP2PAdPress = () => {
    navigation.navigate('P2PCreateAd' as never); //ayad
  }

  // handle refresh
  const handleRefresh = async () => {
    try {
      await refreshP2PAdsWithUsers();
      await refreshP2PRequestsWithUsers();
    } catch (error) {
      console.error('Error refreshing p2p ads:', error);
    }
  }

  // handle p2p ad pree
  const handleAdPress = (p2pAdWithUser: P2PAd & UserProfile) => {
    navigation.navigate('P2PCreateRequest', p2pAdWithUser);
  }

  // Prepare sections data
  const sections: P2PAdsSection[] = [];
  if (p2pRequestsWithUsers.length > 0) {
    sections.push({
      title: 'P2P Requests',
      data: p2pRequestsWithUsers,
      type: 'p2pRequests',
    });
  }
  if (p2pAdsWithUsers.length > 0) {
    sections.push({
      title: 'P2P Ads',
      data: p2pAdsWithUsers,
      type: 'p2pAds',
    });
  }

  const renderSectionHeader = ({ section }: { section: P2PAdsSection }) => (
    <View style={{
      paddingHorizontal: 20,
      paddingVertical: 12,
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(0, 0, 0, 0.06)',
    }}>
      <Text style={{
        color: 'rgba(0, 0, 0, 0.75)',
        fontSize: 14,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
      }}>
        {section.title}
      </Text>
    </View>
  );

  const renderP2PItem = (item: (P2PAd & UserProfile) | (P2PRequest & UserProfile), type: 'p2pAds' | 'p2pRequests') => {
    if (type === 'p2pRequests') {
      const ad = item as P2PRequest & UserProfile;
      if (
        (ad.createdBy != user?.uid) && (ad.p2pCreatedBy != user?.uid) ||
        (ad.isCanceled === true) || (ad.isCompleted === true) ||
        ((ad.isRejected === true) || (ad.isApproved === true) && (ad.p2pCreatedBy === user?.uid))
      ) {
        return (null);
      }
      return (
        <P2PRequestCard ad={ad} handleRefresh={handleRefresh} showBottomSheet={showBottomSheet} />
      );
    } else {
      const ad = item as P2PAd & UserProfile;
      return (
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoadingP2PAdsWithUsers}
              onRefresh={handleRefresh}
              tintColor="Black"
            />
          }
        >
          <View>
            {/* {p2pAdsWithUsers.map((ad) => ( */}
            <TouchableOpacity
              onPress={() => handleAdPress(ad)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(0, 0, 0, 0.1)',
              }}
            >
              <View style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
              }}>
                <Image
                  source={{ uri: ad.profilePicture || 'https://firebasestorage.googleapis.com/v0/b/snap-clone-2b5a1.firebasestorage.app/o/images%2F9k%3D?alt=media&token=bbd617c3-f983-44ce-b633-8562ae1cb9f0' }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>

              <View style={{ flex: 1 }}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 4,
                }}>
                  <Text style={{
                    color: '#000000',
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                    {ad.username}   {(Math.round(((ad.requests! - ad.approvedRequests!) / ad.requests!) * 100) / 100) * 100} %
                  </Text>
                  <Text style={{
                    color: 'rgba(0, 0, 0, 0.75)',
                    fontSize: 12,
                  }}>
                    {ad.price} IQD
                  </Text>
                </View>

                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                  <Text style={{
                    color: 'rgba(0, 0, 0, 0.7)',
                    fontSize: 14,
                  }} numberOfLines={1}>
                    {ad.paymentMethod}  {ad.requests!}
                  </Text>
                  <Text style={{
                    color: 'rgba(0, 0, 0, 0.7)',
                    fontSize: 14,
                  }} numberOfLines={1}>
                    {ad.amount} 💎
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            {/* ))} */}
          </View>
        </ScrollView>
      );
    }
  }

  return (
    <Screen backgroundColor="#FFFFFF" statusBarStyle="light-content">
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>P2P Ads</Text>
            <Text style={styles.subtitle}>
              {/* {p2pAds.length} {p2pAds.length === 1 ? 'ad' : 'ads'} */}
              {p2pAdsWithUsers.length} {p2pAdsWithUsers.length === 1 ? 'ad' : 'ads'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleCreateP2PAdPress}
          >
            {/* <Ionicons name="person-add" size={24} color="white" /> */}
            <Entypo name="add-to-list" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Error State */}
        {/* {p2pAdsError && ( */}
        {(p2pAdsWithUsersError || p2pRequestsWithUsersError) && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={24} color="#FF3B30" />
            {/* <Text style={styles.errorText}>{p2pAdsError}</Text> */}
            <Text style={styles.errorText}>{p2pAdsWithUsersError}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={handleRefresh}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderSectionHeader={renderSectionHeader}
          renderItem={({ item, section }) => renderP2PItem(item, section.type)}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
        />
      </View>

      <BottomSheet
        snapPoints={snapPoints}
        index={-1}
        backdropComponent={renderBackdrop}
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
      >
        <BottomSheetView style={{
          flex: 1,
        }}>
          <Text>{p2pRequest?.username || 'Unknown User'}</Text>
        </BottomSheetView>
      </BottomSheet>
    </Screen>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'Black',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.75)',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 132, 255, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 132, 255, 0.3)',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 59, 48, 0.2)',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
    alignItems: 'center',
    marginBottom: 16,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 8,
  },
  retryButton: {
    backgroundColor: 'rgba(255, 59, 48, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  retryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  image: {
    height: 60,
    width: 60,
    borderRadius: '100%', // This will make it a circle
  },
}); 
