import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { Screen } from '../../components/common/Screen';
import { Button } from '../../components/common/Button';
import { UserCard } from '../../components/friends/UserCard';
import { useFriends } from '../../hooks/friends/use-friends';
import { useGroups } from '../../hooks/chat/use-groups';
import { type UserProfile } from '../../services/firebase/firestore.service';
import type { RootState } from '../../store';
import type { NavigationProp } from '../../types/navigation';
import i18n from '../../language/i18n';

interface SelectedFriend {
  uid: string;
  username: string;
}

export default function CreateGroupScreen() {
  const navigation = useNavigation<NavigationProp>();
  const user = useSelector((state: RootState) => state.auth.user);

  const { friends, isLoadingFriends } = useFriends();
  const { createNewGroup } = useGroups(user?.uid || '');

  const [groupName, setGroupName] = useState('');
  const [selectedFriends, setSelectedFriends] = useState<SelectedFriend[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  /**
   * Toggle friend selection
   */
  const toggleFriendSelection = useCallback((friend: { uid: string; username: string }) => {
    setSelectedFriends(prev => {
      const isSelected = prev.some(f => f.uid === friend.uid);
      if (isSelected) {
        return prev.filter(f => f.uid !== friend.uid);
      } else {
        return [...prev, friend];
      }
    });
  }, []);

  /**
   * Check if a friend is selected
   */
  const isFriendSelected = useCallback((friendId: string): boolean => {
    return selectedFriends.some(f => f.uid === friendId);
  }, [selectedFriends]);

  /**
   * Handle group creation
   */
  const handleCreateGroup = useCallback(async () => {
    if (!groupName.trim()) {
      Alert.alert(i18n.t('groupNameRequired'), i18n.t('pleaseEnterANameForYourGroup'));
      return;
    }

    if (selectedFriends.length === 0) {
      Alert.alert(i18n.t('selectFriends'), i18n.t('pleaseSelectAtLeastOneFriendToAddToTheGroup'));
      return;
    }

    if (!user) return;

    setIsCreating(true);

    try {
      const groupId = await createNewGroup({
        name: groupName.trim(),
        participants: selectedFriends.map(f => f.uid),
      });

      Alert.alert(
        i18n.t('groupCreated'),
        `"${groupName}" ${i18n.t('hasBeenCreatedSuccessfully')}`,
        [
          {
            text: i18n.t('ok'),
            onPress: () => {
              // Navigate to the new group chat
              navigation.navigate('GroupChat', { groupId });
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert(
        i18n.t('error'),
        i18n.t('failedToCreateGroup'),
        [{ text: i18n.t('ok') }]
      );
    } finally {
      setIsCreating(false);
    }
  }, [groupName, selectedFriends, user, createNewGroup, navigation]);

  /**
   * Render friend item with selection checkbox
   */
  const renderFriendItem = useCallback(({ item }: { item: UserProfile }) => {
    const isSelected = isFriendSelected(item.uid);

    return (
      <TouchableOpacity
        style={styles.friendItem}
        onPress={() => toggleFriendSelection(item)}
      >
        <View style={styles.friendInfo}>
          <UserCard user={item} />
        </View>
        <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
          {isSelected && (
            <Ionicons name="checkmark" size={16} color="#FFFFFF" />
          )}
        </View>
      </TouchableOpacity>
    );
  }, [isFriendSelected, toggleFriendSelection]);

  /**
   * Render selected friends count
   */
  const renderSelectedCount = () => {
    if (selectedFriends.length === 0) return null;

    return (
      <View style={styles.selectedContainer}>
        <Text style={styles.selectedText}>
          {selectedFriends.length} {selectedFriends.length !== 1 ? i18n.t('friendsSelected') : i18n.t('friendSelected')}
        </Text>
      </View>
    );
  };

  return (
    <Screen keyboardAvoidingView={true}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{i18n.t('createGroup')}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* Group Name Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{i18n.t('groupName')}</Text>
        <TextInput
          style={styles.textInput}
          value={groupName}
          onChangeText={setGroupName}
          placeholder={i18n.t('enterGroupName')}
          placeholderTextColor="#AAAAAA"
          maxLength={50}
        />
      </View>

      {/* Selected Friends Count */}
      {renderSelectedCount()}

      {/* Friends List */}
      <View style={styles.friendsContainer}>
        <Text style={styles.sectionTitle}>{i18n.t('selectFriends')}</Text>

        {isLoadingFriends ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>{i18n.t('loadingFriends')}</Text>
          </View>
        ) : friends.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>{i18n.t('noFriendsFound')}</Text>
            <Text style={styles.emptySubtext}>{i18n.t('addFriendsToCreateGroupChats')}</Text>
          </View>
        ) : (
          <FlatList
            data={friends}
            renderItem={renderFriendItem}
            keyExtractor={(item) => item.uid}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.friendsList}
          />
        )}
      </View>

      {/* Create Button */}
      <View style={styles.buttonContainer}>
        <Button
          title={isCreating ? i18n.t('creating') : i18n.t('createGroup')}
          onPress={handleCreateGroup}
          disabled={isCreating || !groupName.trim() || selectedFriends.length === 0}
          style={styles.createButton}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    // fontWeight: 'bold',
    fontWeight: 500,
    color: '#000000',
    textAlign: 'left',
  },
  headerSpacer: {
    width: 40,
  },
  inputContainer: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#000000',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.7)',
  },
  selectedContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  selectedText: {
    fontSize: 14,
    color: '#0084FF',
    fontWeight: '500',
  },
  friendsContainer: {
    flex: 1,
    paddingTop: 16,
    backgroundColor: 'rgba(255, 255, 255, 1)',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
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
    borderColor: 'rgba(0, 0, 0, 0.75)',
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
    color: '#000000',
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
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  createButton: {
    // backgroundColor: '#0084FF',
    // marginTop: 16,
  },
}); 