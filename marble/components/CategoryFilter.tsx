import React from 'react';
import { ScrollView, Pressable } from 'react-native';
import { Text } from '@/components/ui/text';
import { cn } from '@/lib/utils';

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
  // Extract meat categories (assuming meat is always the first child with children)
  const meatCategories = categories[0]?.children[0]?.children || [];

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      className="mb-4"
      contentContainerClassName="gap-4 px-4"
    >
      <Pressable
        onPress={() => onSelectCategory('All')}
        className={cn(
          'py-2 px-4 rounded-full',
          selectedCategory === 'All' 
            ? 'bg-primary' 
            : 'bg-muted'
        )}
      >
        <Text
          className={cn(
            selectedCategory === 'All' 
              ? 'text-primary-foreground' 
              : 'text-foreground'
          )}
        >
          All
        </Text>
      </Pressable>
      
      {meatCategories.map((category) => (
        <Pressable
          key={category.id}
          onPress={() => onSelectCategory(category.name)}
          className={cn(
            'py-2 px-4 rounded-full',
            selectedCategory === category.name 
              ? 'bg-primary' 
              : 'bg-muted'
          )}
        >
          <Text
            className={cn(
              selectedCategory === category.name 
                ? 'text-primary-foreground' 
                : 'text-foreground'
            )}
          >
            {category.name}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
} 