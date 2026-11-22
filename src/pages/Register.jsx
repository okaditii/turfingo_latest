import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { turfingoImages } from '../lib/cloudinary.js'
import '../styles/register.css'

const SPORTS = [
    'Football',
]

const AGE_GROUPS = ['Under 10', 'Under 12', 'Under 14', 'Under 16', 'Under 18', 'Open (18+)']

function generateRegistrationId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let result = 'TF-'
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

function Register() {
    const [formData, setFormData] = useState({
        playerName: '',
        email: '',
        phone: '',
        age: '',
        ageGroup: '',
        sport: '',
        teamName: '',
        city: '',
        guardianName: '',
        guardianPhone: '',
    })
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [paymentStatus, setPaymentStatus] = useState(null) // null | 'processing' | 'success' | 'failed'
    const [registrationId, setRegistrationId] = useState('')

    const waitForRazorpay = () => {
        return new Promise((resolve, reject) => {
            if (window.Razorpay) {
                resolve(window.Razorpay)
                return
            }
            let attempts = 0
            const interval = setInterval(() => {
                attempts++
                if (window.Razorpay) {
                    clearInterval(interval)
                    resolve(window.Razorpay)
                } else if (attempts > 20) {
                    clearInterval(interval)
                    reject(new Error('Razorpay SDK failed to load. Please refresh the page and try again.'))
                }
            }, 200)
        })
    }

    const validate = () => {
        const newErrors = {}

        if (!formData.playerName.trim() || formData.playerName.trim().length < 2) {
            newErrors.playerName = 'Full name is required (min 2 characters)'
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!formData.email.trim() || !emailRegex.test(formData.email)) {
            newErrors.email = 'Valid email address is required'
        }

        const phoneRegex = /^[6-9]\d{9}$/
        if (!formData.phone.trim() || !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Valid 10-digit Indian phone number required'
        }

        const age = parseInt(formData.age)
        if (!formData.age || isNaN(age) || age < 5 || age > 60) {
            newErrors.age = 'Age must be between 5 and 60'
        }

        if (!formData.ageGroup) {
            newErrors.ageGroup = 'Please select an age group'
        }

        if (!formData.sport) {
            newErrors.sport = 'Please select a sport'
        }

        if (!formData.teamName.trim()) {
            newErrors.teamName = 'Team or academy name is required'
        }

        if (!formData.city.trim()) {
            newErrors.city = 'City is required'
        }

        if (age < 18) {
            if (!formData.guardianName.trim()) {
                newErrors.guardianName = 'Guardian name is required for minors'
            }
            const guardianPhoneRegex = /^[6-9]\d{9}$/
            if (!formData.guardianPhone.trim() || !guardianPhoneRegex.test(formData.guardianPhone.replace(/\s/g, ''))) {
                newErrors.guardianPhone = 'Valid guardian phone number required for minors'
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }))
        }
    }

    const handlePayment = async () => {
        if (!validate()) return

        setIsSubmitting(true)
        setPaymentStatus('processing')

        const regId = generateRegistrationId()
        setRegistrationId(regId)

        // Design preview: without Razorpay/Supabase keys, skip payment and show the success screen.
        if (!import.meta.env.VITE_RAZORPAY_KEY_ID || !supabase) {
            setPaymentStatus('success')
            setIsSubmitting(false)
            return
        }

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: 19900, // ₹199 in paise
            currency: 'INR',
            name: 'Turfingo Tournaments',
            description: `Tournament Registration - ${formData.sport}`,
            image: turfingoImages.logo,
            handler: async function (response) {
                try {
                    const { error } = await supabase.from('registrations').insert([
                        {
                            registration_id: regId,
                            player_name: formData.playerName.trim(),
                            email: formData.email.trim().toLowerCase(),
                            phone: formData.phone.trim(),
                            age: parseInt(formData.age),
                            age_group: formData.ageGroup,
                            sport: formData.sport,
                            team_name: formData.teamName.trim(),
                            city: formData.city.trim(),
                            guardian_name: formData.guardianName.trim() || null,
                            guardian_phone: formData.guardianPhone.trim() || null,
                            payment_id: response.razorpay_payment_id,
                            payment_status: 'paid',
                            amount: 199,
                            registered_at: new Date().toISOString(),
                        },
                    ])

                    if (error) {
                        console.error('Supabase error:', error)
                        setPaymentStatus('failed')
                    } else {
                        setPaymentStatus('success')
                    }
                } catch (err) {
                    console.error('Error saving registration:', err)
                    setPaymentStatus('failed')
                }
                setIsSubmitting(false)
            },
            prefill: {
                name: formData.playerName,
                email: formData.email,
                contact: formData.phone,
            },
            notes: {
                registration_id: regId,
                sport: formData.sport,
                team: formData.teamName,
            },
            theme: {
                color: '#E8192C',
            },
            modal: {
                ondismiss: function () {
                    setPaymentStatus('failed')
                    setIsSubmitting(false)
                },
            },
        }

        try {
            const RazorpayConstructor = await waitForRazorpay()
            const rzp = new RazorpayConstructor(options)
            rzp.on('payment.failed', function (response) {
                console.error('Payment failed:', response.error)
                setPaymentStatus('failed')
                setIsSubmitting(false)
            })
            rzp.open()
        } catch (err) {
            console.error('Razorpay error:', err)
            alert(err.message || 'Could not load payment gateway. Please refresh and try again.')
            setPaymentStatus('failed')
            setIsSubmitting(false)
        }
    }

    const isMinor = parseInt(formData.age) < 18 && formData.age !== ''

    if (paymentStatus === 'success') {
        return (
            <div className="reg-page reg-page-center">
                <div className="reg-container">
                    <div className="reg-success-card">
                        <div className="reg-success-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <h2>Registration Successful!</h2>
                        <p className="reg-success-id">
                            Your Registration ID: <strong>{registrationId}</strong>
                        </p>
                        <p className="reg-success-text">
                            Welcome to the tournament, <strong>{formData.playerName}</strong>! A confirmation has been sent to{' '}
                            <strong>{formData.email}</strong>. Keep your Registration ID safe for future reference.
                        </p>
                        <div className="reg-success-actions">
                            <Link to="/waitlist" className="btn btn-primary reg-btn">
                                View Waitlist
                            </Link>
                            <Link to="/" className="btn btn-outline reg-btn">
                                Back to Home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="reg-page">
            {/* Header */}
            <header className="reg-header">
                <Link to="/" className="reg-logo" aria-label="Back to home">
                    <img src={turfingoImages.logo} alt="" className="reg-logo-mark" />
                    <span className="reg-logo-text">
                        <span>Turfingo</span>
                        <span>Tournaments</span>
                    </span>
                </Link>
                <nav className="reg-nav">
                    <Link to="/">Home</Link>
                    <Link to="/waitlist">View Waitlist</Link>
                </nav>
            </header>

            <div className="reg-container">
                {/* Hero Banner */}
                <div className="reg-hero">
                    <img className="reg-hero-img" src={turfingoImages.heroRegistration} alt="" aria-hidden="true" />
                    <div className="reg-hero-bg"></div>
                    <div className="reg-hero-content">
                        <p className="reg-kicker">Register Now</p>
                        <h1>Clutch<br />Arena</h1>
                        <p className="reg-hero-text">
                            Compete in the ultimate 1v1 football showdown. Show your skills, dominate the pitch, and claim the crown.
                        </p>
                        <div className="reg-tournament-details">
                            <div className="reg-detail-chip">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polygon points="10 8 16 12 10 16 10 8" /></svg>
                                <div>
                                    <span className="reg-detail-label">Format</span>
                                    <span className="reg-detail-value">1v1 Football</span>
                                </div>
                            </div>
                            <div className="reg-detail-chip">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                <div>
                                    <span className="reg-detail-label">Venue</span>
                                    <span className="reg-detail-value">Chennai</span>
                                </div>
                            </div>
                            <div className="reg-detail-chip">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                <div>
                                    <span className="reg-detail-label">Date</span>
                                    <span className="reg-detail-value">15 May 2026</span>
                                </div>
                            </div>
                        </div>
                        <div className="reg-fee-badge">
                            <span className="reg-fee-label">Entry Fee</span>
                            <span className="reg-fee-amount">₹199</span>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="reg-form-wrapper">
                    <form
                        className="reg-form"
                        onSubmit={(e) => {
                            e.preventDefault()
                            handlePayment()
                        }}
                        noValidate
                    >
                        {/* Player Details Section */}
                        <div className="reg-section">
                            <div className="reg-section-header">
                                <span className="reg-section-index">01</span>
                                <h3>Player Details</h3>
                            </div>
                            <div className="reg-fields">
                                <div className={`reg-field ${errors.playerName ? 'reg-field-error' : ''}`}>
                                    <label htmlFor="playerName">Full Name *</label>
                                    <input
                                        type="text"
                                        id="playerName"
                                        name="playerName"
                                        placeholder="Enter player's full name"
                                        value={formData.playerName}
                                        onChange={handleChange}
                                        autoComplete="name"
                                    />
                                    {errors.playerName && <span className="reg-error">{errors.playerName}</span>}
                                </div>

                                <div className={`reg-field ${errors.email ? 'reg-field-error' : ''}`}>
                                    <label htmlFor="email">Email Address *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="example@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        autoComplete="email"
                                    />
                                    {errors.email && <span className="reg-error">{errors.email}</span>}
                                </div>

                                <div className={`reg-field ${errors.phone ? 'reg-field-error' : ''}`}>
                                    <label htmlFor="phone">Phone Number *</label>
                                    <div className="reg-phone-input">
                                        <span className="reg-phone-prefix">+91</span>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            placeholder="9876543210"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            maxLength="10"
                                            autoComplete="tel"
                                        />
                                    </div>
                                    {errors.phone && <span className="reg-error">{errors.phone}</span>}
                                </div>

                                <div className="reg-field-row">
                                    <div className={`reg-field ${errors.age ? 'reg-field-error' : ''}`}>
                                        <label htmlFor="age">Age *</label>
                                        <input
                                            type="number"
                                            id="age"
                                            name="age"
                                            placeholder="e.g. 14"
                                            value={formData.age}
                                            onChange={handleChange}
                                            min="5"
                                            max="60"
                                        />
                                        {errors.age && <span className="reg-error">{errors.age}</span>}
                                    </div>

                                    <div className={`reg-field ${errors.ageGroup ? 'reg-field-error' : ''}`}>
                                        <label htmlFor="ageGroup">Age Group *</label>
                                        <select id="ageGroup" name="ageGroup" value={formData.ageGroup} onChange={handleChange}>
                                            <option value="">Select age group</option>
                                            {AGE_GROUPS.map((g) => (
                                                <option key={g} value={g}>
                                                    {g}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.ageGroup && <span className="reg-error">{errors.ageGroup}</span>}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Tournament Details Section */}
                        <div className="reg-section">
                            <div className="reg-section-header">
                                <span className="reg-section-index">02</span>
                                <h3>Tournament Details</h3>
                            </div>
                            <div className="reg-fields">
                                <div className={`reg-field ${errors.sport ? 'reg-field-error' : ''}`}>
                                    <label htmlFor="sport">Sport *</label>
                                    <select id="sport" name="sport" value={formData.sport} onChange={handleChange}>
                                        <option value="">Select your sport</option>
                                        {SPORTS.map((s) => (
                                            <option key={s} value={s}>
                                                {s}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.sport && <span className="reg-error">{errors.sport}</span>}
                                </div>

                                <div className={`reg-field ${errors.teamName ? 'reg-field-error' : ''}`}>
                                    <label htmlFor="teamName">Team / Academy Name *</label>
                                    <input
                                        type="text"
                                        id="teamName"
                                        name="teamName"
                                        placeholder="Enter team or academy name"
                                        value={formData.teamName}
                                        onChange={handleChange}
                                    />
                                    {errors.teamName && <span className="reg-error">{errors.teamName}</span>}
                                </div>

                                <div className={`reg-field ${errors.city ? 'reg-field-error' : ''}`}>
                                    <label htmlFor="city">City *</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        placeholder="Enter your city"
                                        value={formData.city}
                                        onChange={handleChange}
                                    />
                                    {errors.city && <span className="reg-error">{errors.city}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Guardian Details (conditional) */}
                        {isMinor && (
                            <div className="reg-section reg-section-guardian">
                                <div className="reg-section-header">
                                    <span className="reg-section-index">03</span>
                                    <h3>Guardian Details</h3>
                                    <span className="reg-section-badge">Required for minors</span>
                                </div>
                                <div className="reg-fields">
                                    <div className={`reg-field ${errors.guardianName ? 'reg-field-error' : ''}`}>
                                        <label htmlFor="guardianName">Guardian Full Name *</label>
                                        <input
                                            type="text"
                                            id="guardianName"
                                            name="guardianName"
                                            placeholder="Enter guardian's full name"
                                            value={formData.guardianName}
                                            onChange={handleChange}
                                        />
                                        {errors.guardianName && <span className="reg-error">{errors.guardianName}</span>}
                                    </div>

                                    <div className={`reg-field ${errors.guardianPhone ? 'reg-field-error' : ''}`}>
                                        <label htmlFor="guardianPhone">Guardian Phone *</label>
                                        <div className="reg-phone-input">
                                            <span className="reg-phone-prefix">+91</span>
                                            <input
                                                type="tel"
                                                id="guardianPhone"
                                                name="guardianPhone"
                                                placeholder="9876543210"
                                                value={formData.guardianPhone}
                                                onChange={handleChange}
                                                maxLength="10"
                                            />
                                        </div>
                                        {errors.guardianPhone && <span className="reg-error">{errors.guardianPhone}</span>}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Payment Summary & Submit */}
                        <div className="reg-payment-summary">
                            <div className="reg-payment-row">
                                <span>Tournament Entry Fee</span>
                                <span>₹199.00</span>
                            </div>
                            <div className="reg-payment-row">
                                <span>GST (included)</span>
                                <span>₹0.00</span>
                            </div>
                            <div className="reg-payment-row reg-payment-total">
                                <span>Total</span>
                                <span>₹199.00</span>
                            </div>
                        </div>

                        {paymentStatus === 'failed' && (
                            <div className="reg-alert reg-alert-error">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="15" y1="9" x2="9" y2="15" />
                                    <line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                                <p>Payment failed or was cancelled. Please try again.</p>
                            </div>
                        )}

                        <button type="submit" className="btn btn-primary reg-submit-btn" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <span className="reg-spinner-wrap">
                                    <span className="reg-spinner"></span>
                                    Processing...
                                </span>
                            ) : (
                                <>
                                    Pay ₹199 & Register
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </>
                            )}
                        </button>

                        <p className="reg-secure-note">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                            Payments are securely processed by Razorpay. We never store your card details.
                        </p>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Register
