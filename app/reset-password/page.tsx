'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ResetPasswordPage() {
    const searchParams = useSearchParams()
    const [status, setStatus] = useState<'loading' | 'ready' | 'success' | 'error'>('loading')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        async function handleToken() {
            // Récupère le hash fragment (#access_token=xxx)
            const hash = window.location.hash
            console.log('🔗 Hash :', hash)

            if (hash) {
                const params = new URLSearchParams(hash.substring(1))
                const accessToken = params.get('access_token')
                const refreshToken = params.get('refresh_token')
                const type = params.get('type')

                console.log('🔑 Type :', type)
                console.log('🔑 Access token :', accessToken ? 'OUI' : 'NON')

                if (type === 'recovery' && accessToken && refreshToken) {
                    const { error } = await supabase.auth.setSession({
                        access_token: accessToken,
                        refresh_token: refreshToken,
                    })

                    if (error) {
                        console.log('❌ Erreur session :', error.message)
                        setStatus('error')
                    } else {
                        console.log('✅ Session établie')
                        setStatus('ready')
                    }
                } else {
                    setStatus('error')
                }
            } else {
                setStatus('error')
            }
        }

        handleToken()
    }, [])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError(null)

        if (!password) {
            setError('Please enter a new password')
            return
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }
        if (password !== confirmPassword) {
            setError('Passwords do not match')
            return
        }

        setIsLoading(true)

        const { error } = await supabase.auth.updateUser({ password })

        if (error) {
            setError(error.message)
            setIsLoading(false)
        } else {
            setStatus('success')
            // Redirige vers l'app après 2 secondes
            setTimeout(() => {
                window.location.href = 'wax://login'
            }, 2000)
        }
    }

    return (
        <main style={styles.container}>
            <div style={styles.card}>

                {/* Logo */}
                <h1 style={styles.logo}>WAX</h1>

                {/* Loading */}
                {status === 'loading' && (
                    <div style={styles.center}>
                        <div style={styles.spinner} />
                        <p style={styles.muted}>Verifying your reset link...</p>
                    </div>
                )}

                {/* Error */}
                {status === 'error' && (
                    <div style={styles.center}>
                        <p style={styles.errorTitle}>Link expired</p>
                        <p style={styles.muted}>
                            This reset link is invalid or has expired.
                        </p>
                        <a href="wax://forgot-password" style={styles.button}>
                            Request a new link
                        </a>
                    </div>
                )}

                {/* Success */}
                {status === 'success' && (
                    <div style={styles.center}>
                        <p style={styles.successTitle}>Password updated!</p>
                        <p style={styles.muted}>Redirecting you to the app...</p>
                    </div>
                )}

                {/* Form */}
                {status === 'ready' && (
                    <>
                        <p style={styles.subtitle}>Choose a new password</p>

                        <form onSubmit={handleSubmit} style={styles.form}>
                            <input
                                type="password"
                                placeholder="New password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={styles.input}
                            />
                            <input
                                type="password"
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={{
                                    ...styles.input,
                                    borderColor: confirmPassword.length > 0
                                        ? password === confirmPassword ? '#4CAF50' : '#FF5555'
                                        : '#2A2A2A'
                                }}
                            />

                            {confirmPassword.length > 0 && (
                                <p style={{
                                    fontSize: '13px',
                                    color: password === confirmPassword ? '#4CAF50' : '#FF5555',
                                }}>
                                    {password === confirmPassword
                                        ? '✓ Passwords match'
                                        : '✗ Passwords do not match'
                                    }
                                </p>
                            )}

                            {error && <p style={styles.error}>{error}</p>}

                            <button
                                type="submit"
                                disabled={isLoading}
                                style={styles.button}
                            >
                                {isLoading ? 'Updating...' : 'Update password'}
                            </button>
                        </form>
                    </>
                )}

            </div>
        </main>
    )
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: '#0A0A0A',
        padding: '16px',
    },
    card: {
        backgroundColor: '#141414',
        borderRadius: '20px',
        padding: '40px 32px',
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '24px',
        border: '1px solid #2A2A2A',
    },
    logo: {
        fontSize: '48px',
        fontWeight: '900',
        color: '#F5A623',
        letterSpacing: '8px',
    },
    subtitle: {
        fontSize: '16px',
        color: '#888888',
        textAlign: 'center',
    },
    form: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    input: {
        backgroundColor: '#0A0A0A',
        color: '#FFFFFF',
        border: '1px solid #2A2A2A',
        borderRadius: '12px',
        padding: '14px 16px',
        fontSize: '16px',
        width: '100%',
        outline: 'none',
    },
    button: {
        backgroundColor: '#F5A623',
        color: '#000000',
        border: 'none',
        borderRadius: '12px',
        padding: '14px',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        width: '100%',
        textAlign: 'center',
        textDecoration: 'none',
        display: 'block',
        marginTop: '8px',
    },
    center: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        width: '100%',
    },
    muted: {
        color: '#888888',
        fontSize: '14px',
        textAlign: 'center',
    },
    error: {
        color: '#FF5555',
        fontSize: '13px',
        textAlign: 'center',
    },
    errorTitle: {
        fontSize: '24px',
        fontWeight: '800',
        color: '#FFFFFF',
    },
    successTitle: {
        fontSize: '24px',
        fontWeight: '800',
        color: '#FFFFFF',
    },
    spinner: {
        width: '32px',
        height: '32px',
        border: '3px solid #2A2A2A',
        borderTop: '3px solid #F5A623',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
}