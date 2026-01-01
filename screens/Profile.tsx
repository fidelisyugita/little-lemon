import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { clearUser, getUser, saveUser, UserProfile } from '../utils/storage';

export default function Profile({ navigation }: any) {
  const [userInfo, setUserInfo] = useState<UserProfile>({
    firstName: '',
    email: '',
    isOnboarded: false,
    lastName: '',
    phoneNumber: '',
    emailNotifications: [true, true, true, true], // Default all on
  });

  useEffect(() => {
    const loadProfile = async () => {
      const user = await getUser();
      if (user) {
        setUserInfo({
          ...user,
          lastName: user.lastName || '',
          phoneNumber: user.phoneNumber || '',
          emailNotifications: user.emailNotifications || [true, true, true, true],
        });
      }
    };
    loadProfile();
  }, []);

  const handleLogout = async () => {
    await clearUser();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Onboarding' }],
    });
  };

  const handleSave = async () => {
    // Basic validation
    if (!userInfo.firstName || !userInfo.email) {
      Alert.alert('Error', 'First name and email are required');
      return;
    }

    try {
      await saveUser({
        ...userInfo,
        isOnboarded: true, // Ensure it stays true
      });
      Alert.alert('Success', 'Profile changes saved!');
    } catch (e) {
      Alert.alert('Error', 'Failed to save changes');
    }
  };

  const updateField = (key: keyof UserProfile, value: string) => {
    setUserInfo(prev => ({ ...prev, [key]: value }));
  };

  const updateNotification = (index: number) => {
    setUserInfo(prev => {
      const newNotifs = [...(prev.emailNotifications || [true, true, true, true])];
      newNotifs[index] = !newNotifs[index];
      return { ...prev, emailNotifications: newNotifs };
    });
  };

  const renderCheckbox = (label: string, index: number) => {
    const isChecked = userInfo.emailNotifications ? userInfo.emailNotifications[index] : true;
    return (
      <TouchableOpacity
        key={index}
        style={styles.checkboxContainer}
        onPress={() => updateNotification(index)}
      >
        <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
          {isChecked && <Ionicons name="checkmark" size={14} color="#fff" />}
        </View>
        <Text style={styles.checkboxLabel}>{label}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerText}>Personal Information</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userInfo.firstName && userInfo.firstName[0].toUpperCase()}
              {userInfo.lastName && userInfo.lastName[0] ? userInfo.lastName[0].toUpperCase() : ''}
            </Text>
          </View>
          <TouchableOpacity style={styles.changeButton}>
            <Text style={styles.changeButtonText}>Change</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.removeButton}>
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={userInfo.firstName}
            onChangeText={(text) => updateField('firstName', text)}
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={userInfo.lastName}
            onChangeText={(text) => updateField('lastName', text)}
            placeholder="Enter last name"
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={userInfo.email}
            onChangeText={(text) => updateField('email', text)}
            keyboardType="email-address"
          />

          <Text style={styles.label}>Phone number</Text>
          <TextInput
            style={styles.input}
            value={userInfo.phoneNumber}
            onChangeText={(text) => updateField('phoneNumber', text)}
            keyboardType="phone-pad"
            placeholder="Enter phone number"
          />


          <Text style={styles.sectionTitle}>Email notifications</Text>
          {['Order statuses', 'Password changes', 'Special offers', 'Newsletter'].map((label, index) => renderCheckbox(label, index))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>

          <View style={styles.row}>
            <TouchableOpacity style={styles.discardButton} onPress={() => navigation.goBack()}>

              <Text style={styles.discardText}>Discard changes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveText}>Save changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#495E57', // Little Lemon Green
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
  changeButton: {
    backgroundColor: '#495E57',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  changeButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
  removeButton: {
    borderWidth: 1,
    borderColor: '#495E57',
    padding: 10,
    borderRadius: 8,
  },
  removeButtonText: {
    color: '#495E57',
    fontWeight: '600',
  },
  form: {
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    marginTop: 15,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: '#333',
  },
  actions: {
    gap: 20,
  },
  logoutButton: {
    backgroundColor: '#F4CE14',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E4BE13'
  },
  logoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  discardButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#495E57',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  discardText: {
    color: '#495E57',
    fontWeight: '600',
  },
  saveButton: {
    flex: 1,
    backgroundColor: '#495E57',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 15,
    color: '#333',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#495E57',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#495E57',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
  },
});
