# React Native Email OTP Verification Package

A simple React Native component for sending and verifying OTP via email during user registration.

---

## Installation

```bash
npm install react-native-otp-verification-rt
# or
yarn add react-native-otp-verification-rt
```

## Basic Code Template
```
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
} from 'react-native';
import EmailOtpScreen from './src/EmailOtpScreen';

const App = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);

  const handleSendOtp = () => {
    if (!name || !email || !password) {
      alert('Please fill all fields');
      return;
    }
    setShowOtpModal(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.formContainer}>
        <Text style={styles.accText}>Create your account</Text>
        <Text style={styles.label}>Name</Text>
        <TextInput placeholder='Enter name' style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder='Enter email'
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder='Enter password'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleSendOtp}>
          <Text style={styles.buttonText}>Send OTP</Text>
        </TouchableOpacity>
      </View>
      
      {/* Verify OTP */}
      <Modal
        visible={showOtpModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowOtpModal(false)}
      >
        <View style={styles.modalOverlay}>
          <EmailOtpScreen
            userEmail={email}
            userPassword={password}
            userName={name}
            onClose={() => setShowOtpModal(false)}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
    justifyContent: 'center',
    flex: 1,
  },
  accText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 60
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#28a745',
    paddingVertical: 14,
    borderRadius: 8,
  },
  buttonText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
});

```