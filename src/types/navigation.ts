import type { NavigationProp as RNNavigationProp } from '@react-navigation/native';
import type { Ad } from './ads';

/**
 * Navigation parameter types for React Navigation.
 * Defines the structure of parameters passed between screens.
 * Ensures type safety when navigating throughout the app.
 */

export type AuthStackParamList = {
  Login: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
};

export type CameraStackParamList = {
  CameraCapture: undefined;
  SnapEditor: {
    mediaUri: string;
    mediaType: 'photo' | 'video';
  };
  SendTo: {
    originalMediaUri: string;
    compositeMediaUri: string;
    mediaType: 'photo' | 'video';
    duration: number;
    hasText?: boolean;
    hasDrawing?: boolean;
    textOverlays?: any[];
    drawingPaths?: any[];
  };
  HomeworkAnalysis: {
    imageUri: string;
    gradeLevel?: string;
  };
};

export type MainTabParamList = {
  Chat: undefined;
  Camera: undefined;
  Ads: undefined;
  CreateAdScreen: undefined;
  // Math: undefined;
  Friends: undefined;
  Stories: undefined;
  Profile: undefined;
};

export type AppStackParamList = {
  MainTabs: undefined;
  SnapViewer: {
    snapId: string;
    chatType?: 'individual' | 'group';
    senderId?: string;
  };
  IndividualChat: {
    chatId: string;
    username: string;
  };
  GroupChat: {
    groupId: string;
  };
  GroupSettings: {
    groupId: string;
  };
  CreateGroup: undefined;
  CreateAd: undefined;
  AdDetails: Ad;
  StoryViewer: {
    storyId: string;
    stories: Array<{
      id: string;
      username: string;
      snaps: Array<{
        snapId: string;
        storageUrl: string;
        mediaType: 'photo' | 'video';
        duration: number;
      }>;
    }>;
    initialIndex: number;
    isOwnStory?: boolean;
  };
  ChallengeViewer: {
    challengeSnapId: string;
    senderId: string;
  };
};

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

export type NavigationProp = RNNavigationProp<AppStackParamList>;

/**
 * Math Stack Parameter List
 */
export type MathStackParamList = {
  DefineMode: undefined;
  ConceptExplorer: undefined;
  HomeworkHelper: undefined;
  MathChallenge: undefined;
  MathHub: undefined;
  ChallengeViewer: undefined;
};

export type MathStackNavigationProp = RNNavigationProp<MathStackParamList>;

/**
 * Math Challenge related types
 */
export type MathChallengeData = {
  id: string;
  problem: string;
  concept: string;
  gradeLevel: string;
  solution?: string;
  createdBy: string;
  createdAt: number;
  difficulty: 'basic' | 'intermediate' | 'advanced';
};

export type ChallengeSnapData = {
  challengeId: string;
  problem: string;
  concept: string;
  timeLimit?: number;
  correctAnswer?: string;
  explanation?: string;
}; 
