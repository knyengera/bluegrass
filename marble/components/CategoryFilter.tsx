import React from 'react';
import { ScrollView, Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';
import { Box } from './ui/box';

type Category = {
  id: number;
  name: string;
  parentId: number;
  children: Category[];
};

type CategoryFilterProps = {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
};

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) {
  // Get the first level category (e.g. "Food")
  const firstLevelCategory = categories[0];
  // Get the second level category (e.g. "Meat")
  const secondLevelCategory = firstLevelCategory?.children[0];
  // Get the third level categories (e.g. "Beef", "Pork", etc)
  const thirdLevelCategories = secondLevelCategory?.children || [];

  return (
    <View className="my-6 bg-white">
      <Text className="text-5xl text-marble-green px-4 mb-2 font-heading">
        {secondLevelCategory?.name || ''}
      </Text>
      <Box className="h-[20px] bg-marble-green w-full my-2" />  
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-8 px-4"
      >
        <Pressable
          onPress={() => onSelectCategory('All')}
        >
          <Text
            className={cn(
              'text-lg',
              selectedCategory === 'All' 
                ? 'text-marble-green font-medium' 
                : 'text-typography-400'
            )}
          >
            All
          </Text>
        </Pressable>
        
        {thirdLevelCategories.map((category) => (
          <Pressable
            key={category.id}
            onPress={() => onSelectCategory(category.name)}
          >
            <Text
              className={cn(
                'text-lg',
                selectedCategory === category.name 
                  ? 'text-marble-green font-medium' 
                  : 'text-typography-400'
              )}
            >
              {category.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
} 