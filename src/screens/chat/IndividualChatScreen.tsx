import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet, Button, Image, Dimensions } from 'react-native';
import { useRoute, useNavigation, type RouteProp } from '@react-navigation/native';
import { type StackNavigationProp } from '@react-navigation/stack';
import { Screen } from '../../components/common/Screen';
import { MessageBubble } from '../../components/chat/MessageBubble';
import { ChatInput } from '../../components/chat/ChatInput';
import { ChatInputSheet } from '../../components/chat/ChatInputSheet';
import { useMessages } from '../../hooks/chat/use-messages';
import { useAuth } from '../../hooks/auth/use-auth';
import { getUserProfile, type UserProfile } from '../../services/firebase/firestore.service';
import { type Message } from '../../services/firebase/firestore.service';
import { Ionicons } from '@expo/vector-icons'; //ayad
import BottomSheet, { BottomSheetView, BottomSheetBackdrop, BottomSheetFooter } from "@gorhom/bottom-sheet";
// import { useSafeAreaInsets } from "react-native-safe-area-context";
// import { Text as Text2, View as View2 } from "./bottomSheet/Themed";
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { launchImagePicker, uploadImageAsync } from "../../screens/ads/imagePickerHelper";
// import { ChattingScreenHeaderComponent } from "../../components/chat/ChatScreenHeader";
// import socket from "../../utils/socket";

type ChatStackParamList = {
  IndividualChat: {
    chatId: string;
    otherUser: UserProfile;
    imageUrl?: string;
    message?: string; //ayad
  };
};

type IndividualChatScreenRouteProp = RouteProp<ChatStackParamList, 'IndividualChat'>;
type IndividualChatScreenNavigationProp = StackNavigationProp<ChatStackParamList, 'IndividualChat'>;

const { width } = Dimensions.get('window');

/**
 * Individual chat screen for one-on-one messaging.
 * Features real-time messaging, message status indicators, and glassmorphic UI.
 */
