"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogIn, CheckCircle, AlertCircle, Loader2, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface LoginFormData {
  email: string
  password: string
}

interface RegisterFormData {
  username: string
  email: string
  password: string
  confirm_password: string
}

interface FormErrors {
  email?: string
  password?: string
  username?: string
  confirm_password?: string
  general?: string
}

const LoginForm: React.FC = () => {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: '',
    password: ''
  })
  
  const [registerData, setRegisterData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirm_password: ''
  })
  
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [successMessage, setSuccessMessage] = useState('')

  const validateLoginForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!loginData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!loginData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateRegisterForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!registerData.username.trim()) {
      newErrors.username = 'Username is required'
    }

    if (!registerData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!registerData.password) {
      newErrors.password = 'Password is required'
    } else if (registerData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!registerData.confirm_password) {
      newErrors.confirm_password = 'Please confirm your password'
    } else if (registerData.password !== registerData.confirm_password) {
      newErrors.confirm_password = 'Passwords do not match'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setLoginData((prev) => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setRegisterData((prev) => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const resetForm = () => {
    if (isLogin) {
      setLoginData({
        email: '',
        password: ''
      })
    } else {
      setRegisterData({
        username: '',
        email: '',
        password: '',
        confirm_password: ''
      })
    }
    setErrors({})
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const isValid = isLogin ? validateLoginForm() : validateRegisterForm()
    if (!isValid) {
      return
    }
    
    setIsSubmitting(true)
    setSubmitStatus('idle')
    setErrors({})

    try {
      if (isLogin) {
        // Login endpoint
        const formData = new FormData();
        formData.append('username', loginData.email);
        formData.append('password', loginData.password);
        
        console.log('Sending login request with:', {
          username: loginData.email,
          password: loginData.password ? '***' : 'empty' // Log password presence without showing actual value
        });
        
        const response = await fetch('https://fastapi.kevinlinportfolio.com/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            'username': loginData.email,
            'password': loginData.password
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          // Properly handle error object or string
          let errorMessage = 'Login failed';
          if (data.detail) {
            errorMessage = typeof data.detail === 'object' 
              ? JSON.stringify(data.detail) 
              : data.detail.toString();
          }
          throw new Error(errorMessage)
        }

        // Save the token to localStorage
        localStorage.setItem('access_token', data.access_token)
        
        setSubmitStatus('success')
        setSuccessMessage('Login successful! Redirecting...')
        
        // Redirect after successful login
        setTimeout(() => {
          router.push('/dashboard')
        }, 1500)
      } else {
        // Register endpoint
        const response = await fetch('https://fastapi.kevinlinportfolio.com/api/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: registerData.email,
            password: registerData.password,
            username: registerData.username
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          // Properly handle error object or string
          let errorMessage = 'Registration failed';
          if (data.detail) {
            errorMessage = typeof data.detail === 'object' 
              ? JSON.stringify(data.detail) 
              : data.detail.toString();
          }
          throw new Error(errorMessage)
        }

        setSubmitStatus('success')
        setSuccessMessage('Account created successfully! You can now log in.')
        setIsLogin(true)
        resetForm()
      }
    } catch (error: unknown) {
      console.error('Error:', error)
      setSubmitStatus('error')
      
      // Handle errors properly, especially for API validation errors
      let errorMessage = 'An unexpected error occurred';
      
      if (error instanceof Error && error.message) {
        try {
          // Try to parse as JSON in case it's a stringified object
          const parsedError = JSON.parse(error.message);
          // Format the error message nicely if it's a validation error
          if (Array.isArray(parsedError)) {
            // Handle FastAPI validation error format
            errorMessage = parsedError
              .map(err => {
                const field = err.loc?.slice(1).join('.') || 'error';
                return `${field}: ${err.msg}`;
              })
              .join(', ');
          } else if (typeof parsedError === 'object') {
            errorMessage = Object.entries(parsedError)
              .map(([field, message]) => `${field}: ${message}`)
              .join(', ');
          } else {
            errorMessage = error.message;
          }
        } catch {
          // If parsing fails, just use the error message as is
          errorMessage = error.message;
        }
      }
      
      setErrors({
        general: errorMessage
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset form state happens inline in the onClick handlers
  // We clear errors and reset submission status when switching forms

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  } as const;

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  } as const;

  const successVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15
      }
    }
  } as const;

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <AnimatePresence mode="wait">
          {submitStatus === 'success' ? (
            <motion.div
              key="success"
              variants={successVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="flex flex-col items-center text-center gap-4 py-8"
            >
              <div className="h-16 w-16 rounded-full bg-green-50 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-xl font-bold">{successMessage}</h3>
              {isLogin && <div className="text-sm text-muted-foreground">You will be redirected shortly...</div>}
            </motion.div>
          ) : (
            <motion.form
              key="form"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="space-y-4"
              onSubmit={handleSubmit}
            >
              <div className="flex justify-center mb-4">
                <div className="grid grid-cols-2 gap-1 bg-muted rounded-lg p-1">
                  <button
                    type="button"
                    className={`py-2 px-4 rounded-md text-sm font-medium ${isLogin ? 'bg-white shadow' : ''}`}
                    onClick={() => !isSubmitting && setIsLogin(true)}
                    disabled={isSubmitting}
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    className={`py-2 px-4 rounded-md text-sm font-medium ${!isLogin ? 'bg-white shadow' : ''}`}
                    onClick={() => !isSubmitting && setIsLogin(false)}
                    disabled={isSubmitting}
                  >
                    Register
                  </button>
                </div>
              </div>

              {errors.general && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg"
                >
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <p className="text-sm text-red-700">{errors.general}</p>
                </motion.div>
              )}

              {isLogin ? (
                // Login Form
                <>
                  <motion.div variants={itemVariants}>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={loginData.email}
                        onChange={handleLoginChange}
                        placeholder="your@email.com"
                        className={errors.email ? "border-red-500" : ""}
                        disabled={isSubmitting}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        placeholder="••••••••"
                        className={errors.password ? "border-red-500" : ""}
                        disabled={isSubmitting}
                      />
                      {errors.password && (
                        <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants} className="text-right text-sm">
                    <Link href="/forgot-password" className="text-blue-600 hover:underline">
                      Forgot password?
                    </Link>
                  </motion.div>
                </>
              ) : (
                // Register Form
                <>
                  <motion.div variants={itemVariants}>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        value={registerData.username}
                        onChange={handleRegisterChange}
                        placeholder="johndoe"
                        className={errors.username ? "border-red-500" : ""}
                        disabled={isSubmitting}
                      />
                      {errors.username && (
                        <p className="text-sm text-red-500 mt-1">{errors.username}</p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <div className="space-y-2">
                      <Label htmlFor="reg-email">Email</Label>
                      <Input
                        id="reg-email"
                        name="email"
                        type="email"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        placeholder="your@email.com"
                        className={errors.email ? "border-red-500" : ""}
                        disabled={isSubmitting}
                      />
                      {errors.email && (
                        <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <Input
                        id="reg-password"
                        name="password"
                        type="password"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        placeholder="••••••••"
                        className={errors.password ? "border-red-500" : ""}
                        disabled={isSubmitting}
                      />
                      {errors.password && (
                        <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                      )}
                    </div>
                  </motion.div>

                  <motion.div variants={itemVariants}>
                    <div className="space-y-2">
                      <Label htmlFor="confirm_password">Confirm Password</Label>
                      <Input
                        id="confirm_password"
                        name="confirm_password"
                        type="password"
                        value={registerData.confirm_password}
                        onChange={handleRegisterChange}
                        placeholder="••••••••"
                        className={errors.confirm_password ? "border-red-500" : ""}
                        disabled={isSubmitting}
                      />
                      {errors.confirm_password && (
                        <p className="text-sm text-red-500 mt-1">{errors.confirm_password}</p>
                      )}
                    </div>
                  </motion.div>
                </>
              )}

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {isLogin ? 'Signing in...' : 'Creating account...'}
                    </>
                  ) : (
                    <>
                      {isLogin ? (
                        <>
                          <LogIn className="w-4 h-4 mr-2" />
                          Sign In
                        </>
                      ) : (
                        <>
                          <UserPlus className="w-4 h-4 mr-2" />
                          Create Account
                        </>
                      )}
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </Card>
  )
}

export default LoginForm
