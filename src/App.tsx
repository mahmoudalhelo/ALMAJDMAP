/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle, Polygon } from 'react-leaflet';
import L from 'leaflet';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Navigation, Trophy, Info, X, CheckCircle2, Award, LogOut, User as UserIconLucide, ListOrdered, Loader2, AlertTriangle, LogIn, Settings, School, Save, Edit2, HelpCircle, Map as MapIcon, Target, ExternalLink, Volume2, VolumeX, Trash2, ShieldCheck, FileText, Mail } from 'lucide-react';
import { Joyride, Step } from 'react-joyride';
import { PrivacyPolicy, TermsOfService } from './components/LegalModals';
import { HISTORICAL_LOCATIONS, CHALLENGES, Location as LocationType, SOUNDS, DEFAULT_PROFILE_PICTURE } from './constants';
import { calculateDistance, playSound } from './utils';
import { fetchWikiData, WikiData } from './services/wikiService';
import { 
  auth, db, googleProvider, signInWithPopup, signOut, onAuthStateChanged, 
  createUserWithEmailAndPassword, signInWithEmailAndPassword, deleteUser,
  doc, getDoc, setDoc, updateDoc, deleteDoc, collection, query, orderBy, limit, onSnapshot, 
  OperationType, handleFirestoreError, User, testFirebaseConnection
} from './firebase';

