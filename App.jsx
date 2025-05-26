import React, {useState, useEffect} from 'react';
import { Moon, Sun, Volume2, VolumeX } from "lucide-react";

function App(){
    const [activeNav, setActiveNav] = useState('home');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [aboutExpanded, setAboutExpanded] = useState(false);
    const [typingText, setTypingText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [musicPlaying, setMusicPlaying] = useState(false);
    const [audioError, setAudioError] = useState(false);

const [audio] = useState(() =>{
    const audioInstance = new Audio('/Assets/background-music.mp3');
    audioInstance.loop = true; // Loop the audio
    audioInstance.volume = 0.3; // Set initial volume

    audioInstance.addEventListener('error', () => {
        console.error('Audio playback error');
        setAudioError(true);
    });
    return audioInstance;

});

const originalText = "Welcome to Shade and Tell. Shade and Tell will help you find the makeup product perfect for your skin undertone. Tap to learn more";
const expandedMainText = "Your skin's undertone is the subtle hue beneath the surface that never changes, regardless of tanning or sun exposure. Understanding your undertone is key to finding makeup that enhances your natural beauty!";

// Typing animation function
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
  }, 50); // Adjust speed here (50ms per character)
};

const handleAboutClick = () => {
  if (!aboutExpanded) {
    setAboutExpanded(true);
    typeText(expandedMainText);
  } else {
    setAboutExpanded(false);
    typeText(originalText);
  }
};

// Audio toggle function
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
    typeText(originalText);
}, []);

// Add effect for dark mode
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
            {/*banner*/}
            <header className="banner">

                <div className="left cherry-blossom ">
                    <img src= "/Assets/branch.gif" alt="cherry blossom" className='blossom-gif' />
                </div>

                <h1 className ="main-title">Shade and Tell</h1>
                
                <div className="right cherry-blossom">
                    <img src= "/Assets/branch.gif" alt="cherry blossom" className='blossom-gif' />
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
                        className={`nav-button ${activeNav === 'skincare' ? 'active' : ''}`} 
                        onClick={() => setActiveNav('skincare')}
                    >
                        Skincare Journey
                        </button>
                        <button 
            className={`nav-button ${activeNav === 'find-store' ? 'active' : ''}`}
            onClick={() => setActiveNav('find-store')}
          >
            Find a Store Near You
          </button>
          <button 
            className={`nav-button ${activeNav === 'what-store' ? 'active' : ''}`}
            onClick={() => setActiveNav('what-store')}
          >
            What Store Sells the Product
            </button>
                </div>
            </nav>

            
            {/*mobile nav*/}

            <nav className="mobile-nav">
                {/* Mobile Icons on the left */}
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

                {/* Hamburger Button */}
                <button 
                    className={`hamburger-btn ${mobileMenuOpen ? 'open' : ''}`}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <div className="hamburger-line"></div>
                    <div className="hamburger-line"></div>
                    <div className="hamburger-line"></div>
                </button>

                {/* Mobile Menu Dropdown */}
                <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
                    <button 
                        className={`mobile-nav-button ${activeNav === 'skincare' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveNav('skincare');
                            setMobileMenuOpen(false);
                        }}
                    >
                        Skincare Journey
                    </button>
                    
                    <button 
                        className={`mobile-nav-button ${activeNav === 'find-store' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveNav('find-store');
                            setMobileMenuOpen(false);
                        }}
                    >
                        Find a Store Near You
                    </button>
                    
                    <button 
                        className={`mobile-nav-button ${activeNav === 'what-store' ? 'active' : ''}`}
                        onClick={() => {
                            setActiveNav('what-store');
                            setMobileMenuOpen(false);
                        }}
                    >
                        What Store Sells the Product
                    </button>
                </div>
            </nav>
            <section className="about-section">
    <div className="about-container">

        <div 
            className="about-content-no-border"
            onClick={handleAboutClick}
        >
            <p className="about-text">
                {typingText}
                {isTyping && <span className="typing-cursor">|</span>}
            </p>
        
        </div>
    </div>
</section>


            {/*main content*/}
            <main>
                <p>Active page: {activeNav}</p>
                <p>Hello World React is workinggg!</p>
            </main>
        </div>
    );

}

export default App;