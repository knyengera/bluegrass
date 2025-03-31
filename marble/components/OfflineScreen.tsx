import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { VStack } from '@/components/ui/vstack';
import Icon from '@/components/Icon';

interface OfflineScreenProps {
  onRetry?: () => void;
}

export const OfflineScreen: React.FC<OfflineScreenProps> = ({ onRetry }) => {
  return (
    <View className="flex-1 bg-white items-center justify-center p-6">
      <VStack space="lg" className="items-center">
        <Icon name="WifiOff" size={64} color="#97af89" />
        <Text className="text-2xl font-bold text-marble-green text-center">
          No Internet Connection
        </Text>
        <Text className="text-gray-600 text-center">
          Please check your internet connection and try again
        </Text>
        {onRetry && (
          <Pressable
            className="bg-marble-green rounded-full px-8 py-4 mt-4"
            onPress={onRetry}
          >
            <Text className="text-white text-lg font-semibold">Retry</Text>
          </Pressable>
        )}
      </VStack>
    </View>
  );
}; 