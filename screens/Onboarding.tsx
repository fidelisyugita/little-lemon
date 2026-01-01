import React, { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { saveUser } from '../utils/storage';

export default function Onboarding({ navigation }: any) {
  const [firstName, setFirstName] = useState('');
  const [email, setEmail] = useState('');
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (firstName.trim().length > 0 && emailRegex.test(email)) {
      setIsValid(true);
    } else {
      setIsValid(false);
    }
  }, [firstName, email]);

  const handleNext = async () => {
    if (!isValid) return;

    try {
      await saveUser({
        firstName: firstName.trim(),
        email: email.trim(),
        isOnboarded: true,
      });
      // Navigate to Home/Profile or reset stack
      // Assuming navigation structure will have 'Home' or 'Profile'
      // The requirement says "Next button...". Usually after onboarding we go to Profile or Home.
      // Based on typical flow, we go to Home, then Profile is accessible from Home.
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (e) {
      Alert.alert('Error', 'Failed to save your details');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.logoText}>LITTLE LEMON</Text>
          </View>

          <View style={styles.hero}>
            <Text style={styles.heroText}>Let us get to know you</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, !isValid && styles.disabledButton]}
              onPress={handleNext}
              disabled={!isValid}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDEFEE',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#DEE3E9',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
  },
  hero: {
    alignItems: 'center',
    paddingVertical: 50,
  },
  heroText: {
    fontSize: 22,
    color: '#333333',
  },
  form: {
    paddingHorizontal: 30,
    flex: 1,
  },
  label: {
    fontSize: 18,
    color: '#333333',
    marginBottom: 10,
    marginTop: 20,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  footer: {
    padding: 30,
    alignItems: 'flex-end',
  },
  button: {
    backgroundColor: '#F4CE14', // Little Lemon Yellow? Or Grey? Using Yellow for active
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  disabledButton: {
    backgroundColor: '#ADB5BD',
  },
  buttonText: {
    fontSize: 18,
    color: '#333333',
    fontWeight: '600',
  },
});