// Fix Leaflet marker icons
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const UserIcon = L.divIcon({
  className: 'custom-div-icon',
  html: `<div class="relative">
    <div class="absolute -inset-2 bg-blue-500/30 rounded-full animate-pulse"></div>
    <div style="background-color: #3b82f6; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 15px rgba(59, 130, 246, 0.5); position: relative; z-index: 10;"></div>
  </div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
});

const JORDAN_BORDER: [number, number][] = [
  [33.37, 36.55], [33.15, 37.50], [32.31, 39.30], [31.50, 39.20], [30.50, 38.50], 
  [29.18, 38.98], [29.18, 34.95], [29.50, 34.95], [30.00, 35.10], [30.65, 35.45], 
  [31.00, 35.45], [31.30, 35.45], [31.70, 35.50], [32.10, 35.55], [32.55, 35.55], 
  [33.00, 35.80], [33.37, 36.55]
];

function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

function MapControls() {
  const map = useMap();
  return (
    <div className="absolute bottom-32 left-6 z-[90] flex flex-col gap-2">
      <button 
        onClick={() => map.zoomIn()}
        className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-100 flex items-center justify-center font-bold text-xl hover:bg-gray-50 active:scale-95 transition-all"
      >
        +
      </button>
      <button 
        onClick={() => map.zoomOut()}
        className="w-10 h-10 bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-100 flex items-center justify-center font-bold text-xl hover:bg-gray-50 active:scale-95 transition-all"
      >
        -
      </button>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [nearbyLocation, setNearbyLocation] = useState<LocationType | null>(null);
  const [showChallenge, setShowChallenge] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showLocationInfo, setShowLocationInfo] = useState<LocationType | null>(null);
  const [wikiData, setWikiData] = useState<WikiData | null>(null);
  const [loadingWiki, setLoadingWiki] = useState(false);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Profile Edit State
  const [editName, setEditName] = useState('');
  const [editSchool, setEditSchool] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Auth State for Email/Password
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState<{visit: boolean, solve: boolean}>({visit: false, solve: false});
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [lastProximityPlayed, setLastProximityPlayed] = useState<string | null>(null);
  const [runTour, setRunTour] = useState(false);

  const tourSteps: Step[] = [
    {
      target: '.tour-welcome',
      content: 'مرحباً بك في خريطة المجد! رحلة استكشافية عبر تاريخ الأردن العريق.',
      placement: 'center',
    },
    {
      target: '.tour-profile',
      content: 'هنا يمكنك رؤية ملفك الشخصي ونقاط المجد التي جمعتها.',
      placement: 'bottom',
    },
    {
      target: '.tour-map',
      content: 'استكشف المواقع التاريخية على الخريطة. اقترب من المواقع لتفعيل التحديات.',
      placement: 'top',
    },
    {
      target: '.tour-legend',
      content: 'هذا الدليل يوضح أنواع المواقع المختلفة على الخريطة.',
      placement: 'left',
    },
    {
      target: '.tour-instructions',
      content: 'إذا احتجت للمساعدة، يمكنك دائماً مراجعة التعليمات من هنا.',
      placement: 'bottom',
    },
    {
      target: '.tour-leaderboard',
      content: 'شاهد ترتيبك بين أبطال المجد الآخرين.',
      placement: 'bottom',
    }
  ];

  useEffect(() => {
    testFirebaseConnection();
    const hasSeenTour = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenTour && user) {
      setRunTour(true);
    }
  }, [user]);

  const handleTourFinish = (data: any) => {
    const { status } = data;
    if (['finished', 'skipped'].includes(status)) {
      localStorage.setItem('hasSeenOnboarding', 'true');
      setRunTour(false);
    }
  };

  useEffect(() => {
    const handleInteraction = () => {
      setHasInteracted(true);
      // Preload sounds
      Object.values(SOUNDS).forEach(url => {
        const audio = new Audio();
        audio.src = url;
        audio.preload = 'auto';
      });
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
    window.addEventListener('click', handleInteraction);
    window.addEventListener('touchstart', handleInteraction);
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('touchstart', handleInteraction);
    };
  }, []);

  useEffect(() => {
    let ambientAudio: HTMLAudioElement | null = null;
    if (user && soundEnabled && hasInteracted) {
      ambientAudio = playSound(SOUNDS.AMBIENT, 0.09);
      ambientAudio.loop = true;
    }
    return () => {
      if (ambientAudio) {
        ambientAudio.pause();
        ambientAudio.src = "";
      }
    };
  }, [user, soundEnabled, hasInteracted]);

  useEffect(() => {
    let unsubProfile: (() => void) | null = null;

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      
      // Cleanup previous profile listener if it exists
      if (unsubProfile) {
        unsubProfile();
        unsubProfile = null;
      }

      if (currentUser) {
        const profileRef = doc(db, 'users', currentUser.uid);
        unsubProfile = onSnapshot(profileRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfile(data);
            setEditName(data.username || '');
            setEditSchool(data.school || '');
          } else {
            const newProfile = {
              uid: currentUser.uid,
              username: currentUser.displayName || 'بطل المجد',
              points: 0,
              school: '',
              achievements: [],
              visitedLocations: [],
              solvedChallenges: [],
              lastVisit: new Date().toISOString()
            };
            setDoc(profileRef, newProfile).catch(e => {
              console.error("Profile creation error:", e);
              handleFirestoreError(e, OperationType.WRITE, `users/${currentUser.uid}`);
            });
          }
          setLoading(false);
        }, (error) => {
          // Only handle error if we are still authenticated
          if (auth.currentUser) {
            console.error("Profile snapshot error:", error);
            handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
          }
          setLoading(false);
        });
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    // Safety timeout to prevent infinite loading
    const timer = setTimeout(() => setLoading(false), 5000);

    return () => {
      unsubscribe();
      if (unsubProfile) unsubProfile();
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    if (showLeaderboard) {
      const q = query(collection(db, 'leaderboard'), orderBy('points', 'desc'), limit(20));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map(doc => doc.data());
        setLeaderboard(data);
      }, (error) => handleFirestoreError(error, OperationType.GET, 'leaderboard'));
      return () => unsubscribe();
    }
  }, [showLeaderboard]);

  useEffect(() => {
    if ("geolocation" in navigator) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          
          let foundNearby = null;
          for (const loc of HISTORICAL_LOCATIONS) {
            const dist = calculateDistance(latitude, longitude, loc.lat, loc.lng);
            if (dist < 500) {
              foundNearby = loc;
              break;
            }
          }
          setNearbyLocation(foundNearby);
          
          if (foundNearby && foundNearby.id !== lastProximityPlayed) {
            if (soundEnabled && hasInteracted) {
              playSound(SOUNDS.PROXIMITY, 0.4);
            }
            setLastProximityPlayed(foundNearby.id);
          } else if (!foundNearby) {
            setLastProximityPlayed(null);
          }
        },
        (error) => console.error("Error getting location:", error),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, []);

  useEffect(() => {
    if (showLocationInfo) {
      setLoadingWiki(true);
      setWikiData(null);
      fetchWikiData(showLocationInfo.wikiUrl)
        .then(data => setWikiData(data))
        .catch(err => console.error("Wiki fetch error:", err))
        .finally(() => setLoadingWiki(false));
    }
  }, [showLocationInfo]);

  const nearestLocationInfo = useMemo(() => {
    if (!userLocation) return null;
    let nearest: any = null;
    let minDistance = Infinity;

    HISTORICAL_LOCATIONS.forEach(loc => {
      const dist = calculateDistance(userLocation[0], userLocation[1], loc.lat, loc.lng);
      if (dist < minDistance) {
        minDistance = dist;
        nearest = { ...loc, distance: dist };
      }
    });

    return nearest;
  }, [userLocation]);

  const handleLogin = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Login failed:", error);
      setAuthError(error.message || "فشل تسجيل الدخول باستخدام Google");
    }
  };

  const handleEmailAuth = async (e: FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (isSignUpMode && password.length < 6) {
      setAuthError("يجب أن تتكون كلمة المرور من 6 أحرف على الأقل");
      return;
    }

    setIsAuthenticating(true);

    try {
      if (isSignUpMode) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error: any) {
      console.error("Auth error:", error);
      let message = "حدث خطأ أثناء تسجيل الدخول";
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        message = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
      } else if (error.code === 'auth/email-already-in-use') {
        message = "هذا البريد الإلكتروني مستخدم بالفعل";
      } else if (error.code === 'auth/weak-password') {
        message = "كلمة المرور ضعيفة جداً";
      } else if (error.code === 'auth/invalid-email') {
        message = "البريد الإلكتروني غير صالح";
      } else if (error.code === 'auth/operation-not-allowed') {
        message = "يجب تفعيل خيار البريد الإلكتروني في Firebase Console";
      }
      setAuthError(message);
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => signOut(auth);

  const handleSaveProfile = async () => {
    if (!user || !profile) return;
    setIsSavingProfile(true);
    try {
      await updateDoc(doc(db, 'users', user.uid), {
        username: editName,
        school: editSchool
      });
      
      // Update leaderboard entry too
      await setDoc(doc(db, 'leaderboard', user.uid), {
        username: editName,
        points: profile.points,
        school: editSchool
      });
      
      setShowProfile(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    
    setIsDeletingAccount(true);
    try {
      // 1. Delete user profile from Firestore
      await deleteDoc(doc(db, 'users', user.uid));
      
      // 2. Delete from leaderboard
      await deleteDoc(doc(db, 'leaderboard', user.uid));
      
      // 3. Delete user from Firebase Auth
      await deleteUser(user);
      
      if (soundEnabled) playSound(SOUNDS.SUCCESS);
      setShowDeleteConfirm(false);
      setShowProfile(false);
    } catch (error) {
      console.error("Error deleting account:", error);
      // Re-authentication might be required for sensitive operations
      alert("حدث خطأ أثناء حذف الحساب. لأسباب أمنية، قد تحتاج لتسجيل الخروج والدخول مرة أخرى ثم المحاولة مجدداً.");
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (selectedOption === null || !nearbyLocation || !profile || !user) return;
    
    const challenge = CHALLENGES[nearbyLocation.id];
    const correct = selectedOption === challenge.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    if (soundEnabled) {
      playSound(correct ? SOUNDS.SUCCESS : SOUNDS.FAILURE, 0.4);
    }

    const visited = profile.visitedLocations || [];
    const solved = profile.solvedChallenges || [];
    
    let pointsToAdd = 0;
    let newVisited = [...visited];
    let newSolved = [...solved];
    let updated = false;

    let awarded = { visit: false, solve: false };

    // Award visit points only once
    if (!visited.includes(nearbyLocation.id)) {
      pointsToAdd += 10;
      newVisited.push(nearbyLocation.id);
      updated = true;
      awarded.visit = true;
    }

    // Award correct answer points only once
    if (correct && !solved.includes(nearbyLocation.id)) {
      pointsToAdd += 5;
      newSolved.push(nearbyLocation.id);
      updated = true;
      awarded.solve = true;
    }

    setPointsAwarded(awarded);

    if (updated) {
      const newPoints = (profile.points || 0) + pointsToAdd;
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          points: newPoints,
          visitedLocations: newVisited,
          solvedChallenges: newSolved,
          lastVisit: new Date().toISOString()
        });

        await setDoc(doc(db, 'leaderboard', user.uid), {
          username: profile.username,
          points: newPoints,
          school: profile.school || ''
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-jordan-black p-6 text-center">
        <Loader2 className="w-16 h-16 text-jordan-red animate-spin mb-6" />
        <h2 className="text-white text-xl font-bold mb-2">جاري تحميل خارطة المجد...</h2>
        <p className="text-gray-400 text-sm mb-8">يرجى الانتظار قليلاً بينما نجهز لك الخريطة</p>
        
        {/* Manual bypass if it takes too long */}
        <button 
          onClick={() => setLoading(false)}
          className="text-xs text-gray-500 hover:text-white underline transition-colors"
        >
          إذا استغرق التحميل وقتاً طويلاً، اضغط هنا
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-full flex items-center justify-center p-6 font-sans relative overflow-hidden" dir="rtl">
        {/* Authentic Jordan Shemagh Image Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://i.pinimg.com/1200x/55/97/32/559732f7b5ba4bc0cbc4d9a15630d1e4.jpg" 
            className="w-full h-full object-cover"
            alt="Jordan Shemagh Pattern"
            referrerPolicy="no-referrer"
          />
          {/* Subtle overlay for better contrast */}
          <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]" />
          {/* Vignette for focus */}
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-white/5 to-white/30" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/95 backdrop-blur-xl w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative z-10 border border-white/50"
        >
          <div className="relative w-full h-52 overflow-hidden bg-jordan-black flex items-center justify-center p-4">
            <img 
              src="/icon.png" 
              className="h-full object-contain" 
              alt="خارطة المجد"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div className="p-8">
            <form onSubmit={handleEmailAuth} className="space-y-4 mb-6">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 mr-1">البريد الإلكتروني</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-jordan-red outline-none text-sm"
                  placeholder="example@mail.com"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 mr-1">كلمة المرور</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-jordan-red outline-none text-sm"
                  placeholder="••••••••"
                />
              </div>

              {authError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-xl text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button 
                type="submit"
                disabled={isAuthenticating}
                className="w-full bg-jordan-black text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-900 transition-all disabled:opacity-50"
              >
                {isAuthenticating ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUpMode ? <LogIn className="w-5 h-5" /> : <LogIn className="w-5 h-5" />)}
                <span>{isSignUpMode ? 'إنشاء حساب' : 'تسجيل الدخول'}</span>
              </button>
            </form>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-400">أو</span>
              </div>
            </div>

            <button 
              onClick={handleLogin}
              className="w-full bg-white border-2 border-gray-100 text-gray-700 font-bold py-3 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm active:scale-[0.98] text-sm mb-6"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
              <span>الدخول باستخدام Google</span>
            </button>

            <div className="text-center">
              <button 
                onClick={() => {
                  setIsSignUpMode(!isSignUpMode);
                  setAuthError(null);
                }}
                className="text-sm font-bold text-jordan-red hover:underline"
              >
                {isSignUpMode ? 'لديك حساب بالفعل؟ سجل دخولك' : 'ليس لديك حساب؟ أنشئ حساباً جديداً'}
              </button>
            </div>

            <p className="text-center text-[10px] text-gray-400 mt-8 leading-relaxed">
              بالدخول للتطبيق، أنت توافق على شروط الاستخدام وسياسة الخصوصية الخاصة بمسابقة "خارطة المجد".
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full bg-gray-100 overflow-hidden font-sans tour-welcome" dir="rtl">
      <Joyride
        steps={tourSteps}
        run={runTour}
        continuous={true}
        onEvent={handleTourFinish}
        locale={{
          back: 'السابق',
          close: 'إغلاق',
          last: 'إنهاء',
          next: 'التالي',
          skip: 'تخطي',
        }}
        options={{
          primaryColor: '#CE1126',
          zIndex: 1000,
          showProgress: true,
        }}
      />
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] bg-jordan-black/95 backdrop-blur-2xl text-white shadow-2xl border-b border-jordan-green/40">
        <div className="max-w-7xl mx-auto px-3 md:px-6 py-2 md:py-3 flex justify-between items-center gap-4">
          {/* User Profile Info */}
          <button 
            onClick={() => {
              if (soundEnabled) playSound(SOUNDS.CLICK);
              setShowProfile(true);
            }}
            className="flex items-center gap-2 md:gap-4 hover:bg-white/5 p-1.5 rounded-2xl transition-all shrink-0 group tour-profile"
          >
            <div className="relative">
              <img 
                src={user.photoURL || DEFAULT_PROFILE_PICTURE} 
                className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-jordan-red group-hover:border-white transition-colors shadow-lg"
                alt="Avatar"
              />
              <div className="absolute -bottom-1 -right-1 bg-jordan-green p-1 rounded-full border border-jordan-black shadow-sm">
                <Settings className="w-2.5 md:w-3 h-2.5 md:h-3 text-white" />
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-xs md:text-base font-bold truncate max-w-[80px] md:max-w-[120px]">{profile?.username || 'بطل المجد'}</h1>
              <div className="flex items-center gap-1 text-[9px] md:text-xs text-jordan-green font-medium">
                <Award className="w-2.5 md:w-4 h-2.5 md:h-4" />
                <span>{profile?.points || 0} نقطة</span>
              </div>
            </div>
          </button>
          
          {/* Navigation Icons with Labels */}
          <nav className="flex items-center gap-1 md:gap-4">
            <button 
              onClick={() => {
                if (soundEnabled) playSound(SOUNDS.CLICK);
                setShowHowToPlay(true);
              }}
              className="flex flex-col items-center gap-1 p-1.5 md:p-2 hover:bg-white/10 rounded-xl transition-all min-w-[50px] md:min-w-[70px] group tour-instructions"
            >
              <HelpCircle className="w-5 h-5 md:w-6 md:h-6 text-gray-300 group-hover:text-white transition-colors" />
              <span className="text-[9px] md:text-[11px] font-medium text-gray-400 group-hover:text-white">التعليمات</span>
            </button>

            <button 
              onClick={() => {
                if (soundEnabled) playSound(SOUNDS.CLICK);
                setShowLeaderboard(true);
              }}
              className="flex flex-col items-center gap-1 p-1.5 md:p-2 hover:bg-white/10 rounded-xl transition-all min-w-[50px] md:min-w-[70px] group tour-leaderboard"
            >
              <ListOrdered className="w-5 h-5 md:w-6 md:h-6 text-gray-300 group-hover:text-white transition-colors" />
              <span className="text-[9px] md:text-[11px] font-medium text-gray-400 group-hover:text-white">المتصدرين</span>
            </button>

            <button 
              onClick={() => {
                if (soundEnabled) playSound(SOUNDS.CLICK);
                setShowAbout(true);
              }}
              className="flex flex-col items-center gap-1 p-1.5 md:p-2 hover:bg-white/10 rounded-xl transition-all min-w-[50px] md:min-w-[70px] group"
            >
              <Info className="w-5 h-5 md:w-6 md:h-6 text-gray-300 group-hover:text-white transition-colors" />
              <span className="text-[9px] md:text-[11px] font-medium text-gray-400 group-hover:text-white">عن التطبيق</span>
            </button>

            <div className="w-px h-8 bg-white/10 mx-1 hidden md:block"></div>

            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="flex flex-col items-center gap-1 p-1.5 md:p-2 hover:bg-white/10 rounded-xl transition-all min-w-[50px] md:min-w-[60px] group"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5 md:w-6 md:h-6 text-gray-300 group-hover:text-white" /> : <VolumeX className="w-5 h-5 md:w-6 md:h-6 text-red-400" />}
              <span className="text-[9px] md:text-[11px] font-medium text-gray-400 group-hover:text-white">{soundEnabled ? 'كتم' : 'تشغيل'}</span>
            </button>

            <button 
              onClick={handleLogout}
              className="flex flex-col items-center gap-1 p-1.5 md:p-2 hover:bg-red-500/20 rounded-xl transition-all min-w-[50px] md:min-w-[60px] group"
            >
              <LogOut className="w-5 h-5 md:w-6 md:h-6 text-red-400 group-hover:text-red-300 transition-colors" />
              <span className="text-[9px] md:text-[11px] font-medium text-red-400 group-hover:text-red-300">خروج</span>
            </button>
          </nav>
        </div>
      </header>

      {/* Map */}
      <div className="h-full w-full map-game-style relative tour-map">
        {/* Map Legend */}
        <div className="absolute top-24 right-4 z-[90] bg-white/90 backdrop-blur-md p-2 md:p-3 rounded-2xl shadow-xl border border-gray-100 tour-legend">
          <h4 className="text-[9px] md:text-[11px] font-bold text-gray-500 mb-1 md:mb-2 text-center">دليل الخريطة</h4>
          <div className="space-y-1.5 md:space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#007A3D]"></div>
              <span className="text-[8px] md:text-[10px] font-bold">مدن أثرية</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#6B7280]"></div>
              <span className="text-[8px] md:text-[10px] font-bold">قلاع تاريخية</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#F59E0B]"></div>
              <span className="text-[8px] md:text-[10px] font-bold">معالم تذكارية</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#CE1126]"></div>
              <span className="text-[8px] md:text-[10px] font-bold">مواقع معارك</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-[#8B5CF6]"></div>
              <span className="text-[8px] md:text-[10px] font-bold">قصور تاريخية</span>
            </div>
          </div>
        </div>

        <MapContainer center={[31.9472, 35.5458]} zoom={8} className="h-full w-full" zoomControl={false}>
          <TileLayer 
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          
          {/* Mask to hide everything outside Jordan */}
          <Polygon 
            positions={[
              [[-90, -180], [-90, 180], [90, 180], [90, -180]], // World bounds
              JORDAN_BORDER // Jordan hole
            ]}
            pathOptions={{
              fillColor: '#f3f4f6',
              fillOpacity: 1.0,
              color: '#CE1126',
              weight: 2,
              dashArray: '5, 10'
            }}
            interactive={false}
          />
          
          <MapControls />
          
          {/* Decorative HUD Elements */}
          <div className="absolute bottom-32 right-6 z-[90] pointer-events-none opacity-50 hidden md:block">
            <div className="bg-white/80 p-2 rounded-full shadow-lg border border-gray-200">
              <Navigation className="w-8 h-8 text-jordan-red rotate-45" />
            </div>
          </div>
          {HISTORICAL_LOCATIONS.map((loc) => {
            const isNearby = nearbyLocation?.id === loc.id;
            
            // Calculate distance for the 1km visual cue
            const distance = userLocation ? calculateDistance(userLocation[0], userLocation[1], loc.lat, loc.lng) : Infinity;
            const isWithin1km = distance <= 1000;
            
            // Define colors based on location type
            const typeColors = {
              battle: '#CE1126', // Jordan Red
              monument: '#F59E0B', // Amber/Gold
              castle: '#6B7280', // Gray/Stone
              city: '#007A3D',    // Jordan Green
              palace: '#8B5CF6'   // Violet
            };
            
            const markerColor = isNearby ? '#CE1126' : (typeColors[loc.type] || '#007A3D');

            const markerIcon = L.divIcon({
              html: `<div class="relative ${isNearby ? 'marker-proximity' : ''}">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 21C16 17.5 19 14.4183 19 10.5C19 6.63401 15.866 3.5 12 3.5C8.13401 3.5 5 6.63401 5 10.5C5 14.4183 8 17.5 12 21Z" fill="${markerColor}" stroke="white" stroke-width="2"/>
                  <circle cx="12" cy="10.5" r="2.5" fill="white"/>
                </svg>
                ${isNearby ? '<div class="absolute -inset-2 bg-jordan-red/20 rounded-full animate-ping"></div>' : ''}
                ${!isNearby && isWithin1km ? '<div class="absolute -inset-4 border-2 border-jordan-green/20 rounded-full animate-pulse"></div>' : ''}
              </div>`,
              className: '',
              iconSize: [36, 36],
              iconAnchor: [18, 36],
              popupAnchor: [0, -36]
            });

            return (
              <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={markerIcon}>
                <Popup className="game-popup">
                  <div className="text-right p-2 min-w-[180px]">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full text-white font-bold ${
                        loc.type === 'city' ? 'bg-jordan-green' : 
                        loc.type === 'castle' ? 'bg-gray-500' : 
                        loc.type === 'monument' ? 'bg-amber-500' : 
                        loc.type === 'palace' ? 'bg-violet-500' : 'bg-jordan-red'
                      }`}>
                        {loc.type === 'city' ? 'مدينة' : 
                         loc.type === 'castle' ? 'قلعة' : 
                         loc.type === 'monument' ? 'معلم' : 
                         loc.type === 'palace' ? 'قصر' : 'معركة'}
                      </span>
                      <h3 className="font-bold text-jordan-black text-sm">{loc.name}</h3>
                    </div>
                    <p className="text-xs text-gray-600 mb-4 leading-relaxed">{loc.description}</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          if (soundEnabled) playSound(SOUNDS.CLICK);
                          setShowLocationInfo(loc);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-jordan-red text-white py-2.5 rounded-xl text-[10px] font-bold hover:bg-red-700 transition-all shadow-md active:scale-95"
                      >
                        <Info className="w-3 h-3 text-white" />
                        معلومات
                      </button>
                      <a 
                        href={`https://www.google.com/maps/dir/?api=1&destination=${loc.lat},${loc.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-jordan-green text-white py-2.5 rounded-xl text-[10px] font-bold hover:bg-green-700 transition-all shadow-md active:scale-95"
                      >
                        <ExternalLink className="w-3 h-3 text-white" />
                        الذهاب
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
          {userLocation && (
            <>
              <Marker position={userLocation} icon={UserIcon} />
              <Circle center={userLocation} radius={500} pathOptions={{ color: '#3b82f6', fillOpacity: 0.1 }} />
              <MapRecenter center={userLocation} />
            </>
          )}
        </MapContainer>
      </div>

      {/* Action Buttons */}
      <div className="absolute bottom-24 left-0 right-0 z-10 flex flex-col items-center gap-3 px-6">
        <AnimatePresence>
          {nearbyLocation && (
            <div className="w-full max-w-md flex flex-col gap-2">
              <motion.button
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                onClick={() => {
                  if (soundEnabled) playSound(SOUNDS.CLICK);
                  setShowChallenge(true);
                }}
                className="w-full bg-jordan-red text-white font-bold py-4 rounded-2xl shadow-2xl flex items-center justify-center gap-3 animate-bounce-subtle"
              >
                <Navigation className="w-6 h-6 text-white" />
                <span className="text-white">ابدأ تحدي {nearbyLocation.name}</span>
              </motion.button>
              
              <div className="flex gap-2">
                <motion.button
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  onClick={() => setShowLocationInfo(nearbyLocation)}
                  className="flex-1 bg-jordan-red text-white font-bold py-3 rounded-2xl shadow-xl flex items-center justify-center gap-3"
                >
                  <Info className="w-5 h-5 text-white" />
                  <span className="text-white">معلومات</span>
                </motion.button>

                <motion.a
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 50, opacity: 0 }}
                  href={`https://www.google.com/maps/dir/?api=1&destination=${nearbyLocation.lat},${nearbyLocation.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 bg-jordan-green text-white font-bold py-3 rounded-2xl shadow-xl flex items-center justify-center gap-3"
                >
                  <MapIcon className="w-5 h-5 text-white" />
                  <span className="text-white">الذهاب</span>
                </motion.a>
              </div>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* About Modal */}
      <AnimatePresence>
        {showAbout && (
          <motion.div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-jordan-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative p-8 pt-12 text-center"
            >
              <button onClick={() => setShowAbout(false)} className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-20"><X /></button>
              
              <img 
                src="https://upload.wikimedia.org/wikipedia/ar/archive/d/d5/20170618225634%21%D8%B4%D8%B9%D8%A7%D8%B1_%D9%88%D8%B2%D8%A7%D8%B1%D8%A9_%D8%A7%D9%84%D8%AA%D8%B1%D8%A8%D9%8A%D8%A9_%D8%A7%D9%84%D8%A3%D8%B1%D8%AF%D9%86%D9%8A%D8%A9.jpg" 
                className="w-32 h-32 mx-auto mb-6 object-contain"
                alt="Ministry of Education Logo"
                referrerPolicy="no-referrer"
              />
              
              <h2 className="text-2xl font-bold mb-6 text-jordan-red">عن التطبيق</h2>
              
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  تم تصميم تطبيق <b>خارطة المجد</b> كجزء من المشاركة في مسابقة 
                  "توظيف استخدام التكنولوجيا في المناسبات الوطنية" 
                  والتي ينظمها قسم النشاطات التربوية في مديرية التربية والتعليم في لواء القويسمة.
                </p>
                
                <div className="pt-6 border-t border-gray-100">
                  <p className="font-bold text-jordan-black">اسم المعلمة المشاركة:</p>
                  <p className="text-lg">براءه سهيل خضر الحلو</p>
                </div>
                
                <div>
                  <p className="font-bold text-jordan-black">المدرسة:</p>
                  <p className="text-lg">المستندة الأساسية للبنين الأولى</p>
                </div>

                <div className="pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => setShowPrivacy(true)}
                    className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-jordan-green" />
                    سياسة الخصوصية
                  </button>
                  <button 
                    onClick={() => setShowTerms(true)}
                    className="flex items-center justify-center gap-2 p-3 bg-gray-50 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-jordan-red" />
                    شروط الخدمة
                  </button>
                </div>
                
                <div className="pt-4">
                  <a href="mailto:mhmoudalhelo@gmail.com" className="flex items-center justify-center gap-2 p-3 bg-jordan-black/5 rounded-xl text-xs font-bold text-gray-600 hover:bg-jordan-black/10 transition-colors">
                    <Mail className="w-4 h-4" />
                    الدعم الفني والاتصال بنا
                  </a>
                </div>
              </div>
              
              <button 
                onClick={() => setShowAbout(false)}
                className="w-full mt-8 bg-jordan-black text-white py-4 rounded-xl font-bold"
              >
                إغلاق
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* How to Play Modal */}
      <AnimatePresence>
        {showHowToPlay && (
          <motion.div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-jordan-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative p-8 pt-12"
            >
              <button onClick={() => setShowHowToPlay(false)} className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-20"><X /></button>
              
              <h2 className="text-2xl font-bold mb-8 text-center text-jordan-red flex items-center justify-center gap-2">
                <HelpCircle className="w-8 h-8" />
                طريقة اللعب
              </h2>
              
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="bg-jordan-green/10 p-3 rounded-2xl shrink-0">
                    <MapIcon className="w-6 h-6 text-jordan-green" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">استكشف الخريطة</h3>
                    <p className="text-gray-600 text-sm">تحرك في الواقع للوصول إلى المواقع التاريخية الأردنية المميزة على الخريطة.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-jordan-red/10 p-3 rounded-2xl shrink-0">
                    <Target className="w-6 h-6 text-jordan-red" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">اقترب من الموقع</h3>
                    <p className="text-gray-600 text-sm">عندما تصبح على بعد أقل من 500 متر من الموقع، سيظهر لك زر "ابدأ التحدي".</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-jordan-black/10 p-3 rounded-2xl shrink-0">
                    <Trophy className="w-6 h-6 text-jordan-black" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">اجمع النقاط</h3>
                    <p className="text-gray-600 text-sm">تحصل على 10 نقاط بمجرد الوصول للموقع، و 5 نقاط إضافية عند الإجابة الصحيحة على السؤال.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="bg-jordan-green/10 p-3 rounded-2xl shrink-0">
                    <ListOrdered className="w-6 h-6 text-jordan-green" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-1">تصدر القائمة</h3>
                    <p className="text-gray-600 text-sm">نافس زملائك من مختلف المدارس لتكون في صدارة قائمة المجد.</p>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => setShowHowToPlay(false)}
                className="w-full mt-10 bg-jordan-red text-white py-4 rounded-xl font-bold hover:bg-red-700 transition-colors"
              >
                فهمت، لنبدأ!
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfile && (
          <motion.div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-jordan-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden relative pt-10"
            >
              <button onClick={() => setShowProfile(false)} className="absolute top-4 left-4 p-2 hover:bg-white/20 text-white rounded-full transition-colors z-20"><X /></button>
              
              <div className="bg-jordan-black p-8 text-center text-white">
                <div className="relative inline-block">
                  <img 
                    src={user.photoURL || DEFAULT_PROFILE_PICTURE} 
                    className="w-24 h-24 rounded-full border-4 border-jordan-red mx-auto mb-4"
                    alt="Avatar"
                  />
                  <div className="absolute bottom-4 right-0 bg-jordan-red p-1.5 rounded-full border-2 border-jordan-black">
                    <Edit2 className="w-3 h-3 text-white" />
                  </div>
                </div>
                <h2 className="text-xl font-bold">{profile?.username}</h2>
                <div className="flex items-center justify-center gap-2 mt-2 text-jordan-green">
                  <Award className="w-5 h-5" />
                  <span className="font-bold">{profile?.points || 0} نقطة مجد</span>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 flex items-center gap-2">
                    <UserIconLucide className="w-3 h-3" /> اسم المستخدم
                  </label>
                  <input 
                    type="text" 
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-jordan-red outline-none font-medium"
                    placeholder="أدخل اسمك"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 flex items-center gap-2">
                    <School className="w-3 h-3" /> اسم المدرسة
                  </label>
                  <input 
                    type="text" 
                    value={editSchool}
                    onChange={(e) => setEditSchool(e.target.value)}
                    className="w-full p-3 rounded-xl border border-gray-100 focus:ring-2 focus:ring-jordan-red outline-none font-medium"
                    placeholder="أدخل اسم مدرستك"
                  />
                </div>

                <button 
                  onClick={handleSaveProfile}
                  disabled={isSavingProfile}
                  className="w-full bg-jordan-red text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-700 transition-all disabled:opacity-50"
                >
                  {isSavingProfile ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                  <span>حفظ التعديلات</span>
                </button>

                <div className="pt-4 border-t border-gray-100">
                  <button 
                    onClick={() => setShowDeleteConfirm(true)}
                    className="w-full flex items-center justify-center gap-2 p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors text-sm font-bold"
                  >
                    <Trash2 className="w-4 h-4" />
                    حذف الحساب والبيانات
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-jordan-black/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8 text-center"
            >
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-xl font-bold mb-4">حذف الحساب نهائياً؟</h2>
              <p className="text-gray-600 mb-8 text-sm leading-relaxed">
                هل أنت متأكد من رغبتك في حذف حسابك؟ سيتم حذف جميع نقاطك وإنجازاتك نهائياً من قاعدة البيانات. لا يمكن التراجع عن هذه الخطوة.
              </p>
              
              <div className="space-y-3">
                <button 
                  onClick={handleDeleteAccount}
                  disabled={isDeletingAccount}
                  className="w-full bg-red-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-red-700 transition-all disabled:opacity-50"
                >
                  {isDeletingAccount ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                  <span>تأكيد الحذف النهائي</span>
                </button>
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeletingAccount}
                  className="w-full bg-gray-100 text-gray-600 font-bold py-4 rounded-xl hover:bg-gray-200 transition-all"
                >
                  تراجع
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <PrivacyPolicy isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <TermsOfService isOpen={showTerms} onClose={() => setShowTerms(false)} />

      {/* Leaderboard Modal */}
      <AnimatePresence>
        {showLeaderboard && (
          <motion.div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-jordan-black/60 backdrop-blur-sm">
            <motion.div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden relative p-8 pt-12 max-h-[80vh] overflow-y-auto">
              <button onClick={() => setShowLeaderboard(false)} className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-20"><X /></button>
              <h2 className="text-2xl font-bold mb-6 text-center flex items-center justify-center gap-2">
                <ListOrdered className="text-jordan-red" />
                قائمة المتصدرين
              </h2>
              <div className="space-y-2">
                <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-bold text-gray-400 uppercase">
                  <div className="col-span-1">#</div>
                  <div className="col-span-4 text-right">المتسابق</div>
                  <div className="col-span-4 text-right">المدرسة</div>
                  <div className="col-span-3 text-left">النقاط</div>
                </div>
                {leaderboard.map((user, i) => (
                  <div key={i} className="grid grid-cols-12 gap-4 items-center p-4 bg-gray-50 rounded-xl">
                    <div className="col-span-1">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${i < 3 ? 'bg-jordan-red text-white' : 'bg-gray-200 text-gray-600'}`}>
                        {i + 1}
                      </span>
                    </div>
                    <div className="col-span-4 font-medium truncate text-right">{user.username}</div>
                    <div className="col-span-4 text-xs text-gray-500 truncate text-right">{user.school || '---'}</div>
                    <div className="col-span-3 font-bold text-jordan-green text-left">{user.points}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location Info Modal */}
      <AnimatePresence>
        {showLocationInfo && (
          <motion.div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-jordan-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]"
            >
              <button 
                onClick={() => setShowLocationInfo(null)} 
                className="absolute top-4 left-4 p-2 bg-white/80 backdrop-blur-md hover:bg-white rounded-full transition-colors z-20 shadow-sm"
              >
                <X className="w-5 h-5 text-jordan-black" />
              </button>
              
              <div className="h-64 w-full relative shrink-0 bg-gray-100">
                {loadingWiki ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-jordan-red" />
                  </div>
                ) : wikiData?.images?.[0] ? (
                  <img 
                    src={wikiData.images[0]} 
                    className="w-full h-full object-cover"
                    alt={showLocationInfo.name}
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <img 
                    src={showLocationInfo.imageUrl} 
                    className="w-full h-full object-cover"
                    alt={showLocationInfo.name}
                    referrerPolicy="no-referrer"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <h2 className="absolute bottom-6 right-6 text-2xl font-bold text-white">{showLocationInfo.name}</h2>
              </div>
              
              <div className="p-8 overflow-y-auto">
                {loadingWiki ? (
                  <div className="space-y-4">
                    <div className="h-4 bg-gray-100 rounded w-3/4 animate-pulse" />
                    <div className="h-4 bg-gray-100 rounded w-full animate-pulse" />
                    <div className="h-4 bg-gray-100 rounded w-5/6 animate-pulse" />
                    <div className="h-4 bg-gray-100 rounded w-full animate-pulse" />
                  </div>
                ) : (
                  <>
                    <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed mb-8 text-right">
                      <p className="text-lg font-medium mb-4">{wikiData?.extract || showLocationInfo.description}</p>
                      
                      {wikiData?.images && wikiData.images.length > 1 && (
                        <div className="grid grid-cols-2 gap-2 my-6">
                          {wikiData.images.slice(1, 5).map((img, idx) => (
                            <img 
                              key={idx} 
                              src={img} 
                              className="rounded-xl h-32 w-full object-cover shadow-sm" 
                              alt={`${showLocationInfo.name} ${idx}`}
                              referrerPolicy="no-referrer"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
                
                <div className="space-y-4 sticky bottom-0 bg-white pt-4">
                  <a 
                    href={showLocationInfo.wikiUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-jordan-red text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-red-700 transition-all shadow-lg"
                  >
                    <ExternalLink className="w-5 h-5 text-white" />
                    <span className="text-white">اقرأ المزيد على ويكيبيديا</span>
                  </a>
                  
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${showLocationInfo.lat},${showLocationInfo.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-jordan-green text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-green-700 transition-all shadow-lg"
                  >
                    <MapIcon className="w-5 h-5 text-white" />
                    <span className="text-white">فتح في خرائط جوجل</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Challenge Modal */}
      <AnimatePresence>
        {showChallenge && nearbyLocation && (
          <motion.div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-jordan-black/60 backdrop-blur-sm">
            <motion.div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative p-8 pt-12">
              <button onClick={() => setShowChallenge(false)} className="absolute top-4 left-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-20"><X /></button>
              {!showResult ? (
                <>
                  <h2 className="text-2xl font-bold mb-6 text-center">تحدي {nearbyLocation.name}</h2>
                  <p className="text-lg mb-8 text-center">{CHALLENGES[nearbyLocation.id].text}</p>
                  <div className="space-y-3">
                    {CHALLENGES[nearbyLocation.id].options.map((opt, i) => (
                      <button 
                        key={i} 
                        onClick={() => setSelectedOption(i)}
                        className={`w-full p-4 rounded-xl border-2 text-right ${selectedOption === i ? 'border-jordan-green bg-jordan-green/5' : 'border-gray-100'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  <button 
                    onClick={handleSubmitAnswer}
                    className="w-full mt-8 bg-jordan-black text-white py-4 rounded-xl font-bold"
                  >
                    تأكيد الإجابة
                  </button>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${isCorrect ? 'bg-jordan-green/10' : 'bg-jordan-red/10'}`}>
                    {isCorrect ? <CheckCircle2 className="w-12 h-12 text-jordan-green" /> : <X className="w-12 h-12 text-jordan-red" />}
                  </div>
                  <h2 className={`text-2xl font-bold mb-2 ${isCorrect ? 'text-jordan-green' : 'text-jordan-red'}`}>
                    {isCorrect ? 'إجابة صحيحة!' : 'إجابة خاطئة'}
                  </h2>
                  <p className="text-gray-600 mb-8">
                    {pointsAwarded.visit || pointsAwarded.solve ? (
                      `حصلت على ${ (pointsAwarded.visit ? 10 : 0) + (pointsAwarded.solve ? 5 : 0) } نقطة جديدة!`
                    ) : (
                      'لقد حصلت بالفعل على نقاط هذا الموقع سابقاً'
                    )}
                  </p>
                  <button onClick={() => { setShowChallenge(false); setShowResult(false); }} className="w-full bg-jordan-black text-white py-4 rounded-xl">العودة للخريطة</button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nearest Location Bar */}
      {nearestLocationInfo && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-[100] bg-jordan-green/95 backdrop-blur-md border-t border-white/10 py-2 px-4 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.2)]"
        >
          <a 
            href={`https://www.google.com/maps/dir/?api=1&destination=${nearestLocationInfo.lat},${nearestLocationInfo.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 overflow-hidden hover:opacity-80 transition-opacity"
          >
            <div className="p-1.5 rounded-lg bg-white/20 text-white">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-white/70 font-medium">أقرب معلم إليك</span>
              <span className="text-xs font-bold text-white truncate max-w-[150px] md:max-w-none">
                {nearestLocationInfo.name}
              </span>
            </div>
          </a>
          
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
            <Navigation className="w-3 h-3 text-white rotate-45" />
            <span className="text-[11px] font-bold text-white whitespace-nowrap" dir="ltr">
              {nearestLocationInfo.distance < 1000 
                ? `${Math.round(nearestLocationInfo.distance)} م` 
                : `${(nearestLocationInfo.distance / 1000).toFixed(1)} كم`}
            </span>
          </div>
        </motion.div>
      )}
    </div>
  );
}
