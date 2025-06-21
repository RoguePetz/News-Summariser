"use client";

import { useState } from "react";
import { Heart, Shield, Users, Activity, Newspaper, TrendingUp, Globe, Zap } from 'lucide-react';
import { useNavigate } from "react-router-dom";
const AuthPage = ({ onLogin, onSignup }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("login");
    const [loginData, setLoginData] = useState({ email: "", password: "" });
    const [signupData, setSignupData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        interests: "",
        country: "",
        phone: "",
    });
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (loginData.email && loginData.password) {
            // onLogin(loginData.email);
            navigate('/main');
        } else {
            alert("Please fill in all fields");
        }
        setLoading(false);
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (signupData.password !== signupData.confirmPassword) {
            alert("Passwords don't match");
            return;
        }

        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (signupData.name && signupData.email && signupData.password) {
            // onSignup(signupData.email);
            navigate('/main');
        } else {
            alert("Please fill in all required fields");
        }
        setLoading(false);
    };

    const TabButton = ({ value, children, isActive, onClick }) => (
        <button
            onClick={() => onClick(value)}
            className={`tab-button ${isActive ? 'active-tab' : ''}`}
        >
            {children}
        </button>
    );

    const InputField = ({ label, type = "text", placeholder, value, onChange, required = false, id }) => (
        <div className="input-field">
            <label htmlFor={id} className="input-label">
                {label}
            </label>
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                className="input"
            />
        </div>
    );

    const SelectField = ({ label, value, onChange, options, placeholder, id }) => (
        <div className="input-field">
            <label htmlFor={id} className="input-label">
                {label}
            </label>
            <select
                id={id}
                value={value}
                onChange={onChange}
                className="select"
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );

    const interestOptions = [
        { value: "technology", label: "Technology" },
        { value: "politics", label: "Politics" },
        { value: "sports", label: "Sports" },
        { value: "business", label: "Business" },
        { value: "health", label: "Health" },
        { value: "entertainment", label: "Entertainment" },
    ];

    const countryOptions = [
        { value: "us", label: "United States" },
        { value: "uk", label: "United Kingdom" },
        { value: "ca", label: "Canada" },
        { value: "au", label: "Australia" },
        { value: "in", label: "India" },
        { value: "de", label: "Germany" },
    ];

    return (
        <div className="auth-container">
            <div className="auth-content">
                {/* Left side - Branding */}
                <div className="branding-section">
                    <div className="branding-header">
                        <div className="branding-logo">
                            <div className="logo-icon">
                                <Newspaper size={32} color="white" />
                            </div>
                            <h1 className="branding-title">NewsHub Pro</h1>
                        </div>
                        <p className="branding-subtitle">
                            Your personalized news experience with AI-powered insights and real-time updates
                        </p>
                    </div>

                    <div className="features-grid">
                        <div className="feature-card">
                            <Globe size={24} color="#3a7bd5" className="feature-icon" />
                            <h3 className="feature-title">Global Coverage</h3>
                            <p className="feature-description">News from around the world</p>
                        </div>

                        <div className="feature-card">
                            <TrendingUp size={24} color="#3a7bd5" className="feature-icon" />
                            <h3 className="feature-title">Trending Topics</h3>
                            <p className="feature-description">Stay ahead of trends</p>
                        </div>

                        <div className="feature-card">
                            <Zap size={24} color="#3a7bd5" className="feature-icon" />
                            <h3 className="feature-title">AI Summaries</h3>
                            <p className="feature-description">Quick article insights</p>
                        </div>

                        <div className="feature-card">
                            <Users size={24} color="#3a7bd5" className="feature-icon" />
                            <h3 className="feature-title">Personalized</h3>
                            <p className="feature-description">Tailored to your interests</p>
                        </div>
                    </div>
                </div>

                {/* Right side - Login/Signup Form */}
                <div className="form-section">
                    <div className="form-container">
                        {/* Header */}
                        <div className="form-header">
                            <div className="mobile-logo">
                                <div className="logo-icon">
                                    <Newspaper size={32} color="white" />
                                </div>
                            </div>
                            <h2 className="form-title">
                                Welcome to NewsHub Pro
                            </h2>
                            <p className="form-subtitle">
                                Sign in to your account or create a new one
                            </p>
                        </div>

                        {/* Content */}
                        <div className="form-content">
                            {/* Tabs */}
                            <div className="tab-container">
                                <TabButton
                                    value="login"
                                    isActive={activeTab === "login"}
                                    onClick={setActiveTab}
                                >
                                    Sign In
                                </TabButton>
                                <TabButton
                                    value="signup"
                                    isActive={activeTab === "signup"}
                                    onClick={setActiveTab}
                                >
                                    Sign Up
                                </TabButton>
                            </div>

                            {/* Login Form */}
                            {activeTab === "login" && (
                                <form onSubmit={handleLogin} className="form">
                                    <input
                                        className="input"
                                        id="login-email"
                                        label="Email"
                                        type="email"
                                        placeholder="your@email.com"
                                        value={loginData.email}
                                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                                        required
                                    />
                                    <input
                                        className="input"
                                        id="login-password"
                                        label="Password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={loginData.password}
                                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`submit-button ${loading ? 'loading-button' : ''}`}
                                    >
                                        {loading ? "Signing in..." : "Sign In"}
                                    </button>
                                    <div className="form-footer">
                                        Enter any email and password to continue
                                    </div>
                                </form>
                            )}

                            {/* Signup Form */}
                            {activeTab === "signup" && (
                                <form onSubmit={handleSignup} className="form">
                                    <div className="two-column-fields">
                                        <input
                                            className="input"
                                            id="signup-name"
                                            label="Full Name"
                                            placeholder="John Doe"
                                            value={signupData.name}
                                            onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                                            required
                                        />
                                        <input
                                            className="input"
                                            id="signup-phone"
                                            label="Phone"
                                            placeholder="+1 (555) 123-4567"
                                            value={signupData.phone}
                                            onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                                        />
                                    </div>

                                    <input
                                        className="input"
                                        id="signup-email"
                                        label="Email"
                                        type="email"
                                        placeholder="john.doe@email.com"
                                        value={signupData.email}
                                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                        required
                                    />

                                    <div className="two-column-fields">
                                        <input
                                            className="input"
                                            id="signup-password"
                                            label="Password"
                                            type="password"
                                            placeholder="Create password"
                                            value={signupData.password}
                                            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                            required
                                        />
                                        <input
                                            className="input"
                                            id="signup-confirm"
                                            label="Confirm Password"
                                            type="password"
                                            placeholder="Confirm password"
                                            value={signupData.confirmPassword}
                                            onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                                            required
                                        />
                                    </div>

                                    <div className="two-column-fields">
                                        <SelectField
                                            id="signup-interests"
                                            label="Primary Interest"
                                            value={signupData.interests}
                                            onChange={(e) => setSignupData({ ...signupData, interests: e.target.value })}
                                            options={interestOptions}
                                            placeholder="Select interest"
                                        />
                                        <SelectField
                                            id="signup-country"
                                            label="Country"
                                            value={signupData.country}
                                            onChange={(e) => setSignupData({ ...signupData, country: e.target.value })}
                                            options={countryOptions}
                                            placeholder="Select country"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`submit-button ${loading ? 'loading-button' : ''}`}
                                    >
                                        {loading ? "Creating Account..." : "Create Account"}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;