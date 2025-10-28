import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, Users, Clock, MapPin, Edit2, Save, X, Upload, Menu, Trash2, RefreshCw, Database } from 'lucide-react';

/**
 * WAGGY T TOURNAMENT APP - COMPLETE VERSION
 * 
 * Features:
 * - Red & Black color scheme ✓
 * - Round 1 results (35 goals) ✓
 * - Round 2 schedule (from docx) ✓
 * - Added time support (45+2', 90+4') ✓
 * - Penalty shootout scores (3-2) ✓
 * - Editable goal scorers ✓
 * - Persistent match selection ✓
 * - Server-side storage ✓
 * - Mobile responsive ✓
 * - Security features ✓
 */

const TournamentApp = () => {
  // ============= STATE MANAGEMENT =============
  const [currentView, setCurrentView] = useState('fan');
  const [activeTab, setActiveTab] = useState('schedule');
  const [selectedTeam, setSelectedTeam] = useState('all');
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(null);
  const [sessionTimeout, setSessionTimeout] = useState(null);
  const [editingMatch, setEditingMatch] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [showPassword, setShowPassword] = useState(false);
  const [syncStatus, setSyncStatus] = useState('synced');
  const [lastSyncTime, setLastSyncTime] = useState(null);
  
  const [selectedMatchId, setSelectedMatchId] = useState(() => {
    const saved = localStorage.getItem('selectedMatchId');
    return saved ? parseInt(saved, 10) : null;
  });

  // ============= SERVER CONFIGURATION =============
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
  const USE_SERVER_STORAGE = process.env.REACT_APP_USE_SERVER_STORAGE !== 'false';

  // ============= SECURITY CONFIGURATION =============
  const ADMIN_PASSWORD = 'WaggyT2025!Secure'; // CHANGE BEFORE DEPLOYMENT!
  const MAX_LOGIN_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 15 * 60 * 1000;
  const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

  // ============= TOURNAMENT DATA =============
  const [tournamentData, setTournamentData] = useState(() => {
    const saved = localStorage.getItem('tournamentData');
    return saved ? JSON.parse(saved) : {
      name: "15th Annual Waggy T Super Knockout",
      year: 2025,
      venue: "Kirani James Athletics Stadium",
      location: "Grenada",
      logo: "https://i.imgur.com/35Plncl.png"
    };
  });

  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem('teams');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: "Honved SC", logo: null },
      { id: 2, name: "Paradise Youth", logo: null, isYouth: true },
      { id: 3, name: "10 X O Legends", logo: null },
      { id: 4, name: "Hurricanes SC Youth", logo: null, isYouth: true },
      { id: 5, name: "Combined Northerners", logo: null },
      { id: 6, name: "St. David FC Youth", logo: null, isYouth: true },
      { id: 7, name: "SAFL", logo: null },
      { id: 8, name: "Fontenoy SC", logo: null },
      { id: 9, name: "Sab Spartans", logo: null },
      { id: 10, name: "St. John's SC Youth", logo: null, isYouth: true },
      { id: 11, name: "Hard Rock", logo: null },
      { id: 12, name: "Sunjets United", logo: null },
      { id: 13, name: "Celebrity FC", logo: null },
      { id: 14, name: "Willis Youth", logo: null, isYouth: true },
      { id: 15, name: "Police Sports Club", logo: null },
      { id: 16, name: "North Stars", logo: null },
      { id: 17, name: "St. John's SC", logo: null },
      { id: 18, name: "Hurricanes", logo: null },
      { id: 19, name: "Chrollo FC", logo: null },
      { id: 20, name: "Queen's Park Rangers", logo: null },
      { id: 21, name: "Camerhogne", logo: null },
      { id: 22, name: "Paradise", logo: null },
      { id: 23, name: "Idlers SC", logo: null },
      { id: 24, name: "St. David FC", logo: null }
    ];
  });

  // ============= INITIAL MATCHES WITH COMPLETE ROUND 1 RESULTS =============
  const getInitialMatches = () => [
    // ROUND 1 - COMPLETE WITH RESULTS
    {
      id: 1,
      round: "Round 1",
      homeTeam: "Honved SC",
      awayTeam: "Paradise Youth",
      date: "2025-10-18",
      time: "18:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: 4,
      awayScore: 2,
      status: "completed",
      wonOnPenalties: null,
      penaltyScore: null,
      goalScorers: [
        { id: 11, team: 'away', player: 'Zade Rennie', minute: '5' },
        { id: 12, team: 'home', player: 'Kishon Duncan', minute: '7' },
        { id: 13, team: 'home', player: 'Kevin Bubb', minute: '20' },
        { id: 14, team: 'home', player: 'Keshon Abraham', minute: '36' },
        { id: 15, team: 'away', player: 'Keshon Abraham', minute: '36' },
        { id: 16, team: 'home', player: 'Kishon Duncan', minute: '56' }
      ]
    },
    {
      id: 2,
      round: "Round 1",
      homeTeam: "10 X O Legends",
      awayTeam: "Hurricanes SC Youth",
      date: "2025-10-18",
      time: "20:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: 2,
      awayScore: 1,
      status: "completed",
      wonOnPenalties: null,
      penaltyScore: null,
      goalScorers: [
        { id: 21, team: 'away', player: 'Dante Mitchell', minute: '6' },
        { id: 22, team: 'home', player: 'Erasto Ross', minute: '85' },
        { id: 23, team: 'home', player: 'Erasto Ross', minute: '91' }
      ]
    },
    {
      id: 3,
      round: "Round 1",
      homeTeam: "Combined Northerners",
      awayTeam: "St. David FC Youth",
      date: "2025-10-20",
      time: "18:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: 2,
      awayScore: 1,
      status: "completed",
      wonOnPenalties: null,
      penaltyScore: null,
      goalScorers: [
        { id: 31, team: 'home', player: 'Rayme Williams', minute: '18' },
        { id: 32, team: 'home', player: 'Shaquille Jones', minute: '53' },
        { id: 33, team: 'away', player: 'Kyle Jacob', minute: '94' }
      ]
    },
    {
      id: 4,
      round: "Round 1",
      homeTeam: "SAFL",
      awayTeam: "Fontenoy SC",
      date: "2025-10-20",
      time: "20:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: 2,
      awayScore: 2,
      status: "completed",
      wonOnPenalties: 'away',
      penaltyScore: {
        home: 2,
        away: 3
      },
      goalScorers: [
        { id: 41, team: 'home', player: 'Mike Francis', minute: '40' },
        { id: 42, team: 'home', player: 'Mike Francis', minute: '54' },
        { id: 43, team: 'away', player: 'Devonte Baptiste', minute: '72' },
        { id: 44, team: 'away', player: 'Joshua Sandy', minute: '82' }
      ]
    },
    {
      id: 5,
      round: "Round 1",
      homeTeam: "Sab Spartans",
      awayTeam: "St. John's SC Youth",
      date: "2025-10-22",
      time: "18:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: 8,
      awayScore: 0,
      status: "completed",
      wonOnPenalties: null,
      penaltyScore: null,
      goalScorers: [
        { id: 51, team: 'home', player: 'Aziel Antoine', minute: '6' },
        { id: 52, team: 'home', player: 'Kelly Panchoo', minute: '8' },
        { id: 53, team: 'home', player: 'Jefferson Harris', minute: '16' },
        { id: 54, team: 'home', player: 'Che Charles', minute: '23' },
        { id: 55, team: 'home', player: 'Che Charles', minute: '27' },
        { id: 56, team: 'home', player: 'Che Charles', minute: '33' },
        { id: 57, team: 'home', player: 'Che Charles', minute: '36' },
        { id: 58, team: 'home', player: 'Darren Moodoo', minute: '64' }
      ]
    },
    {
      id: 6,
      round: "Round 1",
      homeTeam: "Hard Rock",
      awayTeam: "Sunjets United",
      date: "2025-10-22",
      time: "20:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: 4,
      awayScore: 2,
      status: "completed",
      wonOnPenalties: null,
      penaltyScore: null,
      goalScorers: [
        { id: 61, team: 'home', player: 'Kendon Joseph', minute: '31' },
        { id: 62, team: 'away', player: 'Fidel Phillip', minute: '36' },
        { id: 63, team: 'home', player: 'Jamil Rocastle', minute: '55' },
        { id: 64, team: 'away', player: 'Fidel Phillip', minute: '56' },
        { id: 65, team: 'home', player: 'Kendon Joseph', minute: '59' },
        { id: 66, team: 'home', player: 'Jamil Rocastle', minute: '97' }
      ]
    },
    {
      id: 7,
      round: "Round 1",
      homeTeam: "Celebrity FC",
      awayTeam: "Willis Youth",
      date: "2025-10-24",
      time: "19:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: 2,
      awayScore: 0,
      status: "completed",
      wonOnPenalties: null,
      penaltyScore: null,
      goalScorers: [
        { id: 71, team: 'home', player: 'Kevron Charles', minute: '13' },
        { id: 72, team: 'home', player: 'Kevron Charles', minute: '47' }
      ]
    },
    {
      id: 8,
      round: "Round 1",
      homeTeam: "Police Sports Club",
      awayTeam: "North Stars",
      date: "2025-10-24",
      time: "21:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: 3,
      awayScore: 0,
      status: "completed",
      wonOnPenalties: null,
      penaltyScore: null,
      goalScorers: [
        { id: 81, team: 'home', player: 'Kriston Noel', minute: '21' },
        { id: 82, team: 'home', player: 'Kendon Julien', minute: '45' },
        { id: 83, team: 'home', player: 'Kriston Andrew', minute: '74' }
      ]
    },

    // ROUND 2 - UPDATED FROM DOCX
    {
      id: 9,
      round: "Round 2",
      homeTeam: "St. John's SC",
      awayTeam: "Combined Northerners",
      date: "2025-10-31",
      time: "19:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: null,
      awayScore: null,
      status: "scheduled",
      wonOnPenalties: null,
      penaltyScore: null,
      goalScorers: []
    },
    {
      id: 10,
      round: "Round 2",
      homeTeam: "Camerhogne",
      awayTeam: "Police Sports Club",
      date: "2025-10-31",
      time: "21:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: null,
      awayScore: null,
      status: "scheduled",
      wonOnPenalties: null,
      penaltyScore: null,
      goalScorers: []
    },
    {
      id: 11,
      round: "Round 2",
      homeTeam: "St. David FC",
      awayTeam: "Sab Spartans",
      date: "2025-11-01",
      time: "18:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: null,
      awayScore: null,
      status: "scheduled",
      wonOnPenalties: null,
      penaltyScore: null,
      goalScorers: []
    },
    {
      id: 12,
      round: "Round 2",
      homeTeam: "Queen's Park Rangers",
      awayTeam: "Hard Rock",
      date: "2025-11-01",
      time: "20:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: null,
      awayScore: null,
      status: "scheduled",
      wonOnPenalties: null,
      penaltyScore: null,
      goalScorers: []
    },
    {
      id: 13,
      round: "Round 2",
      homeTeam: "Hurricanes",
      awayTeam: "10 X O Legends",
      date: "2025-11-08",
      time: "19:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: null,
      awayScore: null,
      status: "scheduled",
      wonOnPenalties: null,
      penaltyScore: null,
      goalScorers: []
    },
    {
      id: 14,
      round: "Round 2",
      homeTeam: "Paradise",
      awayTeam: "Honved SC",
      date: "2025-11-08",
      time: "21:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: null,
      awayScore: null,
      status: "scheduled",
      wonOnPenalties: null,
      penaltyScore: null,
      goalScorers: []
    },
    {
      id: 15,
      round: "Round 2",
      homeTeam: "Chrollo FC",
      awayTeam: "Celebrity FC",
      date: "2025-11-09",
      time: "18:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: null,
      awayScore: null,
      status: "scheduled",
      wonOnPenalties: null,
      penaltyScore: null,
      goalScorers: []
    },
    {
      id: 16,
      round: "Round 2",
      homeTeam: "Idlers SC",
      awayTeam: "Fontenoy SC",
      date: "2025-11-09",
      time: "20:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: null,
      awayScore: null,
      status: "scheduled",
      wonOnPenalties: null,
      penaltyScore: null,
      goalScorers: []
    },

    // QUARTER FINALS
    {
      id: 17,
      round: "Quarter Finals",
      homeTeam: "TBD",
      awayTeam: "TBD",
      date: "2025-11-15",
      time: "19:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: null,
      awayScore: null,
      status: "scheduled",
      wonOnPenalties: null,
      penaltyScore: null,
      goalScorers: []
    },
    {
      id: 18,
      round: "Quarter Finals",
      homeTeam: "TBD",
      awayTeam: "TBD",
      date: "2025-11-15",
      time: "21:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: null,
      awayScore: null,
      status: "scheduled",
      wonOnPenalties: null,
      penaltyScore: null,
      goalScorers: []
    },
    {
      id: 19,
      round: "Quarter Finals",
      homeTeam: "TBD",
      awayTeam: "TBD",
      date: "2025-11-16",
      time: "18:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: null,
      awayScore: null,
      status: "scheduled",
      wonOnPenalties: null,
      penaltyScore: null,
      goalScorers: []
    },
    {
      id: 20,
      round: "Quarter Finals",
      homeTeam: "TBD",
      awayTeam: "TBD",
      date: "2025-11-16",
      time: "20:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: null,
      awayScore: null,
      status: "scheduled",
      wonOnPenalties: null,
      penaltyScore: null,
      goalScorers: []
    },

    // SEMI FINALS
    {
      id: 21,
      round: "Semi Finals",
      homeTeam: "TBD",
      awayTeam: "TBD",
      date: "2025-11-22",
      time: "19:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: null,
      awayScore: null,
      status: "scheduled",
      wonOnPenalties: null,
      penaltyScore: null,
      goalScorers: []
    },
    {
      id: 22,
      round: "Semi Finals",
      homeTeam: "TBD",
      awayTeam: "TBD",
      date: "2025-11-22",
      time: "21:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: null,
      awayScore: null,
      status: "scheduled",
      wonOnPenalties: null,
      penaltyScore: null,
      goalScorers: []
    },

    // FINALS
    {
      id: 23,
      round: "Third Place Playoff",
      homeTeam: "TBD",
      awayTeam: "TBD",
      date: "2025-12-06",
      time: "19:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: null,
      awayScore: null,
      status: "scheduled",
      wonOnPenalties: null,
      penaltyScore: null,
      goalScorers: []
    },
    {
      id: 24,
      round: "Final",
      homeTeam: "TBD",
      awayTeam: "TBD",
      date: "2025-12-06",
      time: "21:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: null,
      awayScore: null,
      status: "scheduled",
      wonOnPenalties: null,
      penaltyScore: null,
      goalScorers: []
    }
  ];

  const [matches, setMatches] = useState(() => {
    const saved = localStorage.getItem('matches');
    return saved ? JSON.parse(saved) : getInitialMatches();
  });

  // ============= SERVER SYNC FUNCTIONS =============
  const syncToServer = async (dataType, data) => {
    if (!USE_SERVER_STORAGE) return;
    
    try {
      setSyncStatus('syncing');
      const response = await fetch(`${API_BASE_URL}/tournament/${dataType}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Server sync failed');
      
      setLastSyncTime(new Date());
      setSyncStatus('synced');
    } catch (error) {
      console.error('Sync error:', error);
      setSyncStatus('error');
    }
  };

  const loadFromServer = async () => {
    if (!USE_SERVER_STORAGE) return null;
    
    try {
      const response = await fetch(`${API_BASE_URL}/tournament/data`);
      if (!response.ok) throw new Error('Server load failed');
      
      const serverData = await response.json();
      return serverData;
    } catch (error) {
      console.error('Load error:', error);
      return null;
    }
  };

  // ============= LOAD FROM SERVER ON MOUNT =============
  useEffect(() => {
    const initializeData = async () => {
      const serverData = await loadFromServer();
      if (serverData) {
        if (serverData.matches) setMatches(serverData.matches);
        if (serverData.teams) setTeams(serverData.teams);
        if (serverData.tournamentData) setTournamentData(serverData.tournamentData);
      }
    };
    initializeData();
  }, []);

  // ============= SAVE TO LOCALSTORAGE AND SERVER =============
  useEffect(() => {
    localStorage.setItem('matches', JSON.stringify(matches));
    syncToServer('matches', matches);
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams));
    syncToServer('teams', teams);
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('tournamentData', JSON.stringify(tournamentData));
    syncToServer('tournamentData', tournamentData);
  }, [tournamentData]);

  useEffect(() => {
    if (selectedMatchId) {
      localStorage.setItem('selectedMatchId', selectedMatchId.toString());
    } else {
      localStorage.removeItem('selectedMatchId');
    }
  }, [selectedMatchId]);

  // ============= TIME AND SESSION MANAGEMENT =============
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      if (sessionTimeout) clearTimeout(sessionTimeout);
      const timeout = setTimeout(() => {
        handleLogout('Session expired due to inactivity');
      }, SESSION_TIMEOUT_MS);
      setSessionTimeout(timeout);
      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated, matches, teams]);

  useEffect(() => {
    if (isLocked && lockoutTime) {
      const remaining = lockoutTime - Date.now();
      if (remaining > 0) {
        const timer = setTimeout(() => {
          setIsLocked(false);
          setLoginAttempts(0);
          setLockoutTime(null);
        }, remaining);
        return () => clearTimeout(timer);
      } else {
        setIsLocked(false);
        setLoginAttempts(0);
        setLockoutTime(null);
      }
    }
  }, [isLocked, lockoutTime]);

  // ============= HELPER FUNCTIONS =============
  
  // Parse minute to handle added time (45+2 -> 45.02)
  const parseMinute = (minute) => {
    const minuteStr = String(minute);
    if (minuteStr.includes('+')) {
      const [base, added] = minuteStr.split('+');
      return parseInt(base) + parseInt(added) / 100;
    }
    return parseInt(minuteStr);
  };

  const getSortedGoalScorers = (match) => {
    const sorted = [...match.goalScorers].sort((a, b) => 
      parseMinute(a.minute) - parseMinute(b.minute)
    );
    const homeGoals = sorted.filter(s => s.team === 'home');
    const awayGoals = sorted.filter(s => s.team === 'away');
    return { homeGoals, awayGoals };
  };

  const getMatchStatus = (match) => {
    if (match.homeScore !== null && match.awayScore !== null) {
      return 'completed';
    }
    const matchDate = new Date(`${match.date}T${match.time}:00`);
    const matchEndTime = new Date(matchDate.getTime() + 2 * 60 * 60 * 1000);
    if (currentDateTime >= matchDate && currentDateTime <= matchEndTime) {
      return 'live';
    } else if (currentDateTime > matchEndTime) {
      return 'completed';
    }
    return 'scheduled';
  };

  const getUpcomingMatches = () => {
    return matches
      .filter(m => getMatchStatus(m) === 'scheduled')
      .sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))
      .slice(0, 4);
  };

  const getLiveMatches = () => {
    return matches.filter(m => getMatchStatus(m) === 'live');
  };

  const getFilteredMatches = () => {
    if (selectedTeam === 'all') return matches;
    return matches.filter(m =>
      m.homeTeam.includes(selectedTeam) || m.awayTeam.includes(selectedTeam)
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getTeamLogo = (teamName) => {
    const team = teams.find(t => teamName.includes(t.name));
    return team?.logo;
  };

  // ============= AUTHENTICATION =============
  const handleLogin = () => {
    if (isLocked) {
      const remainingTime = Math.ceil((lockoutTime - Date.now()) / 1000 / 60);
      alert(`Too many failed attempts. Please try again in ${remainingTime} minutes.`);
      return;
    }

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setCurrentView('management');
      setPassword('');
      setLoginAttempts(0);
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        setIsLocked(true);
        setLockoutTime(Date.now() + LOCKOUT_DURATION);
        alert(`Too many failed login attempts. Account locked for 15 minutes.`);
        setPassword('');
      } else {
        const remainingAttempts = MAX_LOGIN_ATTEMPTS - newAttempts;
        alert(`Invalid password. ${remainingAttempts} attempt${remainingAttempts !== 1 ? 's' : ''} remaining.`);
        setPassword('');
      }
    }
  };

  const handleLogout = (reason = 'User logged out') => {
    setIsAuthenticated(false);
    setCurrentView('fan');
    setPassword('');
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
      setSessionTimeout(null);
    }
    if (reason !== 'User logged out') {
      alert(reason);
    }
  };

  // ============= MATCH MANAGEMENT =============
  const updateMatchScore = (matchId, homeScore, awayScore) => {
    setMatches(matches.map(m =>
      m.id === matchId ? { ...m, homeScore, awayScore, status: 'completed' } : m
    ));
  };

  const addGoalScorer = (matchId, team, player, minute) => {
    setMatches(matches.map(m =>
      m.id === matchId
        ? { ...m, goalScorers: [...m.goalScorers, { id: Date.now(), team, player, minute }] }
        : m
    ));
  };

  const updateGoalScorer = (matchId, scorerId, updatedScorer) => {
    setMatches(matches.map(m =>
      m.id === matchId
        ? { ...m, goalScorers: m.goalScorers.map(s => s.id === scorerId ? { ...s, ...updatedScorer } : s) }
        : m
    ));
  };

  const deleteGoalScorer = (matchId, scorerId) => {
    if (window.confirm('Are you sure you want to delete this goal scorer?')) {
      setMatches(matches.map(m =>
        m.id === matchId
          ? { ...m, goalScorers: m.goalScorers.filter(s => s.id !== scorerId) }
          : m
      ));
    }
  };

  const updateMatch = (matchId, updates) => {
    setMatches(matches.map(m =>
      m.id === matchId ? { ...m, ...updates } : m
    ));
    setEditingMatch(null);
  };

  const handleLogoUpload = (teamId, file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setTeams(teams.map(t =>
        t.id === teamId ? { ...t, logo: e.target.result } : t
      ));
    };
    reader.readAsDataURL(file);
  };

  // ============= VIEW COMPONENTS =============
  const ScheduleView = () => {
    const liveMatches = getLiveMatches();
    const upcomingMatches = getUpcomingMatches();
    const filteredMatches = getFilteredMatches();

    return (
      <div className="space-y-6">
        {/* Live Matches */}
        {liveMatches.length > 0 && (
          <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-lg p-6 text-white shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              <h2 className="text-2xl font-bold">LIVE NOW</h2>
            </div>
            {liveMatches.map(match => (
              <div key={match.id} className="bg-white text-gray-900 rounded-lg p-4 mb-3 last:mb-0">
                <div className="grid grid-cols-3 gap-4 items-center">
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {getTeamLogo(match.homeTeam) && (
                        <img src={getTeamLogo(match.homeTeam)} alt="" className="w-8 h-8 object-contain" />
                      )}
                      <span className="font-bold">{match.homeTeam}</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-3xl font-bold">{match.homeScore || 0}</span>
                      <span className="text-gray-400">-</span>
                      <span className="text-3xl font-bold">{match.awayScore || 0}</span>
                    </div>
                    <div className="text-xs text-red-600 font-bold mt-1 animate-pulse">LIVE</div>
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{match.awayTeam}</span>
                      {getTeamLogo(match.awayTeam) && (
                        <img src={getTeamLogo(match.awayTeam)} alt="" className="w-8 h-8 object-contain" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Upcoming Matches */}
        {upcomingMatches.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 border-2 border-red-600">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 text-gray-900">
              <Clock className="w-6 h-6 text-red-600" />
              Upcoming Matches
            </h2>
            <div className="space-y-3">
              {upcomingMatches.map(match => (
                <div key={match.id} className="border-l-4 border-red-600 pl-4 py-2 hover:bg-gray-50 transition">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-red-600">{match.round}</span>
                    <span className="text-xs text-gray-500">{formatTime(match.time)}</span>
                  </div>
                  <div className="font-semibold text-gray-900">{match.homeTeam} vs {match.awayTeam}</div>
                  <div className="text-sm text-gray-600">{formatDate(match.date)}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Matches by Round */}
        {['Round 1', 'Round 2', 'Quarter Finals', 'Semi Finals', 'Third Place Playoff', 'Final'].map(round => {
          const roundMatches = filteredMatches.filter(m => m.round === round);
          if (roundMatches.length === 0) return null;

          return (
            <div key={round} className="bg-white rounded-lg shadow-md p-6 border-2 border-gray-200">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900">
                <Trophy className="w-6 h-6 text-red-600" />
                {round}
              </h2>
              <div className="space-y-4">
                {roundMatches.map(match => {
                  const status = getMatchStatus(match);
                  const isHomeWinner = match.homeScore !== null && match.awayScore !== null &&
                    (match.homeScore > match.awayScore || (match.homeScore === match.awayScore && match.wonOnPenalties === 'home'));
                  const isAwayWinner = match.homeScore !== null && match.awayScore !== null &&
                    (match.awayScore > match.homeScore || (match.homeScore === match.awayScore && match.wonOnPenalties === 'away'));
                  const { homeGoals, awayGoals } = getSortedGoalScorers(match);

                  return (
                    <div key={match.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-red-600 transition">
                      <div className="flex justify-between items-center mb-3 text-sm text-gray-600">
                        <div className="flex items-center gap-4">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(match.date)}</span>
                          <Clock className="w-4 h-4 ml-2" />
                          <span>{formatTime(match.time)}</span>
                        </div>
                        {status === 'live' && (
                          <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full animate-pulse">
                            LIVE
                          </span>
                        )}
                        {status === 'completed' && (
                          <span className="px-3 py-1 bg-gray-600 text-white text-xs font-bold rounded-full">
                            FT{match.wonOnPenalties ? ' (Pens)' : ''}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-4 items-center">
                        <div className="text-right">
                          <div className={`flex items-center justify-end gap-2 mb-1 ${isHomeWinner ? 'scale-105' : ''}`}>
                            {getTeamLogo(match.homeTeam) && (
                              <img src={getTeamLogo(match.homeTeam)} alt="" className="w-8 h-8 object-contain" />
                            )}
                            <span className={`text-lg ${isHomeWinner ? 'font-black text-red-600' : 'font-semibold'}`}>
                              {match.homeTeam}
                            </span>
                            {isHomeWinner && <span className="text-red-600 text-xl">🏆</span>}
                          </div>
                        </div>

                        <div className="text-center">
                          {status === 'completed' ? (
                            <div className="flex items-center justify-center gap-3">
                              <span className={`text-3xl font-bold ${isHomeWinner ? 'text-red-600' : 'text-gray-900'}`}>
                                {match.homeScore}
                              </span>
                              <span className="text-gray-400">-</span>
                              <span className={`text-3xl font-bold ${isAwayWinner ? 'text-red-600' : 'text-gray-900'}`}>
                                {match.awayScore}
                              </span>
                            </div>
                          ) : (
                            <div className="text-gray-400 text-sm font-medium">VS</div>
                          )}
                          {match.wonOnPenalties && match.penaltyScore && (
                            <div className="mt-2">
                              <div className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-300 rounded-full px-3 py-1">
                                <span className="text-xs text-yellow-800">Penalties:</span>
                                <span className="text-sm font-bold text-gray-900">
                                  {match.penaltyScore.home} - {match.penaltyScore.away}
                                </span>
                                {match.wonOnPenalties === 'home' && (
                                  <span className="text-red-600 text-xs">← Winner</span>
                                )}
                                {match.wonOnPenalties === 'away' && (
                                  <span className="text-red-600 text-xs">Winner →</span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="text-left">
                          <div className={`flex items-center gap-2 mb-1 ${isAwayWinner ? 'scale-105' : ''}`}>
                            {isAwayWinner && <span className="text-red-600 text-xl">🏆</span>}
                            <span className={`text-lg ${isAwayWinner ? 'font-black text-red-600' : 'font-semibold'}`}>
                              {match.awayTeam}
                            </span>
                            {getTeamLogo(match.awayTeam) && (
                              <img src={getTeamLogo(match.awayTeam)} alt="" className="w-8 h-8 object-contain" />
                            )}
                          </div>
                        </div>
                      </div>

                      {(homeGoals.length > 0 || awayGoals.length > 0) && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="text-right">
                              {homeGoals.length > 0 && (
                                <div className="space-y-1">
                                  <div className="font-semibold text-gray-700 mb-2">{match.homeTeam}</div>
                                  {homeGoals.map((scorer, idx) => (
                                    <div key={idx} className="text-gray-600">
                                      ⚽ {scorer.player} {scorer.minute}'
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            <div className="text-left">
                              {awayGoals.length > 0 && (
                                <div className="space-y-1">
                                  <div className="font-semibold text-gray-700 mb-2">{match.awayTeam}</div>
                                  {awayGoals.map((scorer, idx) => (
                                    <div key={idx} className="text-gray-600">
                                      ⚽ {scorer.player} {scorer.minute}'
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-1 mt-3 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span>{match.venue}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const BracketView = () => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border-2 border-red-600">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900">Tournament Bracket</h2>
        <div className="overflow-x-auto">
          <div className="min-w-[800px] space-y-8">
            {['Round 1', 'Round 2', 'Quarter Finals', 'Semi Finals'].map(roundName => {
              const roundMatches = matches.filter(m => m.round === roundName);
              if (roundMatches.length === 0) return null;

              return (
                <div key={roundName}>
                  <h3 className="text-lg font-bold mb-4 text-center text-red-600">{roundName}</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {roundMatches.map(match => {
                      const isHomeWinner = match.homeScore !== null && match.awayScore !== null &&
                        (match.homeScore > match.awayScore || (match.homeScore === match.awayScore && match.wonOnPenalties === 'home'));
                      const isAwayWinner = match.homeScore !== null && match.awayScore !== null &&
                        (match.awayScore > match.homeScore || (match.homeScore === match.awayScore && match.wonOnPenalties === 'away'));

                      return (
                        <div key={match.id} className="bg-gray-50 border-2 border-gray-300 rounded p-3">
                          <div className="text-xs text-gray-500 mb-2">{formatDate(match.date)}</div>
                          <div className="space-y-1">
                            <div className={`flex justify-between items-center p-2 rounded ${isHomeWinner ? 'bg-red-100 font-bold border-2 border-red-600' : 'bg-white'}`}>
                              <span className="text-sm">{match.homeTeam}</span>
                              {match.homeScore !== null && (
                                <div className="flex items-center gap-1">
                                  <span className="text-sm font-bold">{match.homeScore}</span>
                                  {match.wonOnPenalties === 'home' && <span className="text-xs text-red-600">(P)</span>}
                                </div>
                              )}
                            </div>
                            <div className={`flex justify-between items-center p-2 rounded ${isAwayWinner ? 'bg-red-100 font-bold border-2 border-red-600' : 'bg-white'}`}>
                              <span className="text-sm">{match.awayTeam}</span>
                              {match.awayScore !== null && (
                                <div className="flex items-center gap-1">
                                  <span className="text-sm font-bold">{match.awayScore}</span>
                                  {match.wonOnPenalties === 'away' && <span className="text-xs text-red-600">(P)</span>}
                                </div>
                              )}
                            </div>
                          </div>
                          {match.wonOnPenalties && match.penaltyScore && (
                            <div className="text-xs text-center mt-1 text-gray-600">
                              Pens: {match.penaltyScore.home}-{match.penaltyScore.away}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Finals */}
            <div>
              <h3 className="text-lg font-bold mb-4 text-center text-red-600">Finals</h3>
              <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                {matches.filter(m => m.round === 'Third Place Playoff' || m.round === 'Final').map(match => {
                  const isHomeWinner = match.homeScore !== null && match.awayScore !== null &&
                    (match.homeScore > match.awayScore || (match.homeScore === match.awayScore && match.wonOnPenalties === 'home'));
                  const isAwayWinner = match.homeScore !== null && match.awayScore !== null &&
                    (match.awayScore > match.homeScore || (match.homeScore === match.awayScore && match.wonOnPenalties === 'away'));

                  return (
                    <div key={match.id} className={`bg-gray-50 border-2 rounded p-3 ${match.round === 'Final' ? 'border-red-600 bg-red-50' : 'border-gray-300'}`}>
                      <div className="text-xs font-bold mb-2 text-center">{match.round}</div>
                      <div className="text-xs text-gray-500 mb-2 text-center">{formatDate(match.date)}</div>
                      <div className="space-y-1">
                        <div className={`flex justify-between items-center p-2 rounded ${isHomeWinner ? 'bg-red-100 font-bold border-2 border-red-600' : 'bg-white'}`}>
                          <span className="text-sm">{match.homeTeam}</span>
                          {match.homeScore !== null && (
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-bold">{match.homeScore}</span>
                              {match.wonOnPenalties === 'home' && <span className="text-xs text-red-600">(P)</span>}
                            </div>
                          )}
                        </div>
                        <div className={`flex justify-between items-center p-2 rounded ${isAwayWinner ? 'bg-red-100 font-bold border-2 border-red-600' : 'bg-white'}`}>
                          <span className="text-sm">{match.awayTeam}</span>
                          {match.awayScore !== null && (
                            <div className="flex items-center gap-1">
                              <span className="text-sm font-bold">{match.awayScore}</span>
                              {match.wonOnPenalties === 'away' && <span className="text-xs text-red-600">(P)</span>}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ResultsView = () => {
    const completedMatches = matches.filter(m => m.homeScore !== null && m.awayScore !== null);

    return (
      <div className="bg-white rounded-lg shadow-md p-6 border-2 border-red-600">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Match Results</h2>
        {completedMatches.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>No completed matches yet. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {completedMatches.map(match => {
              const isHomeWinner = match.homeScore > match.awayScore || (match.homeScore === match.awayScore && match.wonOnPenalties === 'home');
              const isAwayWinner = match.awayScore > match.homeScore || (match.homeScore === match.awayScore && match.wonOnPenalties === 'away');
              const { homeGoals, awayGoals } = getSortedGoalScorers(match);

              return (
                <div key={match.id} className="border-2 border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-red-600">{match.round}</span>
                    <span className="text-xs text-gray-500">{formatDate(match.date)}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 items-center mb-4">
                    <div className="text-right">
                      <span className={`text-lg ${isHomeWinner ? 'font-black text-red-600' : 'font-semibold'}`}>
                        {match.homeTeam}
                      </span>
                      {isHomeWinner && <span className="ml-2 text-red-600">🏆</span>}
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-3">
                        <span className={`text-3xl font-bold ${isHomeWinner ? 'text-red-600' : 'text-gray-900'}`}>
                          {match.homeScore}
                        </span>
                        <span className="text-gray-400">-</span>
                        <span className={`text-3xl font-bold ${isAwayWinner ? 'text-red-600' : 'text-gray-900'}`}>
                          {match.awayScore}
                        </span>
                      </div>
                      {match.wonOnPenalties && match.penaltyScore && (
                        <div className="text-xs text-red-600 font-semibold mt-1">
                          {match.wonOnPenalties === 'home' ? match.homeTeam : match.awayTeam} won{' '}
                          {match.penaltyScore.home}-{match.penaltyScore.away} on penalties
                        </div>
                      )}
                    </div>
                    <div className="text-left">
                      {isAwayWinner && <span className="mr-2 text-red-600">🏆</span>}
                      <span className={`text-lg ${isAwayWinner ? 'font-black text-red-600' : 'font-semibold'}`}>
                        {match.awayTeam}
                      </span>
                    </div>
                  </div>

                  {(homeGoals.length > 0 || awayGoals.length > 0) && (
                    <div className="pt-3 border-t border-gray-100">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-right">
                          {homeGoals.length > 0 && (
                            <div className="space-y-1">
                              <div className="font-semibold text-gray-700 mb-2">{match.homeTeam}</div>
                              {homeGoals.map((scorer, idx) => (
                                <div key={idx} className="text-gray-600">
                                  ⚽ {scorer.player} {scorer.minute}'
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="text-left">
                          {awayGoals.length > 0 && (
                            <div className="space-y-1">
                              <div className="font-semibold text-gray-700 mb-2">{match.awayTeam}</div>
                              {awayGoals.map((scorer, idx) => (
                                <div key={idx} className="text-gray-600">
                                  ⚽ {scorer.player} {scorer.minute}'
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // ============= MANAGEMENT VIEW =============
  const ManagementView = () => {
    const [goalScorerData, setGoalScorerData] = useState({ player: '', team: 'home', minute: '' });
    const [editingScorer, setEditingScorer] = useState(null);
    const [editingMatchDetails, setEditingMatchDetails] = useState(null);

    const selectedMatch = selectedMatchId ? matches.find(m => m.id === selectedMatchId) : null;

    const validateMinute = (minute) => {
      if (minute === '') return true;
      if (/^\d+$/.test(minute)) {
        const num = parseInt(minute);
        return num >= 1 && num <= 120;
      }
      if (/^\d+\+\d+$/.test(minute)) {
        const [base, added] = minute.split('+').map(n => parseInt(n));
        if (base === 45 && added >= 1 && added <= 10) return true;
        if (base === 90 && added >= 1 && added <= 15) return true;
        return false;
      }
      return false;
    };

    const handleAddGoalScorer = () => {
      if (!goalScorerData.player || !goalScorerData.minute) {
        alert('Please enter both player name and minute');
        return;
      }
      if (!validateMinute(goalScorerData.minute)) {
        alert('Invalid minute format. Use: 45, 45+2, 90+4, etc.');
        return;
      }
      addGoalScorer(selectedMatch.id, goalScorerData.team, goalScorerData.player, goalScorerData.minute);
      setGoalScorerData({ player: '', team: 'home', minute: '' });
    };

    const handleUpdateGoalScorer = (scorerId) => {
      if (!editingScorer.player || !editingScorer.minute) {
        alert('Please enter both player name and minute');
        return;
      }
      if (!validateMinute(editingScorer.minute)) {
        alert('Invalid minute format. Use: 45, 45+2, 90+4, etc.');
        return;
      }
      updateGoalScorer(selectedMatch.id, scorerId, {
        player: editingScorer.player,
        team: editingScorer.team,
        minute: editingScorer.minute
      });
      setEditingScorer(null);
    };

    const { homeGoals, awayGoals } = selectedMatch ? getSortedGoalScorers(selectedMatch) : { homeGoals: [], awayGoals: [] };

    return (
      <div className="space-y-6">
        {/* Security Status Banner */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg shadow-lg p-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <span className="text-2xl">✅</span>
              </div>
              <div>
                <div className="font-bold text-lg">Management Portal - Authenticated</div>
                <div className="text-sm opacity-90 flex items-center gap-2">
                  Session timeout: 30 min
                  {syncStatus === 'syncing' && <RefreshCw className="w-4 h-4 animate-spin" />}
                  {syncStatus === 'synced' && <Database className="w-4 h-4" />}
                  {syncStatus === 'error' && <span className="text-yellow-300">⚠️ Offline mode</span>}
                </div>
              </div>
            </div>
            <button
              onClick={() => handleLogout('User logged out')}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition backdrop-blur"
            >
              🔒 Logout
            </button>
          </div>
        </div>

        {/* Match Management */}
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-red-600">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Match Management</h2>

          {/* Match Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Match</label>
            <select
              value={selectedMatchId || ''}
              onChange={(e) => {
                const matchId = parseInt(e.target.value);
                setSelectedMatchId(matchId || null);
                setEditingScorer(null);
              }}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600"
            >
              <option value="">Choose a match...</option>
              {matches.map(match => (
                <option key={match.id} value={match.id}>
                  {match.homeTeam} vs {match.awayTeam} - {formatDate(match.date)} ({match.round})
                </option>
              ))}
            </select>
          </div>

          {selectedMatch && (
            <div className="space-y-6 border-t pt-6">
              {/* Score Entry */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-gray-900">Update Score</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {selectedMatch.homeTeam} Score
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={selectedMatch.homeScore ?? ''}
                      onChange={(e) => updateMatchScore(selectedMatch.id, parseInt(e.target.value) || 0, selectedMatch.awayScore)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {selectedMatch.awayTeam} Score
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={selectedMatch.awayScore ?? ''}
                      onChange={(e) => updateMatchScore(selectedMatch.id, selectedMatch.homeScore, parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600"
                    />
                  </div>
                </div>

                {/* Penalty Shootout */}
                {selectedMatch.homeScore !== null && selectedMatch.awayScore !== null && selectedMatch.homeScore === selectedMatch.awayScore && (
                  <div className="mt-4 p-4 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
                    <h4 className="font-bold text-yellow-800 mb-3">⚽ Penalty Shootout</h4>
                    <p className="text-sm text-yellow-700 mb-3">Match is tied! Select the team that won on penalties:</p>
                    <div className="flex gap-3 mb-4">
                      <button
                        onClick={() => {
                          setMatches(matches.map(m =>
                            m.id === selectedMatch.id ? { ...m, wonOnPenalties: 'home' } : m
                          ));
                        }}
                        className={`flex-1 px-4 py-3 rounded-lg font-semibold transition ${selectedMatch.wonOnPenalties === 'home'
                            ? 'bg-red-600 text-white'
                            : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-red-600'
                          }`}
                      >
                        {selectedMatch.homeTeam} Won
                      </button>
                      <button
                        onClick={() => {
                          setMatches(matches.map(m =>
                            m.id === selectedMatch.id ? { ...m, wonOnPenalties: 'away' } : m
                          ));
                        }}
                        className={`flex-1 px-4 py-3 rounded-lg font-semibold transition ${selectedMatch.wonOnPenalties === 'away'
                            ? 'bg-red-600 text-white'
                            : 'bg-white text-gray-700 border-2 border-gray-300 hover:border-red-600'
                          }`}
                      >
                        {selectedMatch.awayTeam} Won
                      </button>
                    </div>

                    {/* Penalty Score Input */}
                    {selectedMatch.wonOnPenalties && (
                      <div className="bg-white border-2 border-yellow-400 rounded-lg p-4">
                        <h5 className="font-semibold text-gray-800 mb-3">Penalty Shootout Score</h5>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {selectedMatch.homeTeam} Penalties
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="10"
                              value={selectedMatch.penaltyScore?.home ?? ''}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                setMatches(matches.map(m =>
                                  m.id === selectedMatch.id
                                    ? {
                                        ...m,
                                        penaltyScore: {
                                          home: value,
                                          away: m.penaltyScore?.away || 0
                                        }
                                      }
                                    : m
                                ));
                              }}
                              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {selectedMatch.awayTeam} Penalties
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="10"
                              value={selectedMatch.penaltyScore?.away ?? ''}
                              onChange={(e) => {
                                const value = parseInt(e.target.value) || 0;
                                setMatches(matches.map(m =>
                                  m.id === selectedMatch.id
                                    ? {
                                        ...m,
                                        penaltyScore: {
                                          home: m.penaltyScore?.home || 0,
                                          away: value
                                        }
                                      }
                                    : m
                                ));
                              }}
                              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
                              placeholder="0"
                            />
                          </div>
                        </div>

                        {/* Preview */}
                        {selectedMatch.penaltyScore?.home != null &&
                         selectedMatch.penaltyScore?.away != null && (
                          <div className="mt-3 text-center">
                            <p className="text-sm text-gray-600">Preview:</p>
                            <p className="text-lg font-bold text-red-600">
                              {selectedMatch.wonOnPenalties === 'home'
                                ? selectedMatch.homeTeam
                                : selectedMatch.awayTeam
                              } won {selectedMatch.penaltyScore.home}-{selectedMatch.penaltyScore.away} on penalties
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {selectedMatch.wonOnPenalties && (
                      <button
                        onClick={() => {
                          setMatches(matches.map(m =>
                            m.id === selectedMatch.id ? { ...m, wonOnPenalties: null, penaltyScore: null } : m
                          ));
                        }}
                        className="mt-3 w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm"
                      >
                        Clear Penalty Result
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Goal Scorers */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-gray-900">Manage Goal Scorers</h3>

                {/* Add Goal Scorer Form */}
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-red-900 mb-3">Add New Goal</h4>
                  <div className="grid grid-cols-4 gap-4 mb-3">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Player Name</label>
                      <input
                        type="text"
                        value={goalScorerData.player}
                        onChange={(e) => setGoalScorerData({ ...goalScorerData, player: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
                        placeholder="Enter player name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Team</label>
                      <select
                        value={goalScorerData.team}
                        onChange={(e) => setGoalScorerData({ ...goalScorerData, team: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
                      >
                        <option value="home">{selectedMatch.homeTeam}</option>
                        <option value="away">{selectedMatch.awayTeam}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Minute</label>
                      <input
                        type="text"
                        value={goalScorerData.minute}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === '' || /^\d+$/.test(value) || /^\d+\+\d+$/.test(value)) {
                            setGoalScorerData({ ...goalScorerData, minute: value });
                          }
                        }}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
                        placeholder="45, 45+2"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">
                    Regular time: 45 | Added time: 45+2, 90+4
                  </p>
                  <button
                    onClick={handleAddGoalScorer}
                    className="w-full px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                  >
                    ➕ Add Goal Scorer
                  </button>
                </div>

                {/* Display Goal Scorers by Team */}
                {(homeGoals.length > 0 || awayGoals.length > 0) && (
                  <div className="grid grid-cols-2 gap-4">
                    {/* Home Team Goals */}
                    <div className="border-2 border-gray-200 rounded-lg p-4">
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="text-red-600">🏠</span>
                        {selectedMatch.homeTeam}
                      </h4>
                      {homeGoals.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No goals yet</p>
                      ) : (
                        <div className="space-y-2">
                          {homeGoals.map((scorer) => (
                            <div key={scorer.id}>
                              {editingScorer?.id === scorer.id ? (
                                <div className="bg-yellow-50 border border-yellow-300 rounded p-2 space-y-2">
                                  <input
                                    type="text"
                                    value={editingScorer.player}
                                    onChange={(e) => setEditingScorer({ ...editingScorer, player: e.target.value })}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                    placeholder="Player name"
                                  />
                                  <input
                                    type="text"
                                    value={editingScorer.minute}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (value === '' || /^\d+$/.test(value) || /^\d+\+\d+$/.test(value)) {
                                        setEditingScorer({ ...editingScorer, minute: value });
                                      }
                                    }}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                    placeholder="Minute"
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleUpdateGoalScorer(scorer.id)}
                                      className="flex-1 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                                    >
                                      <Save className="w-3 h-3 inline mr-1" />
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingScorer(null)}
                                      className="flex-1 px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
                                    >
                                      <X className="w-3 h-3 inline mr-1" />
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between bg-gray-50 rounded p-2 hover:bg-gray-100 transition">
                                  <span className="text-sm text-gray-700">
                                    ⚽ {scorer.player} <span className="text-gray-500">{scorer.minute}'</span>
                                  </span>
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => setEditingScorer({ ...scorer })}
                                      className="p-1 text-red-600 hover:bg-red-100 rounded transition"
                                      title="Edit"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => deleteGoalScorer(selectedMatch.id, scorer.id)}
                                      className="p-1 text-red-600 hover:bg-red-100 rounded transition"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Away Team Goals */}
                    <div className="border-2 border-gray-200 rounded-lg p-4">
                      <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                        <span className="text-gray-600">✈️</span>
                        {selectedMatch.awayTeam}
                      </h4>
                      {awayGoals.length === 0 ? (
                        <p className="text-sm text-gray-500 italic">No goals yet</p>
                      ) : (
                        <div className="space-y-2">
                          {awayGoals.map((scorer) => (
                            <div key={scorer.id}>
                              {editingScorer?.id === scorer.id ? (
                                <div className="bg-yellow-50 border border-yellow-300 rounded p-2 space-y-2">
                                  <input
                                    type="text"
                                    value={editingScorer.player}
                                    onChange={(e) => setEditingScorer({ ...editingScorer, player: e.target.value })}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                    placeholder="Player name"
                                  />
                                  <input
                                    type="text"
                                    value={editingScorer.minute}
                                    onChange={(e) => {
                                      const value = e.target.value;
                                      if (value === '' || /^\d+$/.test(value) || /^\d+\+\d+$/.test(value)) {
                                        setEditingScorer({ ...editingScorer, minute: value });
                                      }
                                    }}
                                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded"
                                    placeholder="Minute"
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleUpdateGoalScorer(scorer.id)}
                                      className="flex-1 px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                                    >
                                      <Save className="w-3 h-3 inline mr-1" />
                                      Save
                                    </button>
                                    <button
                                      onClick={() => setEditingScorer(null)}
                                      className="flex-1 px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
                                    >
                                      <X className="w-3 h-3 inline mr-1" />
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between bg-gray-50 rounded p-2 hover:bg-gray-100 transition">
                                  <span className="text-sm text-gray-700">
                                    ⚽ {scorer.player} <span className="text-gray-500">{scorer.minute}'</span>
                                  </span>
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => setEditingScorer({ ...scorer })}
                                      className="p-1 text-red-600 hover:bg-red-100 rounded transition"
                                      title="Edit"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => deleteGoalScorer(selectedMatch.id, scorer.id)}
                                      className="p-1 text-red-600 hover:bg-red-100 rounded transition"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Edit Match Details */}
              <div>
                <h3 className="text-lg font-bold mb-4 text-gray-900">Edit Match Details</h3>
                {editingMatch === selectedMatch.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                        <input
                          type="date"
                          value={editingMatchDetails?.date || selectedMatch.date}
                          onChange={(e) => setEditingMatchDetails({ ...editingMatchDetails, date: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Time</label>
                        <input
                          type="time"
                          value={editingMatchDetails?.time || selectedMatch.time}
                          onChange={(e) => setEditingMatchDetails({ ...editingMatchDetails, time: e.target.value })}
                          className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Venue</label>
                      <input
                        type="text"
                        value={editingMatchDetails?.venue || selectedMatch.venue}
                        onChange={(e) => setEditingMatchDetails({ ...editingMatchDetails, venue: e.target.value })}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          updateMatch(selectedMatch.id, editingMatchDetails);
                          setEditingMatchDetails(null);
                        }}
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        Save Changes
                      </button>
                      <button
                        onClick={() => {
                          setEditingMatch(null);
                          setEditingMatchDetails(null);
                        }}
                        className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition flex items-center gap-2"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-600">Date</div>
                        <div className="font-semibold">{formatDate(selectedMatch.date)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Time</div>
                        <div className="font-semibold">{formatTime(selectedMatch.time)}</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Venue</div>
                        <div className="font-semibold text-sm">{selectedMatch.venue}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setEditingMatch(selectedMatch.id);
                        setEditingMatchDetails({
                          date: selectedMatch.date,
                          time: selectedMatch.time,
                          venue: selectedMatch.venue
                        });
                      }}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit Match Details
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Team Logo Management */}
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-red-600">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Team Logo Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map(team => (
              <div key={team.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-red-600 transition">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{team.name}</h3>
                  {team.logo && (
                    <img src={team.logo} alt={team.name} className="w-12 h-12 object-contain" />
                  )}
                </div>
                <label className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition cursor-pointer text-sm">
                  <Upload className="w-4 h-4" />
                  {team.logo ? 'Change Logo' : 'Upload Logo'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files[0] && handleLogoUpload(team.id, e.target.files[0])}
                    className="hidden"
                  />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-lg shadow-md p-6 border-2 border-red-600">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Data Management</h2>
          <div className="space-y-4">
            <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
              <h3 className="font-bold text-yellow-800 mb-2">⚠️ Danger Zone</h3>
              <p className="text-sm text-yellow-700 mb-4">
                This will reset all tournament data to initial state. This action cannot be undone.
              </p>
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear ALL tournament data? This cannot be undone!')) {
                    if (window.confirm('Final confirmation: Continue?')) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }
                }}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
              >
                🗑️ Clear All Data & Reset
              </button>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-900 mb-2">💾 Data Storage</h3>
              <p className="text-sm text-red-700 mb-2">
                {USE_SERVER_STORAGE
                  ? 'Data is synced to server and saved locally. All changes are backed up.'
                  : 'Data is saved locally in your browser only.'}
              </p>
              {lastSyncTime && (
                <p className="text-xs text-red-600">
                  Last sync: {lastSyncTime.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // ============= MAIN RENDER =============
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 via-black to-red-600 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={tournamentData.logo} alt="Tournament Logo" className="w-16 h-16 object-contain bg-white rounded-full p-2" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{tournamentData.name}</h1>
                <p className="text-sm md:text-base opacity-90">{tournamentData.location} • {tournamentData.year}</p>
              </div>
            </div>
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex gap-2 items-center">
              <button
                onClick={() => { setCurrentView('fan'); setActiveTab('schedule'); }}
                className={`px-6 py-2 rounded-lg font-semibold transition ${currentView === 'fan' ? 'bg-white text-red-600' : 'bg-white/10 hover:bg-white/20'}`}
              >
                Fan View
              </button>
              <button
                onClick={() => !isAuthenticated ? setCurrentView('login') : setCurrentView('management')}
                className={`px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2 ${currentView === 'management' || currentView === 'login'
                    ? 'bg-white text-red-600'
                    : 'bg-white/10 hover:bg-white/20'
                  }`}
              >
                <Users className="w-5 h-5" />
                Management
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-white/20 p-4 space-y-2">
            <button
              onClick={() => { setCurrentView('fan'); setActiveTab('schedule'); setShowMobileMenu(false); }}
              className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition text-left"
            >
              Fan View
            </button>
            <button
              onClick={() => { !isAuthenticated ? setCurrentView('login') : setCurrentView('management'); setShowMobileMenu(false); }}
              className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition text-left flex items-center gap-2"
            >
              <Users className="w-5 h-5" />
              Management
            </button>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentView === 'login' && !isAuthenticated && (
          <div className="max-w-md mx-auto">
            <div className="bg-white rounded-lg shadow-xl p-8 border-2 border-red-600">
              <div className="text-center mb-6">
                <div className="bg-gradient-to-r from-red-600 to-black text-white p-4 rounded-full inline-block mb-4">
                  <Users className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Management Portal</h2>
                <p className="text-sm text-gray-600 mt-2">Secure access for tournament administrators</p>
              </div>

              {isLocked ? (
                <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 text-center">
                  <div className="text-red-600 font-bold text-lg mb-2">🔒 Account Locked</div>
                  <p className="text-red-700 text-sm">
                    Too many failed login attempts. Please try again in {Math.ceil((lockoutTime - Date.now()) / 1000 / 60)} minutes.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Administrator Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-600 focus:border-red-600 pr-12"
                        placeholder="Enter secure password"
                        disabled={isLocked}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? '🙈' : '👁️'}
                      </button>
                    </div>
                    {loginAttempts > 0 && !isLocked && (
                      <p className="text-sm text-orange-600 mt-2">
                        ⚠️ {MAX_LOGIN_ATTEMPTS - loginAttempts} attempt{MAX_LOGIN_ATTEMPTS - loginAttempts !== 1 ? 's' : ''} remaining
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleLogin}
                    disabled={isLocked}
                    className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-black text-white rounded-lg hover:from-red-700 hover:to-gray-900 transition font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    🔓 Login to Management Portal
                  </button>

                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
                    <div className="font-semibold mb-2">🔒 Security Features:</div>
                    <ul className="space-y-1 text-xs">
                      <li>• Maximum {MAX_LOGIN_ATTEMPTS} login attempts</li>
                      <li>• 15-minute lockout after failed attempts</li>
                      <li>• 30-minute automatic session timeout</li>
                      <li>• Activity-based session renewal</li>
                    </ul>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 text-center">
                    <p className="text-xs text-yellow-800">
                      <strong>⚠️ Default Password:</strong> WaggyT2025!Secure<br />
                      <span className="text-red-600 font-semibold">Change this in the code before deployment!</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {currentView === 'fan' && (
          <>
            {/* Fan Navigation */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
              <button
                onClick={() => setActiveTab('schedule')}
                className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition flex items-center gap-2 ${activeTab === 'schedule' ? 'bg-red-600 text-white shadow-md' : 'bg-white hover:bg-gray-50 border-2 border-gray-200'}`}
              >
                <Calendar className="w-5 h-5" />
                Schedule
              </button>
              <button
                onClick={() => setActiveTab('bracket')}
                className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition flex items-center gap-2 ${activeTab === 'bracket' ? 'bg-red-600 text-white shadow-md' : 'bg-white hover:bg-gray-50 border-2 border-gray-200'}`}
              >
                <Trophy className="w-5 h-5" />
                Bracket
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition flex items-center gap-2 ${activeTab === 'results' ? 'bg-red-600 text-white shadow-md' : 'bg-white hover:bg-gray-50 border-2 border-gray-200'}`}
              >
                <Users className="w-5 h-5" />
                Results
              </button>
            </div>

            {activeTab === 'schedule' && <ScheduleView />}
            {activeTab === 'bracket' && <BracketView />}
            {activeTab === 'results' && <ResultsView />}
          </>
        )}

        {currentView === 'management' && isAuthenticated && <ManagementView />}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-black via-red-900 to-black text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm opacity-75">
            {tournamentData.name} • {tournamentData.venue}
          </p>
          <p className="text-xs opacity-50 mt-2">
            Fixtures and venues are liable to be changed during the tournament.
            Teams will be notified no less than 4 hours of these changes.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TournamentApp;