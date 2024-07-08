import React, { useState } from 'react';
import { Button, Typography, Grid, Box } from '@mui/material';
import CustomTextField from '../components/CustomTextField';
import { isEmpty, isValidEmail, isPasswordMatch, validatePassword } from '../utils/validation';
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [userDetails, setUserDetails] = useState({
        userId: '',
        email: '',
        code: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({
        userId: false,
        email: false,
        code: false,
        password: false,
        confirmPassword: false
    });
    const [passwordErrors, setPasswordErrors] = useState({
        length: true,
        hasNumberAndLetter: true,
        passwordsMatch: true
    });

    const handleSendEmail = () => {
        if (isEmpty(userDetails.email) || !isValidEmail(userDetails.email)) {
            setErrors(prev => ({ ...prev, email: true }));
            return;
        }
        setStep(2);
        setErrors(prev => ({ ...prev, email: false }));
    };

    const handleVerifyCode = () => {
        if (isEmpty(userDetails.code)) {
            setErrors(prev => ({ ...prev, code: true }));
            return;
        }
        setStep(3);
        setErrors(prev => ({ ...prev, code: false }));
    };

    const handleRegister = () => {
        // 비밀 번호 유효성 검사
        const { userId, password, confirmPassword } = userDetails;
        const validationResults = validatePassword(password, confirmPassword);
        if (isEmpty(userId) || isEmpty(password) || isEmpty(confirmPassword) ||
            !validationResults.length || !validationResults.hasNumberAndLetter || !validationResults.passwordsMatch) {
            setErrors(prev => ({
                ...prev,
                userId: isEmpty(userId),
                password: isEmpty(password),
                confirmPassword: !isPasswordMatch(password, confirmPassword)
            }));
            setPasswordErrors(validationResults); // 비밀번호 조건 실패를 상태에 반영
            return;
        }
        navigate('/'); // 모든 검증 성공 후 메인 페이지로
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserDetails(prev => {
            const updatedDetails = { ...prev, [name]: value };
            if (name === 'password' || name === 'confirmPassword') {
                // 업데이트된 userDetails 를 기반으로 비밀번호 검증을 실행
                const validationResults = validatePassword(updatedDetails.password, updatedDetails.confirmPassword);
                setPasswordErrors(validationResults);
            }
            return updatedDetails;
        });
        setErrors(prev => ({ ...prev, [name]: false }));
    };

    return (
        <Grid container sx={{ height: '100vh' }}>
            <Grid item xs={12} sm={6} sx={{
                backgroundColor: '#152238', overflow: 'auto',
                display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: 'white', padding: 3
            }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Join the DeepTech!
                </Typography>
                <CustomTextField label="User ID" onChange={handleChange} name="userId" value={userDetails.userId} error={errors.userId} disabled={step > 1} />
                <CustomTextField label="Email" onChange={handleChange} name="email" value={userDetails.email} error={errors.email} disabled={step > 1} />
                <Button variant="contained" color="primary" fullWidth onClick={handleSendEmail} sx={{ marginTop: 2, width: '500px', height: '50px' }}>
                    SEND EMAIL
                </Button>
                {step >= 2 && (
                    <>
                        <CustomTextField label="Code" onChange={handleChange} name="code" value={userDetails.code} error={errors.code} disabled={step > 2} />
                        <Button variant="contained" color="primary" fullWidth onClick={handleVerifyCode} sx={{ marginTop: 2, width: '500px', height: '50px' }}>
                            VERIFY CODE
                        </Button>
                    </>
                )}
                {step === 3 && (
                    <>
                        <CustomTextField label="Password" type="password" onChange={handleChange} name="password" value={userDetails.password} error={errors.password} />
                        <CustomTextField label="Confirm Password" type="password" onChange={handleChange} name="confirmPassword" value={userDetails.confirmPassword} error={errors.confirmPassword} />
                        {(!passwordErrors.length || !passwordErrors.hasNumberAndLetter || !passwordErrors.passwordsMatch) && (
                            <Box sx={{ mt: 2, background: '#e0e0e0', borderRadius: '5px', p: 2, color: '#333' }}>
                                <Typography>Password must be:</Typography>
                                <Typography>{passwordErrors.length ? '✔ 8 characters minimum' : '✖ 8 characters minimum'}</Typography>
                                <Typography>{passwordErrors.hasNumberAndLetter ? '✔ At least one number & one letter' : '✖ At least one number & one letter'}</Typography>
                                <Typography>{passwordErrors.passwordsMatch ? '✔ Passwords match' : '✖ Passwords do not match'}</Typography>
                            </Box>
                        )}
                        <Button variant="contained" color="primary" fullWidth onClick={handleRegister} sx={{ marginTop: 2, width: '500px', height: '50px' }}>
                            REGISTER
                        </Button>
                    </>
                )}
            </Grid>
            <Grid item xs={12} sm={6} sx={{ background: 'url(login-background.png) no-repeat center center', backgroundSize: 'cover', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 3 }}>
                {/* 내용 없음 */}
            </Grid>
        </Grid>
    );
};

export default Register;
