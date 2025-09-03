import React from 'react';
import {
    View,
    StatusBar,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

interface ScreenProps {
  children: React.ReactNode;
  keyboardAvoidingView?: boolean;
}

export function Screen({children, keyboardAvoidingView = false}: ScreenProps) {
    const content = keyboardAvoidingView ? (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            // keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            {children}
        </KeyboardAvoidingView>
    ) : (
        children
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
            <StatusBar
                backgroundColor="white" // Set the background color to white
                barStyle="dark-content" // Set text/icons to dark for better visibility on a white background
            />
            {content}
        </View>
    );
}
