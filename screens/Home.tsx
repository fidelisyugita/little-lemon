import React, { useEffect, useState } from 'react';
import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getUser } from '../utils/storage';

interface MenuItem {
  name: string;
  description: string;
  price: string;
  image: string; // URL or local require
  category: string;
}

const mockMenu: MenuItem[] = [
  {
    name: 'Greek Salad',
    description: 'Our famous greek salad of crispy lettuce, peppers, olives and our Chicago style feta cheese, garnished with crunchy garlic and rosemary croutons.',
    price: '$12.99',
    image: 'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/greekSalad.jpg?raw=true',
    category: 'Starters',
  },
  {
    name: 'Bruschetta',
    description: 'Our Bruschetta is made from grilled bread that has been smeared with garlic and seasoned with salt and olive oil.',
    price: '$5.99',
    image: 'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/bruschetta.jpg?raw=true',
    category: 'Starters',
  },
  {
    name: 'Grilled Fish',
    description: 'Our Grilled Fish is incredible.',
    price: '$20.00',
    image: 'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/grilledFish.jpg?raw=true',
    category: 'Mains',
  },
  {
    name: 'Lemon Dessert',
    description: 'This comes straight from grandma’s recipe book, every last ingredient has been sourced and is as authentic as can be imagined.',
    price: '$5.00',
    image: 'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/lemonDessert.jpg?raw=true',
    category: 'Desserts',
  },
  // Add more as needed
];

const categories = ['Starters', 'Mains', 'Desserts', 'Drinks'];

export default function Home({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const [userAvatar, setUserAvatar] = useState<{ initials: string }>({ initials: '?' });
  const [searchText, setSearchText] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [menuData, setMenuData] = useState<MenuItem[]>(mockMenu);

  useEffect(() => {
    // Load avatar initials
    const loadUser = async () => {
      const user = await getUser();
      if (user && user.firstName) {
        const first = user.firstName[0].toUpperCase();
        const last = user.lastName ? user.lastName[0].toUpperCase() : '';
        setUserAvatar({ initials: first + last });
      }
    };

    const unsubscribe = navigation.addListener('focus', () => {
      loadUser();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    // Filter menu
    let filtered = mockMenu;
    if (searchText) {
      filtered = filtered.filter(item => item.name.toLowerCase().includes(searchText.toLowerCase()));
    }
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(item => selectedCategories.includes(item.category));
    }
    setMenuData(filtered);
  }, [searchText, selectedCategories]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        {/* Placeholder for Logo */}
        <View style={styles.logoPlaceholder}><Text style={styles.logoText}>LITTLE LEMON</Text></View>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.avatar}>
        <Text style={styles.avatarLabel}>{userAvatar.initials}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderHero = () => (
    <View style={styles.hero}>
      <Text style={styles.heroTitle}>Little Lemon</Text>
      <Text style={styles.heroSubtitle}>Chicago</Text>
      <View style={styles.heroContent}>
        <Text style={styles.heroDescription}>
          We are a family owned Mediterranean restaurant, focused on traditional recipes served with a modern twist.
        </Text>
        {/* Placeholder for Hero Image */}
        <View style={styles.heroImagePlaceholder} />
      </View>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search"
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>
    </View>
  );

  const renderCategories = () => (
    <View style={styles.categoriesContainer}>
      <Text style={styles.categoriesTitle}>ORDER FOR DELIVERY!</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[styles.categoryChip, selectedCategories.includes(cat) && styles.categoryChipActive]}
            onPress={() => toggleCategory(cat)}
          >
            <Text style={[styles.categoryText, selectedCategories.includes(cat) && styles.categoryTextActive]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.menuItem}>
      <View style={styles.menuInfo}>
        <Text style={styles.menuName}>{item.name}</Text>
        <Text style={styles.menuDesc} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.menuPrice}>{item.price}</Text>
      </View>
      <View style={styles.menuImageContainer}>
        <Image source={{ uri: item.image }} style={styles.menuImage} resizeMode="cover" />
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {renderHeader()}
      <View style={{ flex: 1 }}>
        <FlatList
          data={menuData}
          keyExtractor={item => item.name}
          renderItem={renderMenuItem}
          ListHeaderComponent={
            <>
              {renderHero()}
              {renderCategories()}
            </>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    paddingLeft: 40, // offset avatar width for center
  },
  logoPlaceholder: {
    // 
  },
  logoText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#495E57',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#495E57',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarLabel: {
    color: '#fff',
    fontWeight: 'bold',
  },
  hero: {
    backgroundColor: '#495E57',
    padding: 20,
  },
  heroTitle: {
    color: '#F4CE14',
    fontSize: 40,
    fontFamily: 'System', // Use specialized font if available
    fontWeight: 'bold',
  },
  heroSubtitle: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 10,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  heroDescription: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
    marginRight: 20,
  },
  heroImagePlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: '#AAA', // Placeholder grey
    borderRadius: 10,
  },
  searchContainer: {
    marginTop: 10,
  },
  searchInput: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  categoriesContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  categoryScroll: {
    flexDirection: 'row',
  },
  categoryChip: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#eee',
    borderRadius: 20,
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: '#495E57',
  },
  categoryText: {
    fontWeight: 'bold',
    color: '#495E57',
  },
  categoryTextActive: {
    color: '#F4CE14',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuInfo: {
    flex: 1,
    marginRight: 10,
  },
  menuName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  menuDesc: {
    color: '#666',
    marginBottom: 10,
  },
  menuPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495E57',
  },
  menuImageContainer: {
    justifyContent: 'center',
  },
  menuImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#ccc',
  },
});
