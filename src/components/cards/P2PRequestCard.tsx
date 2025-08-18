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
import { launchImagePicker, uploadImageAsync } from "../../screens/ads/imagePickerHelper";
import { Timestamp } from 'firebase/firestore';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop, BottomSheetFooter } from "@gorhom/bottom-sheet";

interface P2PRequestFormProps {
    ad: P2PRequest & UserProfile;
    handleRefresh: () => void;
    showBottomSheet: (adRequest: P2PRequest & UserProfile) => void;
    setComplete?: React.Dispatch<React.SetStateAction<boolean>>;
    complete?: boolean;
}

// export default function P2PRequestCard({ ad, handleRefresh, complete, setComplete }: P2PRequestFormProps) {
// export default function P2PRequestCard({ ad, handleRefresh, setReRender }: P2PRequestFormProps) {
export default function P2PRequestCard({ ad, handleRefresh, showBottomSheet }: P2PRequestFormProps) {
    const [complete, setComplete] = React.useState<boolean>(false);
    const [tempImageUri, setTempImageUri] = React.useState<string | null>(null);
    // const [isLoading, setIsLoading] = React.useState(false);
    const [isCompleting, setIsCompleting] = React.useState(false);
    const [time, setTime] = React.useState<number>(0);
    // const [isDisabled, setIsDisabled] = React.useState<boolean>(false);
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
    // const bottomSheetRef = React.useRef<BottomSheet>(null);
    // const snapPoints = React.useMemo(() => ["25%", "50%", "75%"], []);

    // const showBottomSheet = React.useCallback(() => {
    //     bottomSheetRef.current?.expand();
    //   }, []);

    // const renderBackdrop = React.useCallback(
    //     (props: any) => (
    //       <BottomSheetBackdrop
    //         {...props}
    //         disappearsOnIndex={-1} // Hides backdrop when sheet is fully closed
    //         appearsOnIndex={0}    // Shows backdrop when sheet is at index 0 or higher
    //         pressBehavior="close" // Closes the bottom sheet when backdrop is pressed
    //       />
    //     ),
    //     []
    //   );

    //   const handleSheetChanges = React.useCallback((index: number) => {
    //     console.log("handleSheetChanges", index);
    //   }, []);

    //set time
    React.useEffect(() => {
        setTimeout(() => {
            const expiresAt = ad?.expiresAt.toMillis();
            const timeDiff = expiresAt - Timestamp.now().toMillis();
            setTime(timeDiff);
        }, 1000);
        //set is desable
        if ((ad?.expiresAt.toMillis() - Timestamp.now().toMillis()) > 0) {
            // setIsDisabled(true);
        } else {
            // setIsDisabled(false);
        }
    }, [time, ad?.expiresAt]);

    const getFormattedTime = (milliSeconds: number) => {
        const seconds = Math.floor((milliSeconds / 1000) % 60);
        const minutes = Math.floor((milliSeconds / (1000 * 60)) % 60);
        const hours = Math.floor((milliSeconds / (1000 * 60 * 60)) % 24);
        if (time < 0) {
            return '0:0:0';
        }
        return `${hours}: ${minutes}: ${seconds}`;
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

    const uploadImageAndSendMessage = React.useCallback(async () => {
        // setIsLoading(true);

        try {
            if (tempImageUri) {
                const uploadUrl = await uploadImageAsync(tempImageUri, true);
                // setIsLoading(false);
                handleComplete(user?.uid!, ad.id, uploadUrl);
                handleRefresh();
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
            {!complete && <View
                style={styles.scrollView}
            >
                <TouchableOpacity
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 20,
                        paddingVertical: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
                    }}
                    onPress={() => showBottomSheet(ad)}
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
                                {ad.username}
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
                            marginBottom: 4,
                        }}>
                            <Text style={{
                                color: 'rgba(0, 0, 0, 0.7)',
                                fontSize: 14,
                            }} numberOfLines={1}>
                                {getFormattedTime(time)}
                            </Text>
                            <Text style={{
                                color: 'rgba(0, 0, 0, 0.7)',
                                fontSize: 14,
                            }} numberOfLines={1}>
                                {ad.amount} 💎
                            </Text>
                        </View>
                        {/* <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            {<>
                                <Button
                                    title={(ad.createdBy === user?.uid) ? 'Complete' : 'Approve'}
                                    onPress={() => {
                                        (ad.createdBy === user?.uid) ? setComplete(true) : handleApproveP2PRequest(user?.uid!, ad.id);
                                    }}
                                    loading={false}
                                    disabled={(ad.createdBy === user?.uid) ? ad?.isExpired : !ad.isCompleted}
                                    size='small'
                                />
                                <RedButton
                                    title={(ad.createdBy === user?.uid) ? "Cancel" : "Reject"}
                                    onPress={() => {
                                        (ad.createdBy === user?.uid) ? handleCancelP2PRequest(user.uid, ad.id) : handleRejectP2PRequest(user?.uid!, ad.id);
                                    }}
                                    loading={false}
                                    disabled={false}
                                    size='small'
                                />
                            </>}
                        </View> */}
                    </View>
                </TouchableOpacity>
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
                        onPress={() => uploadImageAndSendMessage()}
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
        </>
    );
}
