import axios from 'axios';
import { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator,
} from 'react-native';

const EmailOtpScreen = ({ userName = '', userEmail = '', userPassword = '', onClose }) => {
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [timer, setTimer] = useState(60);
    const [resendAvailable, setResendAvailable] = useState(false);

    const inputsRef = useRef([]);
    const timerRef = useRef(null);

    useEffect(() => {
        handleRegister();
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    const startTimer = () => {
        setTimer(30);
        setResendAvailable(false);
        if (timerRef.current) clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            setTimer((prev) => {
                if (prev === 1) {
                    clearInterval(timerRef.current);
                    setResendAvailable(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleRegister = async () => {
        try {
            setLoading(true);
            const response = await axios.post('https://otp-verification-backend.onrender.com/auth/register', {
                name: userName,
                email: userEmail,
                password: userPassword,
            });

            if (response.data?.success) {
                alert('OTP sent to your email');
                startTimer();
            } else {
                alert(response.data?.message || 'Registration failed');
            }
        } catch (error) {
            console.log('Registration error:', error.response?.data || error.message);
            alert(error.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    const handleDigitChange = (text, index) => {
        const newDigits = [...otpDigits];
        newDigits[index] = text;
        setOtpDigits(newDigits);
        if (text && index < 5) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && otpDigits[index] === '' && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    const handleVerifyOtp = async () => {
        const otp = otpDigits.join('');
        if (otp.length !== 6) {
            alert('Please enter all 6 digits');
            return;
        }

        try {
            setVerifyLoading(true);
            const response = await axios.post('https://otp-verification-backend.onrender.com/auth/verifyEmail', {
                code: otp,
            });

            if (response.data?.success) {
                alert('Email verified successfully!');
                onClose();
            } else {
                alert(response.data?.message || 'OTP verification failed');
            }
        } catch (error) {
            console.log('OTP verification error:', error.response?.data || error.message);
            alert(error.response?.data?.message || 'OTP verification failed');
        } finally {
            setVerifyLoading(false);
        }
    };

    const handleResendOtp = async () => {
        try {
            setLoading(true);
            const response = await axios.post('https://otp-verification-backend.onrender.com/auth/resendOtp', {
                email: userEmail,
            });

            if (response.data?.success) {
                alert('New OTP sent to your email');
                setOtpDigits(['', '', '', '', '', '']);
                startTimer();
            } else {
                alert(response.data?.message || 'Resend failed');
            }
        } catch (error) {
            console.log('Resend OTP error:', error.response?.data || error.message);
            alert(error.response?.data?.message || 'Resend failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <>
                {loading ? (
                    <ActivityIndicator size={'large'} color={'#fff'} />
                ) : (
                    <View style={styles.modalContent}>
                        <Text style={styles.title}>Enter OTP</Text>
                        <Text style={styles.subtitle}>
                            OTP sent to{'\n'}
                            <Text style={{ fontWeight: 'bold' }}>{userEmail}</Text>
                        </Text>

                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Text style={styles.closeButtonText}>X</Text>
                        </TouchableOpacity>

                        <View style={styles.otpContainer}>
                            {otpDigits.map((digit, index) => (
                                <TextInput
                                    key={index}
                                    ref={(ref) => (inputsRef.current[index] = ref)}
                                    style={styles.otpBox}
                                    keyboardType="number-pad"
                                    maxLength={1}
                                    value={digit}
                                    onChangeText={(text) => handleDigitChange(text, index)}
                                    onKeyPress={(e) => handleKeyPress(e, index)}
                                />
                            ))}
                        </View>

                        <Text style={styles.timerText}>
                            {resendAvailable
                                ? "Didn't receive the OTP?" : `Resend OTP in ${timer}s`}
                        </Text>

                        {resendAvailable && (
                            <TouchableOpacity onPress={handleResendOtp}>
                                <Text style={styles.resendText}>Resend OTP</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={styles.button}
                            onPress={handleVerifyOtp}
                            disabled={loading}
                        >
                            {verifyLoading ? (
                                <ActivityIndicator size={'small'} color={'#fff'} />
                            ) : (
                                <Text style={styles.buttonText}>Verify OTP</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                )}
            </>
        </KeyboardAvoidingView>
    );
};

export default EmailOtpScreen;

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 15,
        textAlign: 'center',
        color: '#555',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        gap: 5
    },
    otpBox: {
        width: 42,
        height: 42,
        borderWidth: 1.1,
        borderColor: '#999',
        borderRadius: 10,
        textAlign: 'center',
        fontSize: 16,
        backgroundColor: '#fff',
        textAlignVertical: 'center',
        padding: 0,
        includeFontPadding: false,
    },
    button: {
        backgroundColor: '#007bff',
        width: 200,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
    timerText: {
        fontSize: 14,
        color: '#333',
        marginBottom: 10,
        textAlign: 'center',
    },
    resendText: {
        color: '#007bff',
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalContent: {
        margin: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 25,
        alignItems: 'center',
        elevation: 5,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 10,
        backgroundColor: '#eee',
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
    },
    closeButtonText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    }

});
