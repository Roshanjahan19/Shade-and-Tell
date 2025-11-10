import React, {useState, useEffect, useRef} from 'react';
import { Moon, Sun, Volume2, VolumeX } from "lucide-react";
import ProductRecommendationSystem from './component/ProductRecommendationSystem';
import RoutineManager from "./component/RoutineManager";
import Wishlist from "./component/Wishlist";


function App(){
    const [activeNav, setActiveNav] = useState('home');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [textStage, setTextStage] = useState(0);
    const [typingText, setTypingText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [musicPlaying, setMusicPlaying] = useState(false);
    const [audioError, setAudioError] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);
const [authError, setAuthError] = useState("");
const [authMessage, setAuthMessage] = useState("");
const [authType, setAuthType] = useState(""); // "success" or "error"
    
    const [userId, setUserId] = useState(localStorage.getItem("user_id"));
const [userEmail, setUserEmail] = useState(localStorage.getItem("email"));
const [loginEmail, setLoginEmail] = useState("");
const [mode, setMode] = useState("login"); 


const handleLogin = async () => {
  setAuthError("");
  setAuthMessage("");
  setAuthType("");

  const emailRegex = /^[^\s@]+@gmail\.com$/i;
  const email = loginEmail.trim();

  if (!emailRegex.test(email)) {
    setAuthType("error");
    setAuthMessage("Please enter a valid Gmail address");
    return;
  }

  try {
    setAuthLoading(true);

    
    const checkRes = await fetch(
      `${import.meta.env.VITE_API_URL}/users/check?email=${email}`
    );
    const checkData = await checkRes.json();

    if (mode === "signup") {
      if (checkData.exists) {
        setAuthType("error");
        setAuthMessage("This email already has an account, Try logging in?");
        setMode("login");
        return;
      }

      
      const createRes = await fetch(
        "${import.meta.env.VITE_API_URL}/users/ensure",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email })
        }
      );

      const newUser = await createRes.json();

      setUserId(newUser.user_id);
      setUserEmail(newUser.email);

      localStorage.setItem("user_id", newUser.user_id);
      localStorage.setItem("email", newUser.email);

      setAuthType("success");
      setAuthMessage("Account created! Welcome to Shade & Tell!");

      setTimeout(() => {
        setActiveNav("routine-builder");
      }, 1200);

      return;
    }

    
    if (!checkData.exists) {
      setAuthType("error");
      setAuthMessage("No account found, Want to create one?");
      setMode("signup");
      return;
    }

    // Login user
    const loginRes = await fetch(
      "${import.meta.env.VITE_API_URL}/users/ensure",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      }
    );

    const existingUser = await loginRes.json();

    setUserId(existingUser.user_id);
    setUserEmail(existingUser.email);

    localStorage.setItem("user_id", existingUser.user_id);
    localStorage.setItem("email", existingUser.email);

    setAuthType("success");
    setAuthMessage(
      `Welcome back, ${existingUser.email.split("@")[0]}!`
    );

    setTimeout(() => {
      setActiveNav("routine-builder");
    }, 1200);
  } catch (err) {
    console.error(err);
    setAuthType("error");
    setAuthMessage("Something went wrong… please try again");
  } finally {
    setAuthLoading(false);
  }
};





const handleLogout = () => {
  localStorage.removeItem("user_id");
  localStorage.removeItem("email");

  setUserId(null);
  setUserEmail(null);
  setActiveNav("login");
};

