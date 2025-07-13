"use client"

import React from 'react'
import LoginForm from '@/components/ui/login-form'
import { motion } from 'framer-motion'

export default function LoginPage() {
  return (
    <section className="py-16 md:py-24">
      <div className="container px-4 md:px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <h1 className="text-3xl font-bold tracking-tighter mb-6 text-center">
            Account Login
          </h1>
          <p className="text-muted-foreground mb-8 text-center">
            Sign in to your account to access your dashboard and manage your profile.
          </p>
          
          <LoginForm />
        </motion.div>
      </div>
    </section>
  )
}
