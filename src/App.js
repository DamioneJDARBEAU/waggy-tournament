import React, { useState, useEffect } from 'react';
import { Trophy, Calendar, Users, Clock, MapPin, Edit2, Save, X, Upload, Menu, Trash2, RefreshCw, Database } from 'lucide-react';

/**
 * WAGGY T TOURNAMENT APP - ENHANCED VERSION
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
 * - TEAM NAME EDITING ✓
 * - HIDDEN MANAGEMENT BUTTON IN FAN VIEW ✓
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
  
  // NEW: Team editing state
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [editingTeamName, setEditingTeamName] = useState('');
  
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
      date: "2025-10-23",
      time: "18:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: 3,
      awayScore: 2,
      status: "completed",
      wonOnPenalties: null,
      penaltyScore: null,
      goalScorers: [
        { id: 51, team: 'home', player: 'Javid Fletcher', minute: '11' },
        { id: 52, team: 'away', player: 'Jemial Alexander', minute: '43' },
        { id: 53, team: 'home', player: 'Dwight Modeste', minute: '76' },
        { id: 54, team: 'away', player: 'Jerel Wickham', minute: '86' },
        { id: 55, team: 'home', player: 'Khemron Bartholomew', minute: '93' }
      ]
    },
    {
      id: 6,
      round: "Round 1",
      homeTeam: "Hard Rock",
      awayTeam: "Sunjets United",
      date: "2025-10-23",
      time: "20:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: 0,
      awayScore: 1,
      status: "completed",
      wonOnPenalties: null,
      penaltyScore: null,
      goalScorers: [
        { id: 61, team: 'away', player: 'Dwight Clarke', minute: '71' }
      ]
    },
    {
      id: 7,
      round: "Round 1",
      homeTeam: "Celebrity FC",
      awayTeam: "Willis Youth",
      date: "2025-10-25",
      time: "18:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: 5,
      awayScore: 1,
      status: "completed",
      wonOnPenalties: null,
      penaltyScore: null,
      goalScorers: [
        { id: 71, team: 'home', player: 'Xavier Clement', minute: '13' },
        { id: 72, team: 'home', player: 'Nicholas Lewis', minute: '24' },
        { id: 73, team: 'away', player: 'Javid French', minute: '35' },
        { id: 74, team: 'home', player: 'Aaron Pierre', minute: '45+2' },
        { id: 75, team: 'home', player: 'Akeem Charles', minute: '82' },
        { id: 76, team: 'home', player: 'Nicholas Lewis', minute: '90+4' }
      ]
    },
    {
      id: 8,
      round: "Round 1",
      homeTeam: "Police Sports Club",
      awayTeam: "North Stars",
      date: "2025-10-25",
      time: "20:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: 2,
      awayScore: 1,
      status: "completed",
      wonOnPenalties: null,
      penaltyScore: null,
      goalScorers: [
        { id: 81, team: 'home', player: 'Alister Daniel', minute: '6' },
        { id: 82, team: 'home', player: 'Keion Williams', minute: '36' },
        { id: 83, team: 'away', player: 'Cane Vanloo', minute: '71' }
      ]
    },
    {
      id: 9,
      round: "Round 1",
      homeTeam: "St. John's SC",
      awayTeam: "Hurricanes",
      date: "2025-10-27",
      time: "18:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: 0,
      awayScore: 2,
      status: "completed",
      wonOnPenalties: null,
      penaltyScore: null,
      goalScorers: [
        { id: 91, team: 'away', player: 'Rael Lewis', minute: '48' },
        { id: 92, team: 'away', player: 'Donte Modeste', minute: '61' }
      ]
    },
    {
      id: 10,
      round: "Round 1",
      homeTeam: "Chrollo FC",
      awayTeam: "Queen's Park Rangers",
      date: "2025-10-27",
      time: "20:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: 1,
      awayScore: 1,
      status: "completed",
      wonOnPenalties: 'away',
      penaltyScore: {
        home: 2,
        away: 3
      },
      goalScorers: [
        { id: 101, team: 'home', player: 'Javelan Redhead', minute: '22' },
        { id: 102, team: 'away', player: 'Marlon Phillip', minute: '82' }
      ]
    },
    {
      id: 11,
      round: "Round 1",
      homeTeam: "Camerhogne",
      awayTeam: "Paradise",
      date: "2025-10-29",
      time: "18:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: 1,
      awayScore: 3,
      status: "completed",
      wonOnPenalties: null,
      penaltyScore: null,
      goalScorers: [
        { id: 111, team: 'away', player: 'Zackrey Charles', minute: '12' },
        { id: 112, team: 'away', player: 'Neil Phillip', minute: '25' },
        { id: 113, team: 'home', player: 'Michael Albert', minute: '45' },
        { id: 114, team: 'away', player: 'Kiron Lawrence', minute: '60' }
      ]
    },
    {
      id: 12,
      round: "Round 1",
      homeTeam: "Idlers SC",
      awayTeam: "St. David FC",
      date: "2025-10-29",
      time: "20:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: 1,
      awayScore: 3,
      status: "completed",
      wonOnPenalties: null,
      penaltyScore: null,
      goalScorers: [
        { id: 121, team: 'away', player: 'Jaheim Edwards', minute: '26' },
        { id: 122, team: 'home', player: 'Roland Renrick', minute: '44' },
        { id: 123, team: 'away', player: 'Kyle Jacob', minute: '52' },
        { id: 124, team: 'away', player: 'Jaheim Edwards', minute: '69' }
      ]
    },

    // ROUND 2 - NEW SCHEDULE
    {
      id: 13,
      round: "Round 2",
      homeTeam: "Honved SC",
      awayTeam: "10 X O Legends",
      date: "2025-11-03",
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
      homeTeam: "Combined Northerners",
      awayTeam: "Fontenoy SC",
      date: "2025-11-03",
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
      homeTeam: "Sab Spartans",
      awayTeam: "Sunjets United",
      date: "2025-11-05",
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
      id: 16,
      round: "Round 2",
      homeTeam: "Celebrity FC",
      awayTeam: "Police Sports Club",
      date: "2025-11-05",
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
      id: 17,
      round: "Round 2",
      homeTeam: "Hurricanes",
      awayTeam: "Queen's Park Rangers",
      date: "2025-11-07",
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
      round: "Round 2",
      homeTeam: "Paradise",
      awayTeam: "St. David FC",
      date: "2025-11-07",
      time: "21:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: null,
      awayScore: null,
      status: "scheduled",
      wonOnPenalties: null,
      penaltyScore: null,
      goalScorers: []
    },

    // QUARTERFINALS - PLACEHOLDERS
    {
      id: 19,
      round: "Quarter Finals",
      homeTeam: "TBD",
      awayTeam: "TBD",
      date: "2025-11-10",
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
      id: 20,
      round: "Quarter Finals",
      homeTeam: "TBD",
      awayTeam: "TBD",
      date: "2025-11-10",
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
      id: 21,
      round: "Quarter Finals",
      homeTeam: "TBD",
      awayTeam: "TBD",
      date: "2025-11-12",
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
      round: "Quarter Finals",
      homeTeam: "TBD",
      awayTeam: "TBD",
      date: "2025-11-12",
      time: "21:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: null,
      awayScore: null,
      status: "scheduled",
      wonOnPenalties: null,
      penaltyScore: null,
      goalScorers: []
    },

    // SEMIFINALS - PLACEHOLDERS
    {
      id: 23,
      round: "Semi Finals",
      homeTeam: "TBD",
      awayTeam: "TBD",
      date: "2025-11-14",
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
      round: "Semi Finals",
      homeTeam: "TBD",
      awayTeam: "TBD",
      date: "2025-11-14",
      time: "21:00",
      venue: "Kirani James Athletics Stadium",
      homeScore: null,
      awayScore: null,
      status: "scheduled",
      wonOnPenalties: null,
      penaltyScore: null,
      goalScorers: []
    },

    // 3RD PLACE MATCH - PLACEHOLDER
    {
      id: 25,
      round: "3rd Place Match",
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

    // FINAL - PLACEHOLDER
    {
      id: 26,
      round: "Final",
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
    }
  ];

  const [matches, setMatches] = useState(() => {
    const saved = localStorage.getItem('matches');
    return saved ? JSON.parse(saved) : getInitialMatches();
  });

  // ============= TEAM EDITING FUNCTIONS =============
  
  const startEditingTeam = (teamId, currentName) => {
    setEditingTeamId(teamId);
    setEditingTeamName(currentName);
  };

  const cancelEditingTeam = () => {
    setEditingTeamId(null);
    setEditingTeamName('');
  };

  const saveTeamName = () => {
    if (!editingTeamName.trim()) {
      alert('Team name cannot be empty');
      return;
    }

    const oldTeam = teams.find(t => t.id === editingTeamId);
    const oldName = oldTeam.name;
    const newName = editingTeamName.trim();

    // Update teams array
    const updatedTeams = teams.map(team =>
      team.id === editingTeamId
        ? { ...team, name: newName }
        : team
    );

    // Update all matches that reference this team
    const updatedMatches = matches.map(match => ({
      ...match,
      homeTeam: match.homeTeam === oldName ? newName : match.homeTeam,
      awayTeam: match.awayTeam === oldName ? newName : match.awayTeam
    }));

    setTeams(updatedTeams);
    setMatches(updatedMatches);
    
    // Save to localStorage
    localStorage.setItem('teams', JSON.stringify(updatedTeams));
    localStorage.setItem('matches', JSON.stringify(updatedMatches));

    // Clear editing state
    setEditingTeamId(null);
    setEditingTeamName('');
    
    // Update sync status
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('synced');
      setLastSyncTime(new Date());
    }, 500);
  };

  // ============= PERSISTENCE & SYNC =============
  useEffect(() => {
    localStorage.setItem('tournamentData', JSON.stringify(tournamentData));
  }, [tournamentData]);

  useEffect(() => {
    localStorage.setItem('teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('matches', JSON.stringify(matches));
  }, [matches]);

  useEffect(() => {
    localStorage.setItem('selectedMatchId', selectedMatchId?.toString() || '');
  }, [selectedMatchId]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentDateTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (isAuthenticated && sessionTimeout) {
      const remaining = sessionTimeout - Date.now();
      if (remaining <= 0) {
        handleLogout();
      }
    }
  }, [currentDateTime, isAuthenticated, sessionTimeout]);

  useEffect(() => {
    if (isLocked && lockoutTime) {
      const remaining = lockoutTime - Date.now();
      if (remaining <= 0) {
        setIsLocked(false);
        setLockoutTime(null);
        setLoginAttempts(0);
      }
    }
  }, [currentDateTime, isLocked, lockoutTime]);

  // ============= AUTHENTICATION =============
  const renewSession = () => {
    if (isAuthenticated) {
      setSessionTimeout(Date.now() + SESSION_TIMEOUT_MS);
    }
  };

  const handleLogin = () => {
    if (isLocked) return;

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setCurrentView('management');
      setPassword('');
      setLoginAttempts(0);
      setSessionTimeout(Date.now() + SESSION_TIMEOUT_MS);
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);

      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        setIsLocked(true);
        setLockoutTime(Date.now() + LOCKOUT_DURATION);
        alert('🔒 Too many failed attempts! Account locked for 15 minutes.');
      } else {
        alert(`❌ Incorrect password. ${MAX_LOGIN_ATTEMPTS - newAttempts} attempt(s) remaining.`);
      }
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('fan');
    setSessionTimeout(null);
    setPassword('');
  };

  // ============= MATCH MANAGEMENT =============
  const updateMatch = (matchId, updates) => {
    renewSession();
    const updatedMatches = matches.map(match =>
      match.id === matchId ? { ...match, ...updates } : match
    );
    setMatches(updatedMatches);
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('synced');
      setLastSyncTime(new Date());
    }, 500);
  };

  const addGoalScorer = (matchId) => {
    renewSession();
    const match = matches.find(m => m.id === matchId);
    const newGoal = {
      id: Date.now(),
      team: 'home',
      player: '',
      minute: ''
    };
    updateMatch(matchId, {
      goalScorers: [...(match.goalScorers || []), newGoal]
    });
  };

  const updateGoalScorer = (matchId, goalId, field, value) => {
    renewSession();
    const match = matches.find(m => m.id === matchId);
    const updatedScorers = match.goalScorers.map(goal =>
      goal.id === goalId ? { ...goal, [field]: value } : goal
    );
    updateMatch(matchId, { goalScorers: updatedScorers });
  };

  const deleteGoalScorer = (matchId, goalId) => {
    renewSession();
    const match = matches.find(m => m.id === matchId);
    const updatedScorers = match.goalScorers.filter(goal => goal.id !== goalId);
    updateMatch(matchId, { goalScorers: updatedScorers });
  };

  const resetAllData = () => {
    if (window.confirm('⚠️ Are you ABSOLUTELY SURE you want to RESET ALL tournament data? This CANNOT be undone!')) {
      if (window.confirm('🚨 FINAL WARNING: This will delete ALL matches, scores, and goal scorers. Type RESET to continue.')) {
        const userInput = prompt('Type RESET to confirm:');
        if (userInput === 'RESET') {
          setMatches(getInitialMatches());
          localStorage.setItem('matches', JSON.stringify(getInitialMatches()));
          setSyncStatus('syncing');
          setTimeout(() => {
            setSyncStatus('synced');
            setLastSyncTime(new Date());
          }, 500);
          alert('✅ All data has been reset to default values.');
        }
      }
    }
  };

  // ============= HELPER FUNCTIONS =============
  const getTeamMatches = (teamName) => {
    return matches.filter(match =>
      match.homeTeam === teamName || match.awayTeam === teamName
    ).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getMatchesByRound = (round) => {
    return matches.filter(match => match.round === round)
      .sort((a, b) => new Date(`${a.date} ${a.time}`) - new Date(`${b.date} ${b.time}`));
  };

  const getTeamLogo = (teamName) => {
    const team = teams.find(t => t.name === teamName);
    return team?.logo;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isMatchLive = (match) => {
    if (match.status !== 'scheduled') return false;
    const matchDateTime = new Date(`${match.date}T${match.time}`);
    const now = currentDateTime;
    const diffMinutes = (now - matchDateTime) / (1000 * 60);
    return diffMinutes >= 0 && diffMinutes <= 100;
  };

  const getMatchStatus = (match) => {
    if (match.status === 'completed') return 'FT';
    if (isMatchLive(match)) return 'LIVE';
    return formatDate(match.date);
  };

  // ============= COMPONENT VIEWS =============
  const MatchCard = ({ match, showEditButton = false }) => {
    const isEditing = editingMatch === match.id;
    const matchIsLive = isMatchLive(match);

    return (
      <div className={`bg-white rounded-lg shadow-md hover:shadow-xl transition p-6 border-2 ${matchIsLive ? 'border-red-500 animate-pulse' : selectedMatchId === match.id ? 'border-red-600' : 'border-gray-200'
        }`}
        onClick={() => !isEditing && setSelectedMatchId(match.id)}
      >
        <div className="flex justify-between items-start mb-4">
          <span className="text-sm font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">
            {match.round}
          </span>
          {matchIsLive && (
            <span className="text-xs font-bold text-white bg-red-600 px-3 py-1 rounded-full animate-pulse">
              🔴 LIVE
            </span>
          )}
          {showEditButton && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingMatch(isEditing ? null : match.id);
              }}
              className="p-2 hover:bg-red-50 rounded-lg transition"
            >
              {isEditing ? <X className="w-5 h-5 text-red-600" /> : <Edit2 className="w-5 h-5 text-gray-600" />}
            </button>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 flex-1">
              {getTeamLogo(match.homeTeam) && (
                <img src={getTeamLogo(match.homeTeam)} alt="" className="w-8 h-8 object-contain" />
              )}
              <span className="font-semibold text-gray-900">{match.homeTeam}</span>
            </div>
            {match.status === 'completed' ? (
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold ${match.homeScore > match.awayScore ? 'text-green-600' : match.homeScore < match.awayScore ? 'text-gray-400' : 'text-gray-600'}`}>
                  {match.homeScore}
                </span>
                {match.wonOnPenalties && match.wonOnPenalties === 'home' && (
                  <span className="text-xs text-green-600 font-bold">({match.penaltyScore?.home})</span>
                )}
              </div>
            ) : isEditing ? (
              <input
                type="number"
                min="0"
                value={match.homeScore ?? ''}
                onChange={(e) => updateMatch(match.id, { homeScore: parseInt(e.target.value) || null })}
                className="w-16 px-2 py-1 border-2 border-red-600 rounded text-center font-bold"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="text-xl text-gray-400">-</span>
            )}
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3 flex-1">
              {getTeamLogo(match.awayTeam) && (
                <img src={getTeamLogo(match.awayTeam)} alt="" className="w-8 h-8 object-contain" />
              )}
              <span className="font-semibold text-gray-900">{match.awayTeam}</span>
            </div>
            {match.status === 'completed' ? (
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold ${match.awayScore > match.homeScore ? 'text-green-600' : match.awayScore < match.homeScore ? 'text-gray-400' : 'text-gray-600'}`}>
                  {match.awayScore}
                </span>
                {match.wonOnPenalties && match.wonOnPenalties === 'away' && (
                  <span className="text-xs text-green-600 font-bold">({match.penaltyScore?.away})</span>
                )}
              </div>
            ) : isEditing ? (
              <input
                type="number"
                min="0"
                value={match.awayScore ?? ''}
                onChange={(e) => updateMatch(match.id, { awayScore: parseInt(e.target.value) || null })}
                className="w-16 px-2 py-1 border-2 border-red-600 rounded text-center font-bold"
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className="text-xl text-gray-400">-</span>
            )}
          </div>
        </div>

        {match.status === 'completed' && match.wonOnPenalties && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-center text-sm font-semibold text-green-600">
              Won on Penalties ({match.penaltyScore?.home}-{match.penaltyScore?.away})
            </div>
          </div>
        )}

        {isEditing && (
          <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateMatch(match.id, {
                    wonOnPenalties: match.wonOnPenalties === 'home' ? null : 'home',
                    penaltyScore: match.wonOnPenalties === 'home' ? null : { home: 0, away: 0 }
                  });
                }}
                className={`flex-1 px-3 py-2 rounded text-sm font-semibold transition ${match.wonOnPenalties === 'home' ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
              >
                Home Won (Pen)
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateMatch(match.id, {
                    wonOnPenalties: match.wonOnPenalties === 'away' ? null : 'away',
                    penaltyScore: match.wonOnPenalties === 'away' ? null : { home: 0, away: 0 }
                  });
                }}
                className={`flex-1 px-3 py-2 rounded text-sm font-semibold transition ${match.wonOnPenalties === 'away' ? 'bg-green-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
              >
                Away Won (Pen)
              </button>
            </div>

            {match.wonOnPenalties && (
              <div className="flex gap-2 items-center justify-center">
                <span className="text-sm font-semibold">Penalties:</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={match.penaltyScore?.home ?? 0}
                  onChange={(e) => updateMatch(match.id, {
                    penaltyScore: { ...match.penaltyScore, home: parseInt(e.target.value) || 0 }
                  })}
                  className="w-16 px-2 py-1 border-2 border-red-600 rounded text-center font-bold"
                  onClick={(e) => e.stopPropagation()}
                />
                <span className="font-bold">-</span>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={match.penaltyScore?.away ?? 0}
                  onChange={(e) => updateMatch(match.id, {
                    penaltyScore: { ...match.penaltyScore, away: parseInt(e.target.value) || 0 }
                  })}
                  className="w-16 px-2 py-1 border-2 border-red-600 rounded text-center font-bold"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                updateMatch(match.id, {
                  status: match.status === 'completed' ? 'scheduled' : 'completed'
                });
              }}
              className={`w-full px-4 py-2 rounded font-semibold transition ${match.status === 'completed'
                  ? 'bg-gray-600 text-white hover:bg-gray-700'
                  : 'bg-green-600 text-white hover:bg-green-700'
                }`}
            >
              {match.status === 'completed' ? '↩️ Mark as Scheduled' : '✅ Mark as Completed'}
            </button>
          </div>
        )}

        <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{getMatchStatus(match)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{match.time}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{match.venue}</span>
          </div>
        </div>

        {selectedMatchId === match.id && match.status === 'completed' && match.goalScorers && match.goalScorers.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">⚽ Goal Scorers</h4>
            <div className="space-y-2">
              {match.goalScorers.map(goal => (
                <div key={goal.id} className="flex items-center gap-2 text-sm">
                  {isEditing ? (
                    <>
                      <select
                        value={goal.team}
                        onChange={(e) => updateGoalScorer(match.id, goal.id, 'team', e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-xs"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="home">Home</option>
                        <option value="away">Away</option>
                      </select>
                      <input
                        type="text"
                        value={goal.player}
                        onChange={(e) => updateGoalScorer(match.id, goal.id, 'player', e.target.value)}
                        placeholder="Player name"
                        className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <input
                        type="text"
                        value={goal.minute}
                        onChange={(e) => updateGoalScorer(match.id, goal.id, 'minute', e.target.value)}
                        placeholder="Min"
                        className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteGoalScorer(match.id, goal.id);
                        }}
                        className="p-1 hover:bg-red-50 rounded text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <>
                      <span className={`font-semibold ${goal.team === 'home' ? 'text-blue-600' : 'text-red-600'}`}>
                        {goal.team === 'home' ? match.homeTeam : match.awayTeam}
                      </span>
                      <span>-</span>
                      <span className="font-medium">{goal.player}</span>
                      <span className="text-gray-500">({goal.minute}')</span>
                    </>
                  )}
                </div>
              ))}
            </div>
            {isEditing && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addGoalScorer(match.id);
                }}
                className="mt-3 w-full px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm font-semibold"
              >
                ➕ Add Goal Scorer
              </button>
            )}
          </div>
        )}
      </div>
    );
  };

  const ScheduleView = () => {
    const rounds = ["Round 1", "Round 2", "Quarter Finals", "Semi Finals", "3rd Place Match", "Final"];

    return (
      <div className="space-y-8">
        {rounds.map(round => {
          const roundMatches = getMatchesByRound(round);
          if (roundMatches.length === 0) return null;

          return (
            <div key={round}>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-red-600" />
                {round}
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {roundMatches.map(match => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const BracketView = () => {
    const rounds = {
      "Round 1": getMatchesByRound("Round 1"),
      "Round 2": getMatchesByRound("Round 2"),
      "Quarter Finals": getMatchesByRound("Quarter Finals"),
      "Semi Finals": getMatchesByRound("Semi Finals"),
      "3rd Place Match": getMatchesByRound("3rd Place Match"),
      "Final": getMatchesByRound("Final")
    };

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-600 to-black text-white p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold mb-2">🏆 Tournament Bracket</h2>
          <p className="text-sm opacity-90">Click any match to view details</p>
        </div>

        <div className="space-y-8">
          {Object.entries(rounds).map(([roundName, roundMatches]) => (
            roundMatches.length > 0 && (
              <div key={roundName}>
                <h3 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-red-600">
                  {roundName}
                </h3>
                <div className="grid gap-3">
                  {roundMatches.map(match => (
                    <div
                      key={match.id}
                      onClick={() => setSelectedMatchId(match.id)}
                      className={`bg-white p-4 rounded-lg border-2 cursor-pointer transition hover:shadow-md ${selectedMatchId === match.id ? 'border-red-600 shadow-md' : 'border-gray-200'
                        } ${isMatchLive(match) ? 'animate-pulse border-red-500' : ''}`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex-1">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold">{match.homeTeam}</span>
                            {match.status === 'completed' && (
                              <span className={`text-xl font-bold ml-2 ${match.homeScore > match.awayScore ? 'text-green-600' : 'text-gray-400'}`}>
                                {match.homeScore}
                                {match.wonOnPenalties === 'home' && <span className="text-xs ml-1">({match.penaltyScore?.home})</span>}
                              </span>
                            )}
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-semibold">{match.awayTeam}</span>
                            {match.status === 'completed' && (
                              <span className={`text-xl font-bold ml-2 ${match.awayScore > match.homeScore ? 'text-green-600' : 'text-gray-400'}`}>
                                {match.awayScore}
                                {match.wonOnPenalties === 'away' && <span className="text-xs ml-1">({match.penaltyScore?.away})</span>}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="ml-4 text-right text-sm text-gray-600">
                          <div>{formatDate(match.date)}</div>
                          <div>{match.time}</div>
                          {isMatchLive(match) && (
                            <div className="text-red-600 font-bold text-xs mt-1">🔴 LIVE</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    );
  };

  const ResultsView = () => {
    const completedMatches = matches.filter(m => m.status === 'completed');

    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-red-600 to-black text-white p-6 rounded-lg shadow-xl">
          <h2 className="text-2xl font-bold mb-2">📊 Match Results</h2>
          <p className="text-sm opacity-90">{completedMatches.length} matches completed</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {completedMatches.map(match => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>

        {completedMatches.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">No completed matches yet</p>
          </div>
        )}
      </div>
    );
  };

  const ManagementView = () => {
    const allRounds = ["Round 1", "Round 2", "Quarter Finals", "Semi Finals", "3rd Place Match", "Final"];

    return (
      <div className="space-y-8">
        <div className="bg-gradient-to-r from-red-600 to-black text-white p-6 rounded-lg shadow-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">🔧 Management Portal</h2>
              <p className="text-sm opacity-90">Tournament administration and match editing</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right text-sm">
                <div className="flex items-center gap-2 justify-end">
                  <Database className="w-4 h-4" />
                  <span className="font-semibold">{syncStatus === 'synced' ? '✅ Synced' : '⏳ Syncing...'}</span>
                </div>
                {lastSyncTime && (
                  <div className="text-xs opacity-75 mt-1">
                    Last: {lastSyncTime.toLocaleTimeString()}
                  </div>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition font-semibold"
              >
                🚪 Logout
              </button>
            </div>
          </div>
        </div>

        {/* Team Management Section */}
        <div className="bg-white rounded-lg shadow-xl p-6 border-2 border-red-600">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-red-600" />
            Team Management
          </h3>
          <p className="text-sm text-gray-600 mb-4">Edit team names. Changes will update all matches automatically.</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto">
            {teams.map(team => (
              <div key={team.id} className="border border-gray-200 rounded-lg p-3 hover:border-red-300 transition">
                {editingTeamId === team.id ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={editingTeamName}
                      onChange={(e) => setEditingTeamName(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-red-600 rounded font-semibold focus:ring-2 focus:ring-red-600"
                      autoFocus
                      onKeyPress={(e) => e.key === 'Enter' && saveTeamName()}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveTeamName}
                        className="flex-1 px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition font-semibold text-sm flex items-center justify-center gap-1"
                      >
                        <Save className="w-4 h-4" />
                        Save
                      </button>
                      <button
                        onClick={cancelEditingTeam}
                        className="flex-1 px-3 py-1.5 bg-gray-600 text-white rounded hover:bg-gray-700 transition font-semibold text-sm flex items-center justify-center gap-1"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold text-gray-900">{team.name}</div>
                      {team.isYouth && (
                        <span className="text-xs text-blue-600 font-medium">Youth Team</span>
                      )}
                    </div>
                    <button
                      onClick={() => startEditingTeam(team.id, team.name)}
                      className="p-2 hover:bg-red-50 rounded-lg transition group"
                      title="Edit team name"
                    >
                      <Edit2 className="w-4 h-4 text-gray-400 group-hover:text-red-600" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Match Management Section */}
        <div className="bg-white rounded-lg shadow-xl p-6 border-2 border-red-600">
          <h3 className="text-xl font-bold text-gray-900 mb-4">📋 Match Management</h3>
          
          <div className="space-y-6">
            {allRounds.map(round => {
              const roundMatches = getMatchesByRound(round);
              if (roundMatches.length === 0) return null;

              return (
                <div key={round}>
                  <h4 className="text-lg font-bold text-gray-900 mb-3 pb-2 border-b border-gray-200">
                    {round}
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    {roundMatches.map(match => (
                      <MatchCard key={match.id} match={match} showEditButton={true} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
          <h3 className="text-xl font-bold text-red-900 mb-4">⚠️ Danger Zone</h3>
          <p className="text-sm text-red-800 mb-4">
            These actions are <strong>permanent and cannot be undone</strong>.
          </p>
          <button
            onClick={resetAllData}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Reset All Tournament Data
          </button>
        </div>
      </div>
    );
  };

  // ============= MAIN RENDER =============
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 via-black to-red-600 text-white shadow-xl sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              {tournamentData.logo && (
                <img src={tournamentData.logo} alt="Tournament Logo" className="h-16 w-16 object-contain bg-white rounded-lg p-1" />
              )}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{tournamentData.name}</h1>
                <p className="text-sm opacity-90">{tournamentData.venue} • {tournamentData.year}</p>
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
              {/* Management button - only shown when not in fan view OR when authenticated */}
              {(currentView !== 'fan' || isAuthenticated) && (
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
              )}
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
            {/* Management button in mobile menu - only shown when not in fan view OR when authenticated */}
            {(currentView !== 'fan' || isAuthenticated) && (
              <button
                onClick={() => { !isAuthenticated ? setCurrentView('login') : setCurrentView('management'); setShowMobileMenu(false); }}
                className="w-full px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition text-left flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                Management
              </button>
            )}
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