export function IndividualChatScreen() {
  const route = useRoute<IndividualChatScreenRouteProp>();
  const navigation = useNavigation<IndividualChatScreenNavigationProp>();
  const navigation2 = useNavigation<any>();
  const { user } = useAuth();
  const flatListRef = useRef<FlatList<Message>>(null);
  const [messageSent, setMessageSent] = useState<boolean>(false);
  const [tempImageUri, setTempImageUri] = React.useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(false);
  // const insets = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);

  const { chatId, otherUser, imageUrl, message } = route.params;
  const currentUserId = user?.uid || '';

  const {
    messages,
    loading,
    error,
    sending,
    sendTextMessage,
    sendTextWithImageMessage,
    markAsRead,
  } = useMessages(chatId, currentUserId);

  const showBottomSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const renderBackdrop = useCallback(
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

  // webRTC
  // useEffect(() => {
  //   // socket.on("receive_message", (data) => {
  //   //   setMessages((prev) => [data, ...prev]);
  //   // });

  //   // Check connection status
  //   setIsOnline(socket.connected);

  //   socket.on("connect", () => {
  //     console.log("✅ Connected to socket server!", socket.id);
  //     setIsOnline(true);
  //   });

  //   socket.on("disconnect", () => {
  //     console.log("🔴 Disconnected from socket server.");
  //     setIsOnline(false);
  //   });

  //   // Listen for incoming calls
  //   const incomingCallHandler = ({ callType, caller }: any) => {
  //     console.log("Incoming call received", caller, callType);
  //     // Navigate to incoming call screen
  //     navigation2.navigate("IncomingCall", {
  //       caller,
  //       callType,
  //     });
  //   };

  //   socket.on("incoming_call", incomingCallHandler);

  //   return () => {
  //     // Just remove listeners but don't disconnect
  //     // socket.off("receive_message");
  //     socket.off("connect");
  //     socket.off("disconnect");
  //     socket.off("incoming_call", incomingCallHandler);
  //   };
  // }, [navigation]);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  // image picker
  // const pickImage = React.useCallback(async () => {
  //   try {
  //     const tempUri = await launchImagePicker();
  //     if (!tempUri) return;

  //     setTempImageUri(tempUri);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, [tempImageUri]);

  // image picker and then show bottom sheet
  const pickImageAndShowBottomSheet = React.useCallback(async () => {
    try {
      const tempUri = await launchImagePicker();
      if (!tempUri) return;
      setTempImageUri(tempUri);
      showBottomSheet();
    } catch (error) {
      console.log(error);
    }
  }, [tempImageUri]);

  const handleSendMessageWithImage2 = async (text: string) => {
    try {
      if (tempImageUri) {
        const imageUrl = await uploadImageAsync(tempImageUri, true);
        await sendTextWithImageMessage(imageUrl, text);
        setTimeout(() => setTempImageUri(null), 500);
        // close bottom sheet
        bottomSheetRef.current?.close();
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send message text with image. Please try again.');
    }
  };

  // Mark messages as read when screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      markAsRead();
    });

    return unsubscribe;
  }, [navigation, markAsRead]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages.length]);

  const handleSendMessage = async (text: string) => {
    try {
      await sendTextMessage(text);
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const handleSendMessageWithImage = async (imageUrl: string, text: string) => {
    try {
      await sendTextWithImageMessage(imageUrl, text);
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  // send p2p request message
  useEffect(() => {
    if (message && !imageUrl && !messageSent) {
      handleSendMessage(message);
      setMessageSent(true);
    }
  }, [message])

  // send p2p request complete message
  useEffect(() => {
    if (message && imageUrl && !messageSent) {
      handleSendMessageWithImage(imageUrl, message);
      setMessageSent(true);
    }
  }, [message, imageUrl])

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble
      message={item}
      isCurrentUser={item.senderId === currentUserId}
      chatType="individual"
    />
  );

  const renderHeader = (isOnline: boolean, user: UserProfile) => (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
      }}
    >
      <TouchableOpacity
        style={styles.headerBackButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#000000" />
      </TouchableOpacity>

      {otherUser?.profilePicture ? <View style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        overflow: "hidden",
      }}>
        <Image
          source={{ uri: otherUser?.profilePicture }}
          style={{ height: 50, width: 50 }}
          resizeMode="cover"
        />
      </View>
        : <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: 'rgba(0, 132, 255, 0.8)',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}>
          <Text style={{ fontSize: 18, color: '#000000' }}>
            {otherUser?.username?.charAt(0).toUpperCase() || '?'}
          </Text>
        </View>
      }

      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: '#000000',
            fontSize: 18,
            fontWeight: 'bold',
          }}
        >
          {otherUser?.username || 'Unknown User'}
        </Text>
        {/* <Text
          style={{
            color: 'rgba(0, 0, 0, 0.6)',
            fontSize: 14,
          }}
        >
          {otherUser?.isOnline ? 'Online' : 'Offline'}
        </Text> */}
      </View>
    </View>

    // <ChattingScreenHeaderComponent isOnline={isOnline} user={user} />
  );

  const renderEmptyState = () => (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
      }}
    >
      <Text
        style={{
          color: 'rgba(0, 0, 0, 0.6)',
          fontSize: 16,
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        💬
      </Text>
      <Text
        style={{
          color: 'rgba(0, 0, 0, 0.6)',
          fontSize: 16,
          textAlign: 'center',
          marginBottom: 4,
        }}
      >
        Start a conversation with {otherUser?.username || 'this user'}
      </Text>
      <Text
        style={{
          color: 'rgba(0, 0, 0, 0.4)',
          fontSize: 14,
          textAlign: 'center',
        }}
      >
        Send a message to get started
      </Text>
    </View>
  );

  if (error) {
    return (
      <Screen backgroundColor="#FFFFFF" statusBarStyle="light-content">
        {renderHeader(isOnline, otherUser)}
        <View
          style={{
            // flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 40,
          }}
        >
          <Text
            style={{
              color: '#FF4444',
              fontSize: 16,
              textAlign: 'center',
              marginBottom: 16,
            }}
          >
            Failed to load messages
          </Text>
          <Text
            style={{
              color: 'rgba(0, 0, 0, 0.6)',
              fontSize: 14,
              textAlign: 'center',
            }}
          >
            {error}
          </Text>
        </View>
      </Screen>
    );
  }

  // const renderBottomSheetFooter = useCallback(
  //   (props: any) => (
  //     <BottomSheetFooter {...props}>
  //       {/* <View style={{ flex: 1 }}> */}
  //       <ChatInputSheet
  //         // imageUri={imageUri}
  //         onSendMessageWithImage={handleSendMessageWithImage2}
  //         sending={sending}
  //         placeholder={`Message ${otherUser?.username || 'user'}...`}
  //       />
  //       {/* </View> */}
  //     </BottomSheetFooter>
  //   ),
  //   []
  // );

  return (
    <>
      {/* <View2 style={{ flex: 1, marginBottom: insets.bottom }}> */}
      <Screen backgroundColor="#FFFFFF" statusBarStyle="dark-content" keyboardAvoidingView={true} style={styles.container}>
        {renderHeader(isOnline, otherUser)}
        <View style={{ flex: 1 }}>
          {loading ? (
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: 16 }}>
                Loading messages...
              </Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessage}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{
                flexGrow: 1,
                paddingVertical: 16,
              }}
              ListEmptyComponent={renderEmptyState}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => {
                if (messages.length > 0) {
                  flatListRef.current?.scrollToEnd({ animated: false });
                }
              }}
            />
          )}
        </View>
        <ChatInput
          onSendMessage={handleSendMessage}
          onPickImageAndShowBottomSheet={pickImageAndShowBottomSheet}
          sending={sending}
          placeholder={`Message ${otherUser?.username || 'user'}...`}
        />
        {/* <Button onPress={showBottomSheet} title='ahow bottom seet' /> */}

        <BottomSheet
          snapPoints={snapPoints}
          index={-1}
          backdropComponent={renderBackdrop}
          ref={bottomSheetRef}
          onChange={handleSheetChanges}
        // footerComponent={renderBottomSheetFooter}
        >
          <BottomSheetView style={{
            flex: 1,
          }}>
            {tempImageUri && (
              <Image
                source={{ uri: tempImageUri }}
                style={{ flex: 1, alignItems: 'center' }}
              />
            )}
            <ChatInputSheet
              onSendMessageWithImage={handleSendMessageWithImage2}
              sending={sending}
              placeholder={`Message ${otherUser?.username || 'user'}...`}
            />
          </BottomSheetView>
        </BottomSheet>
      </Screen>

      {/* <View style={styles.container}> */}
      {/* <BottomSheet
        snapPoints={snapPoints}
        index={-1}
        backdropComponent={renderBackdrop}
        ref={bottomSheetRef}
        onChange={handleSheetChanges}
        // footerComponent={renderBottomSheetFooter}
      >
        <BottomSheetView style={{
          flex: 1,
        }}>
          {tempImageUri && (
            <Image
              source={{ uri: tempImageUri }}
              style={{ flex: 1, alignItems: 'center' }}
            />
          )}
          <ChatInputSheet
            onSendMessageWithImage={handleSendMessageWithImage2}
            sending={sending}
            placeholder={`Message ${otherUser?.username || 'user'}...`}
          />
        </BottomSheetView>
      </BottomSheet> */}
      {/* </View> */}
      {/* </View2> */}
    </>
  );
}

// const insets = useSafeAreaInsets();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    // marginBottom: insets.bottom // for bottom sheet
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  headerBackButton: {
    padding: 8,
    marginRight: 8,
  },
  headerInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  onlineState: {
    fontSize: 12,
    color: '#AAAAAA',
    marginTop: 2,
  },
})