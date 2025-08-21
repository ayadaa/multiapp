import React, { use } from 'react';
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
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import { launchImagePicker, uploadImageAsync } from "../../screens/ads/imagePickerHelper";
import { useChats } from '../../hooks/chat/use-chats';
import { useUser } from '../../hooks/user/use-user';

interface P2PAdsSection {
  title: string;
  // data: (P2PAd & UserProfile)[];
  data: ((P2PAd & UserProfile) | (P2PRequest & UserProfile))[];
  type: 'p2pRequests' | 'p2pAds';
}

export function P2PAdsScreen() {
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
  const loading = isLoadingP2PAdsWithUsers || isLoadingP2PRequestsWithUsers;
  const error = p2pAdsWithUsersError || p2pRequestsWithUsersError;

  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = React.useMemo(() => ["25%", "50%", "75%"], []);
  const [p2pRequest, setP2PRequest] = React.useState<(P2PRequest & UserProfile) | null>(null);

  const [complete, setComplete] = React.useState<boolean>(false);
  const [tempImageUri, setTempImageUri] = React.useState<string | null>(null);
  const [isCompleting, setIsCompleting] = React.useState(false);
  const { User } = useUser(user?.uid!);
  const User2 = useUser(p2pRequest?.p2pCreatedBy!);

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
  const handleRefresh = async (uId: string) => {
    try {
      await refreshP2PAdsWithUsers();
      await refreshP2PRequestsWithUsers(uId);
    } catch (error) {
      console.error('Error refreshing p2p ads:', error);
    }
  }

  // handle p2p ad pree
  const handleAdPress = (p2pAdWithUser: P2PAd & UserProfile) => {
    navigation.navigate('P2PCreateRequest', p2pAdWithUser);
  }

  // image picker
  const pickImage = React.useCallback(async () => {
    try {
      const tempUri = await launchImagePicker();
      if (!tempUri) return;

      setTempImageUri(tempUri);
    } catch (error) {
      console.log(error);
    }
  }, [tempImageUri]);

  const uploadImageAndSendMessage = React.useCallback(async (ad: P2PRequest & UserProfile) => {
    // setIsLoading(true);

    try {
      if (tempImageUri) {
        const uploadUrl = await uploadImageAsync(tempImageUri, true);
        // setIsLoading(false);
        handleComplete(user?.uid!, ad, uploadUrl);
        handleRefresh(user?.uid!);
        setTimeout(() => setTempImageUri(null), 500);
      }
    } catch (error) {
      console.log(error);
    }
  }, [tempImageUri, user, navigation]);

  // complete request
  const handleComplete = async (uid: string, ad: P2PRequest & UserProfile, p2pPicture: string) => {
    try {
      setIsCompleting(true);
      const result = await completeP2PRequest(uid, ad.id, p2pPicture);
      if (result.success) {
        //navigate to an chat
        sendMessage(p2pPicture, ad);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setIsCompleting(false);
    }
  };

  // chat navigation
  const { createChat } = useChats(user?.uid!);
  const sendMessage = async (imageUrl: string, ad: P2PRequest & UserProfile) => {
    try {
      const chatId = await createChat(ad.p2pCreatedBy);
      const message = `Hello, I have been complete send for you an assets.`

      if (User) {
        (navigation as any).navigate('IndividualChat', {
          chatId,
          otherUser: User2.User,
          imageUrl: imageUrl,
          message: message, //ayad
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to start chat. Please try again.');
      console.error('Error creating chat:', error);
    }
  }

  // cancel request
  const handleCancelP2PRequest = async (uid: string, p2pRequestId: string) => {
    const result = await cancelP2PRequest(uid, p2pRequestId);
    if (result.success) {
      console.log('Request canceled successfully');
      // refreshP2PAdsWithUsers();
      // refreshP2PRequestsWithUsers();
      handleRefresh(uid);
      bottomSheetRef.current?.close();
    }
  }

  // approve request
  const handleApproveP2PRequest = async (uid: string, p2pRequestId: string) => {
    const result = await approveP2PRequest(uid, p2pRequestId);
    if (result.success) {
      console.log('Request approved successfully');
      // refreshP2PAdsWithUsers();
      // refreshP2PRequestsWithUsers();
      handleRefresh(uid);
      bottomSheetRef.current?.close();
    }
  }

  // approve request
  const handleRejectP2PRequest = async (uid: string, p2pRequestId: string) => {
    const result = await rejectP2PRequest(uid, p2pRequestId);
    if (result.success) {
      console.log('Request rejected successfully');
      // refreshP2PAdsWithUsers();
      // refreshP2PRequestsWithUsers();
      handleRefresh(uid);
      bottomSheetRef.current?.close();
    }
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
      return (
        <P2PRequestCard ad={ad} handleRefresh={() => handleRefresh(user?.uid!)} showBottomSheet={showBottomSheet} />
      );
    } else {
      const ad = item as P2PAd & UserProfile;
      return (
        <View
          style={styles.scrollView}
        >
          <View>
            <TouchableOpacity
              onPress={() => handleAdPress(ad)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(0, 0, 0, 0.1)',

                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                marginHorizontal: 16,
                marginVertical: 2,
                borderRadius: 16,
              }}
            >
              <View style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
                overflow: "hidden",
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
          </View>
        </View>
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
            {/* <Text style={styles.subtitle}>
              {p2pAdsWithUsers.length} {p2pAdsWithUsers.length === 1 ? 'ad' : 'ads'}
            </Text> */}
          </View>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleCreateP2PAdPress}
          >
            <Entypo name="add-to-list" size={24} color="white" />
          </TouchableOpacity>
        </View>
        {loading ? (
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <Text style={{ color: 'rgba(0, 0, 0, 0.75)', fontSize: 16 }}>
              Loading p2p ads...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={24} color="#FF3B30" />
            {/* <Text style={styles.errorText}>{p2pAdsError}</Text> */}
            <Text style={styles.errorText}>{p2pAdsWithUsersError}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => handleRefresh(user?.uid!)}
            >
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : sections.length === 0 ? (
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 40,
          }}>
            <Ionicons name="chatbubbles-outline" size={64} color="rgba(255, 255, 255, 0.3)" />
            <Text style={{
              color: '#000000',
              fontSize: 20,
              fontWeight: 'bold',
              marginTop: 16,
              marginBottom: 8,
              textAlign: 'center',
            }}>
              No chats yet
            </Text>
            <Text style={{
              color: 'rgba(0, 0, 0, 0.75)',
              fontSize: 16,
              textAlign: 'center',
              marginBottom: 24,
            }}>
              Start a conversation with friends or create a group chat
            </Text>

            <View style={{ flexDirection: 'row', gap: 16 }}>
              <TouchableOpacity
                onPress={handleCreateP2PAdPress}
                style={{
                  backgroundColor: 'rgba(0, 200, 100, 0.8)',
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 25,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Entypo name="add-to-list" size={24} color="white" />
                <Text style={{ color: '#000000', fontSize: 16, fontWeight: '600' }}>
                  Create p2p ad
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleCreateP2PAdPress}
                style={{
                  backgroundColor: 'rgba(0, 132, 255, 0.8)',
                  paddingHorizontal: 20,
                  paddingVertical: 12,
                  borderRadius: 25,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                <Ionicons name="search" size={20} color="#000000" />
                <Text style={{ color: '#000000', fontSize: 16, fontWeight: '600' }}>
                  Find Friends
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <SectionList
            sections={sections}
            keyExtractor={(item, index) => `${item.id}-${index}`}
            renderSectionHeader={renderSectionHeader}
            renderItem={({ item, section }) => renderP2PItem(item, section.type)}
            showsVerticalScrollIndicator={false}
            stickySectionHeadersEnabled={false}
            refreshControl={
              <RefreshControl
                refreshing={isLoadingP2PAdsWithUsers || isLoadingP2PRequestsWithUsers}
                onRefresh={() => handleRefresh(user?.uid!)}
                tintColor="Black"
              />
            }
          />)}
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
          {/* <Text>{p2pRequest?.username || 'Unknown User'}</Text> */}
          {!complete && <View>
            {(user?.uid === p2pRequest?.createdBy) && <TouchableOpacity style={styles.menuItem}
              onPress={() => setComplete(true)}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="shield-outline" size={20} color="rgba(0, 0, 0, 0.8)" />
                <Text style={styles.menuItemText}>Complete</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="rgba(0, 0, 0, 0.4)" />
            </TouchableOpacity>}
            {(user?.uid === p2pRequest?.createdBy) && <TouchableOpacity style={styles.menuItem}
              onPress={() => handleCancelP2PRequest(user?.uid!, p2pRequest?.id!)}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="shield-outline" size={20} color="rgba(0, 0, 0, 0.8)" />
                <Text style={styles.menuItemText}>Cancel request</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="rgba(0, 0, 0, 0.4)" />
            </TouchableOpacity>}
            {(user?.uid === p2pRequest?.p2pCreatedBy) && <TouchableOpacity style={styles.menuItem}
              onPress={() => handleApproveP2PRequest(user?.uid!, p2pRequest?.id!)}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="shield-outline" size={20} color="rgba(0, 0, 0, 0.8)" />
                <Text style={styles.menuItemText}>Approve</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="rgba(0, 0, 0, 0.4)" />
            </TouchableOpacity>}
            {(user?.uid === p2pRequest?.p2pCreatedBy) && <TouchableOpacity style={styles.menuItem}
              onPress={() => handleRejectP2PRequest(user?.uid!, p2pRequest?.id!)}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name="shield-outline" size={20} color="rgba(0, 0, 0, 0.8)" />
                <Text style={styles.menuItemText}>Reject</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="rgba(0, 0, 0, 0.4)" />
            </TouchableOpacity>}
          </View>}
          {complete && <View style={{
            flex: 1,
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0, 0, 0, 0.1)',
          }}>
            <View style={{
              alignItems: 'center',
              marginBottom: 4,
            }}>
              {tempImageUri && (
                <Image
                  source={{ uri: tempImageUri }}
                  style={{ width: 300, height: 300, maxWidth: 3000, maxHeight: 3000, alignItems: 'center' }}
                />
              )}
            </View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              {(tempImageUri === null) && <Button
                title="pick an Image"
                onPress={() => pickImage()}
                loading={false}
                disabled={false}
                size='small'
              />}
              {(tempImageUri != null) && <Button
                title={isCompleting ? 'Completing...' : 'complete request'}
                onPress={async () => {
                  await uploadImageAndSendMessage(p2pRequest!);
                  bottomSheetRef.current?.close();
                }}
                loading={false}
                disabled={tempImageUri === null}
                size='small'
              />}
              <RedButton
                title="cancel"
                onPress={() => {
                  setComplete(false);
                  setTempImageUri(null);
                }}
                loading={false}
                disabled={false}
                size='small'
              />
            </View>
          </View>}
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
    height: 50,
    width: 50,
    // borderRadius: '100%', // This will make it a circle
    // overflow: "hidden",
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    color: 'rgba(0, 0, 0, 0.8)',
    fontSize: 16,
    marginLeft: 12,
  },
}); 
