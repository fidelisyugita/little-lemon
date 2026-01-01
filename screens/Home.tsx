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

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {renderHeader()}
      <View style={{ flex: 1 }}>
        <FlatList
          data={menuData}
          keyExtractor={item => item.name}
          renderItem={({ item }) => <MenuItemComponent item={item} />}
          ListHeaderComponent={
            <>
              {renderHero()}
              {renderCategories()}
            </>
          }
          contentContainerStyle={{ paddingBottom: 20 }}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </View>
  );
}

const MenuItemComponent = ({ item }: { item: MenuItem }) => {
  const [imgSource, setImgSource] = useState({ uri: item.image });

  return (
    <View style={styles.menuItem}>
      <View style={styles.menuInfo}>
        <Text style={styles.menuName}>{item.name}</Text>
        <Text style={styles.menuDesc} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.menuPrice}>{item.price}</Text>
      </View>
      <View style={styles.menuImageContainer}>
        <Image
          source={imgSource}
          style={styles.menuImage}
          resizeMode="cover"
          onError={() => setImgSource({ uri: 'https://github.com/Meta-Mobile-Developer-PC/Working-With-Data-API/blob/main/images/lemonDessert.jpg?raw=true' })}
        />
      </View>
    </View>
  );
};

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
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    paddingLeft: 40,
  },
  logoPlaceholder: {
    //
  },
  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#495E57',
    letterSpacing: 1,
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
    fontSize: 16,
  },
  hero: {
    backgroundColor: '#495E57',
    padding: 20,
    paddingBottom: 30,
  },
  heroTitle: {
    color: '#F4CE14',
    fontSize: 54,
    fontFamily: 'System',
    fontWeight: 'bold',
    lineHeight: 54,
  },
  heroSubtitle: {
    color: '#fff',
    fontSize: 32,
    fontFamily: 'System',
    fontWeight: '600',
    marginBottom: 15,
  },
  heroContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  heroDescription: {
    color: '#EDEFEE',
    fontSize: 16,
    flex: 1,
    marginRight: 20,
    lineHeight: 24,
    fontWeight: '500',
  },
  heroImagePlaceholder: {
    width: 130,
    height: 130,
    backgroundColor: '#333',
    borderRadius: 16,
  },
  searchContainer: {
    marginTop: 5,
  },
  searchInput: {
    backgroundColor: '#EDEFEE',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333',
  },
  categoriesContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  categoriesTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  categoryScroll: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  categoryChip: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#EDEFEE',
    borderRadius: 16,
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: '#495E57',
  },
  categoryText: {
    fontWeight: 'bold',
    color: '#495E57',
    fontSize: 15,
  },
  categoryTextActive: {
    color: '#EDEFEE',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: '#EDEFEE',
    marginHorizontal: 20,
  },
  menuInfo: {
    flex: 1,
    marginRight: 15,
  },
  menuName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#000',
  },
  menuDesc: {
    color: '#495E57',
    marginBottom: 10,
    fontSize: 15,
    lineHeight: 20,
  },
  menuPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#495E57',
  },
  menuImageContainer: {
    justifyContent: 'center',
  },
  menuImage: {
    width: 90,
    height: 90,
    borderRadius: 10,
    backgroundColor: '#EDEFEE',
  },
});
