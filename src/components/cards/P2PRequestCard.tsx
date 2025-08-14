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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Screen } from '../../components/common/Screen';
import { useP2PAds } from '../../hooks/p2pAd/use-p2pAds';
import type { NavigationProp } from '../../types/navigation';
import type { P2PAd, P2PRequest } from '../../types/p2pads';
import type { UserProfile } from '../../services/firebase/firestore.service'
import { useAppSelector } from '../../store/hooks';
import { Button } from '../../components/common/Button';
import { RedButton } from '../../components/common/RedButton';
import { styles } from '../../screens/p2pads/P2PAdsScreen';
import { useChats } from '../../hooks/chat/use-chats';
import { useUser } from '../../hooks/user/use-user';
import { useMessages } from '../../hooks/chat/use-messages';
import { launchImagePicker, openCamera, uploadImageAsync } from "../../screens/ads/imagePickerHelper";

interface P2PRequestFormProps {
    ad: P2PRequest & UserProfile;
    handleRefresh: () => void;
    // complete: boolean;
    // setComplete: (state: boolean) => void;
    // setReRender: (state: boolean) => void; // any function
}

// export default function P2PRequestCard({ ad, handleRefresh, complete, setComplete }: P2PRequestFormProps) {
// export default function P2PRequestCard({ ad, handleRefresh, setReRender }: P2PRequestFormProps) {
export default function P2PRequestCard({ ad, handleRefresh }: P2PRequestFormProps) {
    const [complete, setComplete] = React.useState<boolean>(false);
    const [tempImageUri, setTempImageUri] = React.useState<string | null>(null);
    // const [isLoading, setIsLoading] = React.useState(false);
    const [isCompleting, setIsCompleting] = React.useState(false);
    const user = useAppSelector((state) => state.auth.user);
    const { User } = useUser(user?.uid!);
    const User2 = useUser(ad.p2pCreatedBy);
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

    const uploadImageAndSendMessage = React.useCallback(async () => {
        // setIsLoading(true);

        try {
            if (tempImageUri) {
                const uploadUrl = await uploadImageAsync(tempImageUri, true);
                // setIsLoading(false);

                handleComplete(user?.uid!, ad.id, uploadUrl);

                setTimeout(() => setTempImageUri(null), 500);
            }
        } catch (error) {
            console.log(error);
        }
    }, [tempImageUri, user, navigation]);

    // complete request
    const handleComplete = async (uid: string, p2pRequestId: string, p2pPicture: string) => {
        try {
            setIsCompleting(true);
            const result = await completeP2PRequest(uid, p2pRequestId, p2pPicture);
            if (result.success) {
                //navigate to an chat
                sendMessage(p2pPicture);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setIsCompleting(false);
        }
    };

    // chat navigation
    const { createChat } = useChats(user?.uid!);
    const sendMessage = async (imageUrl: string) => {
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
            handleRefresh();
        }
    }

    // approve request
    const handleApproveP2PRequest = async (uid: string, p2pRequestId: string) => {
        const result = await approveP2PRequest(uid, p2pRequestId);
        if (result.success) {
            console.log('Request approved successfully');
            // refreshP2PAdsWithUsers();
            // refreshP2PRequestsWithUsers();
            handleRefresh();
        }
    }

    // approve request
    const handleRejectP2PRequest = async (uid: string, p2pRequestId: string) => {
        const result = await rejectP2PRequest(uid, p2pRequestId);
        if (result.success) {
            console.log('Request rejected successfully');
            // refreshP2PAdsWithUsers();
            // refreshP2PRequestsWithUsers();
            handleRefresh();
        }
    }

    return (
        <>
            {!complete && <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={isLoadingP2PRequestsWithUsers}
                        onRefresh={handleRefresh}
                        tintColor="white"
                    />
                }
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 20,
                        paddingVertical: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: 'rgba(255, 255, 255, 0.1)',
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
                                color: '#FFFFFF',
                                fontSize: 16,
                                fontWeight: 'bold',
                            }}>
                                {ad.username}
                            </Text>
                            <Text style={{
                                color: 'rgba(255, 255, 255, 0.6)',
                                fontSize: 12,
                            }}>
                                {ad.price} IQD
                            </Text>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: 4,
                        }}>
                            <Text style={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: 14,
                            }} numberOfLines={1}>
                                payment method
                            </Text>
                            <Text style={{
                                color: 'rgba(255, 255, 255, 0.8)',
                                fontSize: 14,
                            }} numberOfLines={1}>
                                {ad.amount} 💎
                            </Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            {(ad.createdBy === user?.uid) && <>
                                <Button
                                    title="Complete"
                                    onPress={() => {
                                        setComplete(true);
                                        // setReRender(true); //to re render ads screen
                                    }}
                                    // onPress={() => handleComplete(user.uid, ad.id, 'ad picture')}
                                    loading={false}
                                    disabled={false}
                                    size='small'
                                />
                                <RedButton
                                    title="Cancel"
                                    onPress={() => handleCancelP2PRequest(user.uid, ad.id)}
                                    loading={false}
                                    disabled={false}
                                    size='small'
                                /></>}
                            {(ad.p2pCreatedBy === user?.uid) && <>
                                <Button
                                    title="Approve"
                                    onPress={() => handleApproveP2PRequest(user.uid, ad.id)}
                                    loading={false}
                                    disabled={!ad.isCompleted}
                                    size='small'
                                />
                                <RedButton
                                    title="Reject"
                                    onPress={() => handleRejectP2PRequest(user.uid, ad.id)}
                                    loading={false}
                                    disabled={false}
                                    size='small'
                                /></>}
                        </View>
                    </View>
                </View>
            </ScrollView>}
            {complete && <View style={{
                flex: 1,
                paddingHorizontal: 20,
                paddingVertical: 16,
                borderBottomWidth: 1,
                borderBottomColor: 'rgba(255, 255, 255, 0.1)',
            }}>
                <View style={{
                    // flexDirection: 'row',
                    // justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: 4,
                }}>
                    {/* <Text style={{
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: 14,
                    }} numberOfLines={1}>
                        I'll show image here
                    </Text> */}

                    {/* image */}
                    {tempImageUri && (
                        <Image
                            // source={{ uri: image }}
                            source={{ uri: tempImageUri }}
                            // style={{ width: 300, height: 300, alignItems: 'center' }}
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
                        // onPress={() => setComplete(true)}
                        // onPress={() => handleComplete(user?.uid!, ad.id, 'ad picture')}
                        onPress={() => pickImage()}
                        loading={false}
                        disabled={false}
                        size='small'
                    />}
                    {(tempImageUri != null) && <Button
                        // title="complete"
                        title={isCompleting ? 'Completing...' : 'complete request'}
                        // onPress={() => setComplete(true)}
                        onPress={() => uploadImageAndSendMessage()}
                        // onPress={() => pickImage()}
                        loading={false}
                        disabled={tempImageUri === null}
                        size='small'
                    />}
                    <RedButton
                        title="cancel"
                        onPress={() => {
                            setComplete(false);
                            setTempImageUri(null);
                            // setReRender(false); //to re render ads screen
                        }}
                        loading={false}
                        disabled={false}
                        size='small'
                    />
                </View>
            </View>}
        </>
    );
}