useEffect(() => {
  if (activeNav === "routine-builder" && !userId) {
    setActiveNav("login");
  }
}, [activeNav, userId]);


    const [showRecommendations, setShowRecommendations] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    
    const [mainVisible, setMainVisible] = useState(false);
    const mainRef = useRef(null);

    const [audio] = useState(() =>{
        const audioInstance = new Audio('/Assets/background-music.mp3');
        audioInstance.loop = true;
        audioInstance.volume = 0.3;

        audioInstance.addEventListener('error', () => {
            console.error('Audio playback error');
            setAudioError(true);
        });
        return audioInstance;
    });

    
    const textStages = [
        "Welcome to Shade and Tell! \n\n This project was inspired by the popular Korean personal color analysis test that helps you find the colors that truly flatter your unique skin tone and undertones.\nShade and Tell is here to guide you to makeup products that complement your undertone, so you can feel confident, radiant, and totally YOU ♥︎",
        "Did you know your skin has a hidden tone beneath the surface? \n\n That's your undertone! It's a subtle hue that never changes no matter how much you tan or how your skin reacts to the sun. While your surface skin tone might shift with seasons or exposure, your undertone remains the same throughout your life. Understanding your undertone helps you enhance your natural beauty, avoid clashing colors, and feel more confident in your look every day!",
        null
    ];

    const undertoneData = [
        {
            type: "Cool Undertones",
            colorClasses: ["cool-block-1", "cool-block-2", "cool-block-3"],
            description: "Pink, red, or blue hues work best with silver jewelry"
        },
        {
            type: "Warm Undertones", 
            colorClasses: ["warm-block-1", "warm-block-2", "warm-block-3"],
            description: "Yellow, peachy, or golden hues complement gold jewelry"
        },
        {
            type: "Neutral Undertones",
            colorClasses: ["neutral-block-1", "neutral-block-2", "neutral-block-3"], 
            description: "Balanced mix that works with both silver and gold"
        },
        {
            type: "Olive Undertones",
            colorClasses: ["olive-block-1", "olive-block-2", "olive-block-3"],
            description: "Green-based hues that work with both warm and cool tones"
        }
    ];

   const makeupProducts = [
  {
    id: 'lipstick',
    category: 'lipstick',
    name: 'Lipstick',
    image: '/Assets/lipsticks.png',
    description: 'Find your perfect lip color'
  },
  {
    id: 'foundation',
    category: 'foundation',
    name: 'Foundation',
    image: '/Assets/foundation.png',
    description: 'Discover your ideal foundation shade'
  },
  {
    id: 'concealer',
    category: 'concealer',
    name: 'Concealer',
    image: '/Assets/concealer.png',
    description: 'Get the perfect concealer match'
  },
  {
    id: 'contour',
    category: 'contour',
    name: 'Contour Palette',
    image: '/Assets/contour-palette.png',
    description: 'Find your contouring shades'
  },
  {
    id: 'bronzer',
    category: 'bronzer',
    name: 'Bronzer',
    image: '/Assets/bronzer.png',
    description: 'Get your perfect bronzer tone'
  },
  {
    id: 'blush',
    category: 'blush',
    name: 'Blush',
    image: '/Assets/blush.png',
    description: 'Explore your ideal blush shades'
  }
];


    const typeText = (text) => {
        setIsTyping(true);
        setTypingText('');
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                setTypingText(text.slice(0, i + 1));
                i++;
            } else {
                clearInterval(timer);
                setIsTyping(false);
            }
        }, 50);
    };

    const handleAboutClick = () => {
        if (textStage === 0) {
            setTextStage(1);
            typeText(textStages[1]);
        } else if (textStage === 1) {
            setTextStage(2);
            setIsTyping(false);
        }
    };

    const handleGoBack = () => {
        setTextStage(0);
    };


    const handleProductClick = (productId) => {
        const product = makeupProducts.find(p => p.id === productId);
        setSelectedProduct(product);
        setShowRecommendations(true);
    };

    // undertone quiz click handler
    const handleUndertoneQuiz = () => {
        setSelectedProduct(null); 
        setShowRecommendations(true);
    };

    const handleBackToMain = () => {
        setShowRecommendations(false);
        setSelectedProduct(null);
    
        setMainVisible(true);
       
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const toggleMusic = async () => {
        if (audioError) {
            console.log('Audio is not available');
            return;
        }

        try {
            if (musicPlaying) {
                audio.pause();
                setMusicPlaying(false);
            } else {
                await audio.play();
                setMusicPlaying(true);
            }
        } catch (error) {
            console.error('Audio play failed:', error);
            setAudioError(true);
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setMainVisible(true);
                    } else {
                        
                        if (showRecommendations) {
                            setMainVisible(false);
                        }
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -100px 0px'
            }
        );

        if (mainRef.current && !showRecommendations) {
            observer.observe(mainRef.current);
        }

        return () => {
            if (mainRef.current) {
                observer.unobserve(mainRef.current);
            }
        };
    }, [showRecommendations]); 

    useEffect(() => {
        if (!showRecommendations) {
           
            setTimeout(() => {
                setMainVisible(true);
            }, 100);
        }
    }, [showRecommendations]);

    useEffect(() => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);

    useEffect(() => {
        return () => {
            audio.pause();
            audio.currentTime = 0;
        };
    }, [audio]);

    return (
        <div>
            
            <header className="banner">
                <div className="left cherry-blossom ">
                    <img src="/Assets/branch.gif" alt="cherry blossom" className='blossom-gif' />
                </div>

                <h1 className="main-title">Shade and Tell</h1>
                
                <div className="right cherry-blossom">
                    <img src="/Assets/branch.gif" alt="cherry blossom" className='blossom-gif' />
                </div>
            </header>

            {/*nav*/}
            <nav className="desktop-nav">
                <div className="nav-container">
                    <div className="nav-icons">
                        <button 
                            className={`icon-button ${darkMode ? 'active' : ''}`}
                            onClick={() => setDarkMode(!darkMode)}
                            title="Toggle Dark Mode"
                        >
                            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <button 
                            className={`icon-button ${musicPlaying ? 'active' : ''}`}
                            onClick={toggleMusic}
                            title="Toggle Music"
                        >
                            {musicPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
                        </button>
                    </div>
                <button
  className={`nav-button ${activeNav === 'home' ? 'active' : ''}`}
  onClick={() => {
    setShowRecommendations(false);
    setSelectedProduct(null);
    setActiveNav('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }}
>
  Home
</button>
                    <button 
                        className={`nav-button ${activeNav === 'login' ? 'active' : ''}`} 
                        onClick={() => setActiveNav('login')}
                    >
                        Login
                    </button>
                    <button 
                        className={`nav-button ${activeNav === 'wishlist' ? 'active' : ''}`}
                        onClick={() => setActiveNav('wishlist')}
                    >
                        Product Wishlist
                    </button>
                    <button 
                        className={`nav-button ${activeNav === 'routine-builder' ? 'active' : ''}`}
                        onClick={() => {
  if (!userId) setActiveNav("login");
  else setActiveNav("routine-builder");
}}
                    >
                        Makeup Routine Builder
                    </button>


                </div>
            </nav>

            {/*mobile nav*/}
            <nav className="mobile-nav">
                <div className="mobile-nav-icons">
                    <button 
                        className={`mobile-icon-button ${darkMode ? 'active' : ''}`}
                        onClick={() => setDarkMode(!darkMode)}
                        title="Toggle Dark Mode"
                    >
                        {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                    </button>
                    <button 
                        className={`mobile-icon-button ${musicPlaying ? 'active' : ''}`}
                        onClick={toggleMusic}
                        title="Toggle Music"
                    >
                        {musicPlaying ? <Volume2 size={16} /> : <VolumeX size={16} />}
                    </button>
                </div>

                <button 
                    className={`hamburger-btn ${mobileMenuOpen ? 'open' : ''}`}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <div className="hamburger-line"></div>
                    <div className="hamburger-line"></div>
                    <div className="hamburger-line"></div>
                </button>

                <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
                                        <button
  className={`mobile-nav-button ${activeNav === 'home' ? 'active' : ''}`}
  onClick={() => {
    setActiveNav('home');
    setShowRecommendations(false);
    setSelectedProduct(null);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }}
>
  Home
</button>
                    
                    <button 
                        className={`mobile-nav-button ${activeNav === 'login' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveNav('login');
                            setMobileMenuOpen(false);
                        }}
                    >
                        Login
                    </button>
                    
                    <button 
                        className={`mobile-nav-button ${activeNav === 'wishlist' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveNav('wishlist');
                            setMobileMenuOpen(false);
                        }}
                    >
                        Product Wishlist
                    </button>
                    
                    <button 
                        className={`mobile-nav-button ${activeNav === 'routine-builder' ? 'active' : ''}`}
                        onClick={() => {
    if (!userId) {
        setActiveNav("login");
    } else {
        setActiveNav("routine-builder");
    }
    setMobileMenuOpen(false);
}}

                    >
                        Makeup Routine Builder
                    </button>

                </div>
            </nav>
            
            

{activeNav === "login" ? (

  <div className="login-page">
    <div className="login-box">
      <h2 className="login-title">
        {mode === "login" ? "Login to Shade & Tell" : "Sign Up for Shade & Tell"}
      </h2>

      <input
        type="email"
        placeholder="Enter your Gmail"
        value={loginEmail}
        onChange={(e) => setLoginEmail(e.target.value)}
        className="login-input"
      />

      {authMessage && (
        <div className={`auth-message ${authType}`}>
          {authMessage}
        </div>
      )}

      <button onClick={handleLogin} className="login-btn">
        {mode === "login" ? "Login" : "Sign Up"}
      </button>

      <div className="toggle-auth">
        {mode === "login" ? (
          <p>
            New here?{" "}
            <span className="auth-switch" onClick={() => setMode("signup")}>
              Create an account
            </span>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <span className="auth-switch" onClick={() => setMode("login")}>
              Login
            </span>
          </p>
        )}
      </div>
    </div>
  </div>

) : activeNav === "wishlist" ? (

  <Wishlist userId={userId} setActiveNav={setActiveNav} />

) : activeNav === "routine-builder" ? (

  <RoutineManager
    userId={userId}
    email={userEmail}
    onLogout={handleLogout}
  />

) : showRecommendations ? (

  <ProductRecommendationSystem
    selectedProduct={selectedProduct}
    onBackToMain={handleBackToMain}
    userId={userId}
    setActiveNav={setActiveNav}
  />

) : (
                <div key="main-content"> 
                    {/* About section */}
                    <section className="about-section">
                        <div className="about-container">
                            <div 
                                className={`about-content-no-border ${textStage < 2 ? 'about-content-pointer' : 'about-content-default'}`}
                                onClick={handleAboutClick}
                            >
                                {textStage < 2 ? (
                                    <p className="about-text about-text-preformatted">
                                        {textStage === 0 ? textStages[0] : typingText}
                                        {isTyping && textStage > 0 && <span className="typing-cursor">|</span>}
                                    </p>
                                ) : (
                                    <div className="undertone-container">
                                        {undertoneData.map((undertone, index) => (
                                            <div key={index} className="undertone-block">
                                                <div className="color-blocks-container">
                                                    {undertone.colorClasses.map((colorClass, colorIndex) => (
                                                        <div key={colorIndex} className={`color-block ${colorClass}`}></div>
                                                    ))}
                                                </div>
                                                <div className="undertone-text">
                                                    <strong>{undertone.type}:</strong> {undertone.description}
                                                </div>
                                            </div>
                                        ))}
                                        <p className="undertone-description">
                                            Our color analysis helps you discover your perfect undertone match, so you can choose foundations, blushes, and lip colors that make you glow! 
                                        </p>
                                    </div>
                                )}
                                
                                
                                {textStage < 2 && (textStage === 0 || !isTyping) && (
                                    <div className="click-continue">
                                        Click to continue →
                                    </div>
                                )}
                                
                                
                                {textStage === 2 && !isTyping && (
                                    <div className="go-back-container">
                                        <button 
                                            className="go-back-button"
                                            onClick={handleGoBack}
                                        >
                                            ← Go Back to Start
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Garden decoration at the bottom */}
                        <div className="garden-decoration">
                            <img src="/Assets/koi-fishes.gif" alt="Pixelated koi pond garden" className="garden-gif" />
                        </div>
                    </section>

                    <main ref={mainRef} className={`${mainVisible ? 'main-animated' : 'main-initial'}`}>
                        <div className="section-header">Discover Your Perfect Shade</div>
                        <div className="section-text">
                            Ready to find makeup that enhances your natural beauty? Let's begin your personalized shade journey!
                        </div>
                        
                        <div className="section-text">
                            Get started by taking a short quiz to find out about your skin undertone!
                        </div>
                        
                        <div className="quiz-container">
                            <button className="quiz-link" onClick={handleUndertoneQuiz}>
                                Take Undertone Quiz
                            </button>
                        </div>

                        <div className="section-text section-text-top-margin">
                            Or explore specific products and get personalized recommendations:
                        </div>

                        <div className="product-gallery">
                            {makeupProducts.map((product) => (
                                <div 
                                    key={product.id}
                                    className="product-card"
                                    onClick={() => handleProductClick(product.id)}
                                >
                                    <div className="product-image">
                                        <img 
                                            src={product.image} 
                                            alt={product.name}
                                            className="product-img"
                                        />
                                    </div>
                                    <div className="product-name">{product.name}</div>
                                    <div className="product-description">{product.description}</div>
                                </div>
                            ))}
                        </div>
                    </main>
                </div>
            )}
        </div>
    );
}

export default App;