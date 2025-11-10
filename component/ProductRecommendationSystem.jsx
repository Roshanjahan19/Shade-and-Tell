import React, { useState, useEffect } from 'react';
import '../CSS/recommendation.css';

const ProductRecommendationSystem = ({ selectedProduct, onBackToMain, userId, 
  setActiveNav }) => {
  const [currentStep, setCurrentStep] = useState('productSelection');
  const [internalSelectedProduct, setInternalSelectedProduct] = useState(null);
  const [userUndertone, setUserUndertone] = useState('');
  const [userSkinShade, setUserSkinShade] = useState('');
  const [quizAnswers, setQuizAnswers] = useState({});
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const makeupProducts = [
    { id: 'lipstick', name: 'Lipstick', category: 'lipstick', image: 'public/Assets/lipsticks.png', description: 'Find your perfect lip color' },
    { id: 'foundation', name: 'Foundation', category: 'foundation', image: 'public/Assets/foundation.png', description: 'Discover your ideal foundation shade' },
    { id: 'concealer', name: 'Concealer', category: 'concealer', image: 'public/Assets/concealer.png', description: 'Get the perfect concealer match' },
    { id: 'contour', name: 'Contour Palette', category: 'contour', image: 'public/Assets/contour-palette.png', description: 'Find your contouring shades' },
    { id: 'bronzer', name: 'Bronzer', category: 'bronzer', image: 'public/Assets/bronzer.png', description: 'Get your perfect bronzer tone' },
    { id: 'blush', name: 'Blush', category: 'blush', image: 'public/Assets/blush.png', description: 'Explore your ideal blush shades' }
  ];

  const quizQuestions = [
    {
      id: 'veins',
      question: 'Look at the veins on your wrist in natural light. What color do they appear?',
      options: [
        { value: 'blue-purple', label: 'Blue or purple', undertone: 'cool' },
        { value: 'green', label: 'Green', undertone: 'warm' },
        { value: 'blue-green', label: 'Blue-green mix', undertone: 'neutral' }
      ]
    },
    {
      id: 'jewelry',
      question: 'Which jewelry looks better on you?',
      options: [
        { value: 'silver', label: 'Silver jewelry', undertone: 'cool' },
        { value: 'gold', label: 'Gold jewelry', undertone: 'warm' },
        { value: 'both', label: 'Both look good', undertone: 'neutral' }
      ]
    },
    {
      id: 'sun-reaction',
      question: 'How does your skin react to sun exposure?',
      options: [
        { value: 'burn-easily', label: 'Burns easily, tans minimally', undertone: 'cool' },
        { value: 'tan-easily', label: 'Tans easily, rarely burns', undertone: 'warm' },
        { value: 'moderate', label: 'Sometimes burns, sometimes tans', undertone: 'neutral' }
      ]
    }
  ];

  useEffect(() => {
    if (selectedProduct) {
      setInternalSelectedProduct(selectedProduct);
      setCurrentStep('undertoneInput');
    } else if (selectedProduct === null) {
      setCurrentStep('quiz');
      setCurrentQuizQuestion(0);
      setQuizAnswers({});
    } else {
      setCurrentStep('productSelection');
    }
  }, [selectedProduct]);

  const handleProductSelect = (product) => {
    setInternalSelectedProduct(product);

    if (userUndertone) {
      setCurrentStep('results');
      fetchRecommendations(userUndertone);
    } else {
      setCurrentStep('undertoneInput');
    }
  };

  const handleUndertoneSubmit = () => {
    if (userUndertone && userSkinShade) {
      fetchRecommendations();
    }
  };

  const startQuiz = () => {
    setCurrentStep('quiz');
    setQuizAnswers({});
    setCurrentQuizQuestion(0);
  };

  const handleQuizAnswer = (option) => {
    const updated = { ...quizAnswers, [quizQuestions[currentQuizQuestion].id]: option };
    setQuizAnswers(updated);

    if (currentQuizQuestion < quizQuestions.length - 1) {
      setCurrentQuizQuestion(currentQuizQuestion + 1);
    } else {
      const scores = { cool: 0, warm: 0, neutral: 0 };
      Object.values(updated).forEach(o => scores[o.undertone]++);
      const finalTone = Object.keys(scores).reduce((a, b) => (scores[a] > scores[b] ? a : b));
      setUserUndertone(finalTone);
      fetchRecommendations(finalTone);
      setCurrentStep('results');
    }
  };

  const fetchRecommendations = async (undertone = userUndertone) => {
    setLoading(true);
    setCurrentStep('results');

    try {
      const category = internalSelectedProduct?.category || '';
      const url = `${process.env.REACT_APP_API_URL}/recommendations?tone=${userSkinShade}&undertone=${undertone}&category=${category}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.products) {
        setRecommendations([]);
        setLoading(false);
        return;
      }

      const finalResults = data.products.map((p) => ({
        id: p.id,
        brand: p.brand,
        productName: p.name,
        shade: p.shade_note,
        priceTier: p.price_tier,
        image: p.image_url,
        description: `Perfect ${p.name.toLowerCase()} for your undertone`,
        productUrl: p.product_url
      }));

      setRecommendations(finalResults);
    } catch (err) {
      console.error(err);
      setRecommendations([]);
    }

    setLoading(false);
  };

  const resetFlow = () => {
    setCurrentStep('productSelection');
    setInternalSelectedProduct(null);
    setRecommendations([]);
    setUserSkinShade('');
    setUserUndertone('');
    setQuizAnswers({});
    setCurrentQuizQuestion(0);
  };

  const currentProduct = internalSelectedProduct || selectedProduct;
const addToWishlist = async (rec) => {
  if (!userId) {
    setActiveNav("login");
    return;
  }

  try {
    await fetch("${process.env.REACT_APP_API_URL}/wishlist/add", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    user_id: userId,
    product_id: rec.id
  })
});


    alert("Added to your wishlist!");
  } catch (err) {
    console.error(err);
    alert("Something went wrong. Try again");
  }
};

  return (
    <div className="product-recommendation-container">
      <button onClick={onBackToMain} className="back-to-main-button">
        ← Back to Main Page
      </button>

      {currentStep === 'productSelection' && (
        <div>
          <div className="recommendation-header">
            <h2 className="recommendation-title">Choose a Product Category</h2>
          </div>

          <div className="product-grid">
            {makeupProducts.map((product) => (
              <div
                key={product.id}
                className="product-selection-card"
                onClick={() => handleProductSelect(product)}
              >
                <div className="product-icon-container">
                  <img src={product.image} className="product-icon" />
                </div>
                <h3 className="product-card-title">{product.name}</h3>
                <p className="product-card-description">{product.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {currentStep === 'undertoneInput' && (
        <div>
          <div className="recommendation-header">
            <h2 className="recommendation-title">
              Get Recommendations for {currentProduct?.name}
            </h2>
          </div>

          <div className="form-container">
            <div className="form-group">
              <label className="form-label">Your Undertone</label>
              <select
                value={userUndertone}
                onChange={(e) => setUserUndertone(e.target.value)}
                className="form-select"
              >
                <option value="">Select your undertone</option>
                <option value="cool">Cool</option>
                <option value="warm">Warm</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Your Skin Shade</label>
              <select
                value={userSkinShade}
                onChange={(e) => setUserSkinShade(e.target.value)}
                className="form-select"
              >
                <option value="">Select your shade</option>
                <option value="light">Light</option>
                <option value="medium">Medium</option>
                <option value="tan">Tan</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            <button
              onClick={handleUndertoneSubmit}
              disabled={!userUndertone || !userSkinShade}
              className="primary-button"
            >
              Get My Recommendations
            </button>

            <div className="divider">— OR —</div>

            <button onClick={startQuiz} className="secondary-button">
              Take Undertone Quiz Instead
            </button>
          </div>
        </div>
      )}

      {currentStep === 'quiz' && (
        <div className="quiz-container">
          <div className="quiz-progress">
            <div className="quiz-progress-text">
              Question {currentQuizQuestion + 1} of {quizQuestions.length}
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${((currentQuizQuestion + 1) / quizQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <h2 className="quiz-question">
            {quizQuestions[currentQuizQuestion].question}
          </h2>

          <div className="quiz-options">
            {quizQuestions[currentQuizQuestion].options.map((option) => (
              <button
                key={option.value}
                onClick={() => handleQuizAnswer(option)}
                className="quiz-option"
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {currentStep === 'results' && (
        <div>
          <div className="results-header">
            <h2 className="results-title">
              Perfect {currentProduct?.name} Matches for You!
            </h2>
            <p className="recommendation-subtitle">
              Based on your <span className="undertone-badge">{userUndertone}</span> undertone
            </p>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">Finding your perfect matches...</p>
            </div>
          ) : (
            <div className="recommendation-list">
              {recommendations.map((rec) => (
                <div key={rec.id} className="recommendation-card">
                  <div className="recommendation-content">
                    <div className="recommendation-image-container">
                      <img src={rec.image} className="recommendation-image" />
                    </div>

                    <div className="recommendation-details">
                      <div className="recommendation-header-row">
                        <div>
                          <h3 className="recommendation-brand">{rec.brand}</h3>
                          <p className="recommendation-product-name">{rec.productName}</p>
                        </div>

                        <div className="recommendation-price-section">
                          <div className="recommendation-price">
                            {rec.priceTier === 'affordable' ? 'Affordable' : 'Expensive'}
                          </div>
                        </div>
                      </div>

                      <div className="shade-badge">Shade: {rec.shade}</div>

                      <p className="recommendation-description">{rec.description}</p>

                      <div className="recommendation-buttons">
                        <button 
  className="wishlist-button"
  onClick={() => addToWishlist(rec)}
>
  Add to Wishlist
</button>

                        <a
                          href={rec.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="learn-more-button"
                        >
                          Learn More
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="bottom-actions">
            <button onClick={() => setCurrentStep('undertoneInput')} className="gray-button">
              Try Different Settings
            </button>

            <button onClick={resetFlow} className="primary-button">
              Choose Different Product
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductRecommendationSystem;
