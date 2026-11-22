import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase.js'
import { turfingoImages } from '../lib/cloudinary.js'
import '../styles/waitlist.css'

function Waitlist() {
    const [players, setPlayers] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterSport, setFilterSport] = useState('')
    const [filterAgeGroup, setFilterAgeGroup] = useState('')
    const [sports, setSports] = useState([])
    const [ageGroups, setAgeGroups] = useState([])
    const [totalCount, setTotalCount] = useState(0)

    const fetchPlayers = useCallback(async () => {
        if (!supabase) {
            // Design preview: no database configured, so show the empty list.
            setLoading(false)
            return
        }
        setLoading(true)
        try {
            let query = supabase
                .from('registrations')
                .select('*', { count: 'exact' })
                .eq('payment_status', 'paid')
                .order('registered_at', { ascending: false })

            if (searchTerm.trim()) {
                const term = `%${searchTerm.trim()}%`
                query = query.or(
                    `player_name.ilike.${term},registration_id.ilike.${term},email.ilike.${term},team_name.ilike.${term},city.ilike.${term}`
                )
            }

            if (filterSport) {
                query = query.eq('sport', filterSport)
            }

            if (filterAgeGroup) {
                query = query.eq('age_group', filterAgeGroup)
            }

            const { data, error, count } = await query

            if (error) {
                console.error('Error fetching players:', error)
            } else {
                setPlayers(data || [])
                setTotalCount(count || 0)

                // Extract unique sports and age groups for filters
                if (!filterSport && !filterAgeGroup && !searchTerm) {
                    const uniqueSports = [...new Set(data?.map((p) => p.sport).filter(Boolean))]
                    const uniqueAgeGroups = [...new Set(data?.map((p) => p.age_group).filter(Boolean))]
                    setSports(uniqueSports)
                    setAgeGroups(uniqueAgeGroups)
                }
            }
        } catch (err) {
            console.error('Error:', err)
        }
        setLoading(false)
    }, [searchTerm, filterSport, filterAgeGroup])

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            fetchPlayers()
        }, 300)
        return () => clearTimeout(debounceTimer)
    }, [fetchPlayers])

    const clearFilters = () => {
        setSearchTerm('')
        setFilterSport('')
        setFilterAgeGroup('')
    }

    const hasFilters = searchTerm || filterSport || filterAgeGroup

    return (
        <div className="wl-page">
            {/* Header */}
            <header className="wl-header">
                <Link to="/" className="wl-logo" aria-label="Back to home">
                    <img src={turfingoImages.logo} alt="" className="wl-logo-mark" />
                    <span className="wl-logo-text">
                        <span>Turfingo</span>
                        <span>Tournaments</span>
                    </span>
                </Link>
                <nav className="wl-nav">
                    <Link to="/">Home</Link>
                    <Link to="/register">Register</Link>
                </nav>
            </header>

            <div className="wl-container">
                {/* Hero Banner */}
                <div className="wl-hero">
                    <img className="wl-hero-img" src={turfingoImages.heroWaitlist} alt="" aria-hidden="true" />
                    <div className="wl-hero-bg"></div>
                    <div className="wl-hero-content">
                        <p className="wl-kicker">Tournament Waitlist</p>
                        <h1>Registered<br />Players</h1>
                        <p className="wl-hero-text">
                            View all registered players for the upcoming Turfingo tournament. Search by name, registration ID, team, or city.
                        </p>
                        <div className="wl-stats-row">
                            <div className="wl-stat">
                                <span className="wl-stat-number">{totalCount}</span>
                                <span className="wl-stat-label">Total Registered</span>
                            </div>
                            <div className="wl-stat">
                                <span className="wl-stat-number">{sports.length}</span>
                                <span className="wl-stat-label">Sports</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search & Filter Bar */}
                <div className="wl-toolbar">
                    <div className="wl-search-box">
                        <svg className="wl-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8" />
                            <line x1="21" y1="21" x2="16.65" y2="16.65" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by name, ID, team, city..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="wl-search-input"
                            id="waitlist-search"
                        />
                        {searchTerm && (
                            <button className="wl-search-clear" onClick={() => setSearchTerm('')} aria-label="Clear search">
                                ✕
                            </button>
                        )}
                    </div>

                    <div className="wl-filters">
                        <select
                            value={filterSport}
                            onChange={(e) => setFilterSport(e.target.value)}
                            className="wl-filter-select"
                            id="filter-sport"
                        >
                            <option value="">All Sports</option>
                            {sports.map((s) => (
                                <option key={s} value={s}>{s}</option>
                            ))}
                        </select>

                        <select
                            value={filterAgeGroup}
                            onChange={(e) => setFilterAgeGroup(e.target.value)}
                            className="wl-filter-select"
                            id="filter-age-group"
                        >
                            <option value="">All Age Groups</option>
                            {ageGroups.map((g) => (
                                <option key={g} value={g}>{g}</option>
                            ))}
                        </select>

                        {hasFilters && (
                            <button className="wl-clear-btn" onClick={clearFilters}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                                Clear All
                            </button>
                        )}
                    </div>
                </div>

                {/* Results */}
                <div className="wl-results">
                    {loading ? (
                        <div className="wl-loading">
                            <div className="wl-loading-spinner"></div>
                            <p>Loading registered players...</p>
                        </div>
                    ) : players.length === 0 ? (
                        <div className="wl-empty">
                            <div className="wl-empty-icon">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                            </div>
                            <h3>{hasFilters ? 'No matching players found' : 'No registrations yet'}</h3>
                            <p>
                                {hasFilters
                                    ? 'Try adjusting your search or filter criteria.'
                                    : 'Be the first to register for the upcoming tournament!'}
                            </p>
                            {hasFilters ? (
                                <button className="btn btn-outline wl-action-btn" onClick={clearFilters}>
                                    Clear Filters
                                </button>
                            ) : (
                                <Link to="/register" className="btn btn-primary wl-action-btn">
                                    Register Now
                                </Link>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="wl-results-header">
                                <span className="wl-results-count">
                                    Showing <strong>{players.length}</strong> player{players.length !== 1 ? 's' : ''}
                                </span>
                            </div>

                            <div className="wl-table-wrap">
                                <table className="wl-table">
                                    <thead>
                                        <tr>
                                            <th>Reg. ID</th>
                                            <th>Player Name</th>
                                            <th>Sport</th>
                                            <th>Age Group</th>
                                            <th>Team / Academy</th>
                                            <th>City</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {players.map((player) => (
                                            <tr key={player.id || player.registration_id}>
                                                <td>
                                                    <span className="wl-reg-id">{player.registration_id}</span>
                                                </td>
                                                <td>
                                                    <div className="wl-player-cell">
                                                        <div className="wl-player-avatar">
                                                            {player.player_name?.charAt(0)?.toUpperCase()}
                                                        </div>
                                                        <div className="wl-player-info">
                                                            <span className="wl-player-name">{player.player_name}</span>
                                                            <span className="wl-player-email">{player.email}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className="wl-sport-badge">{player.sport}</span>
                                                </td>
                                                <td>{player.age_group}</td>
                                                <td>{player.team_name}</td>
                                                <td>{player.city}</td>
                                                <td>
                                                    <span className={`wl-status wl-status-${player.payment_status}`}>
                                                        {player.payment_status === 'paid' ? 'Confirmed' : player.payment_status}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile card view */}
                            <div className="wl-cards-mobile">
                                {players.map((player) => (
                                    <div className="wl-card" key={player.id || player.registration_id}>
                                        <div className="wl-card-header">
                                            <div className="wl-player-avatar">
                                                {player.player_name?.charAt(0)?.toUpperCase()}
                                            </div>
                                            <div>
                                                <span className="wl-player-name">{player.player_name}</span>
                                                <span className="wl-reg-id">{player.registration_id}</span>
                                            </div>
                                            <span className={`wl-status wl-status-${player.payment_status}`}>
                                                {player.payment_status === 'paid' ? 'Confirmed' : player.payment_status}
                                            </span>
                                        </div>
                                        <div className="wl-card-body">
                                            <div className="wl-card-row">
                                                <span className="wl-card-label">Sport</span>
                                                <span className="wl-sport-badge">{player.sport}</span>
                                            </div>
                                            <div className="wl-card-row">
                                                <span className="wl-card-label">Age Group</span>
                                                <span>{player.age_group}</span>
                                            </div>
                                            <div className="wl-card-row">
                                                <span className="wl-card-label">Team</span>
                                                <span>{player.team_name}</span>
                                            </div>
                                            <div className="wl-card-row">
                                                <span className="wl-card-label">City</span>
                                                <span>{player.city}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Waitlist
