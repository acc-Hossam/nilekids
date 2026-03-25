import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Facebook, WhatsApp, Phone } from '@mui/icons-material';
import './NurserySlider.css';

// Child-friendly image URLs (Unsplash - free to use)
const nurseryImages = [
  {
    src: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=1200&h=800&fit=crop",
    topic: "العب وتعلم",
    title: "مرح الحضانة",
    author: "عالم الطفل",
    des: "انضم إلى حضانتنا الممتعة حيث يكون كل يوم مغامرة! نوفر بيئة آمنة ومحبة لأطفالك الصغار للاستكشاف واللعب والنمو. أنشطتنا مصممة لإثارة الفضول والإبداع.",
    thumbTitle: "العب وتعلم",
    thumbDesc: "أنشطة ممتعة يومياً"
  },
  {
    src: "https://images.unsplash.com/photo-1596496181871-9681eacf9764?w=1200&h=800&fit=crop",
    topic: "الإبداع والفن",
    title: "الفن والحرف اليدوية",
    author: "عالم الطفل ",
    des: "دع خيالهم يحلق! تتضمن جلساتنا الفنية الرسم والتلوين والأشغال اليدوية باستخدام مواد آمنة وغير سامة. يعبر الأطفال عن أنفسهم بحرية ويطورون المهارات الحركية الدقيقة.",
    thumbTitle: "الإبداع والفن",
    thumbDesc: "مرح وإبداع!"
  },
  {
    src: "https://images.unsplash.com/photo-1575428774229-ef25f565c487?w=1200&h=800&fit=crop",
    topic: "اللعب في الخارج",
    title: "ساحة اللعب",
    author: "عالم الطفل",
    des: "أجسام صحية وعقول سعيدة! يوفر فناء اللعب الآمن لدينا هياكل للتسلق ومراجيح وألعاب جماعية تشجع على النشاط البدني والعمل الجماعي والضحك المتواصل.",
    thumbTitle: "اللعب في الخارج",
    thumbDesc: "مغامرات خارجية"
  },
  {
    src: "https://images.unsplash.com/photo-1485546246426-74dc88dec4d9?w=1200&h=800&fit=crop",
    topic: "وقت القصة",
    title: "قصص خيالية",
    author: "عالم الطفل",
    des: "استعد لوقت القصة! جلسات سرد القصص لدينا تبث الحياة في الشخصيات الخيالية، وتغرس حب القراءة وتبني المهارات اللغوية في جو سحري ومريح.",
    thumbTitle: "وقت القصة",
    thumbDesc: "الخيال ينمو"
  }
];

const Home: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationType, setAnimationType] = useState<'next' | 'prev' | null>(null);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  const totalSlides = nurseryImages.length;

  // Helper to get visible items for carousel (circular)
  const getVisibleItems = () => {
    const items = [];
    for (let i = -1; i <= 1; i++) {
      let idx = (currentIndex + i + totalSlides) % totalSlides;
      items.push({ ...nurseryImages[idx], originalIndex: idx });
    }
    return items;
  };

  const visibleItems = getVisibleItems();

  // Handle next slide
  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAnimationType('next');
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
    resetAutoTimer();
  };

  // Handle prev slide
  const goToPrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAnimationType('prev');
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    resetAutoTimer();
  };

  // Reset auto-slide timer
  const resetAutoTimer = () => {
    if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    autoTimerRef.current = setTimeout(() => {
      goToNext();
    }, 6000);
  };

  // Cleanup timers on unmount
  useEffect(() => {
    resetAutoTimer();
    return () => {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
    };
  }, []);

  // Clear animation flag after CSS transition
  useEffect(() => {
    if (isAnimating) {
      if (animTimerRef.current) clearTimeout(animTimerRef.current);
      animTimerRef.current = setTimeout(() => {
        setIsAnimating(false);
        setAnimationType(null);
      }, 500);
    }
  }, [isAnimating]);

  // Navigate to login (single button action)
  const handleSignIn = () => {
    navigate('/student-login');
  };

  // Get class names for carousel items based on position
  const getItemClass = (position: number) => {
    let classes = 'carousel-item';
    if (position === 0) classes += ' active';
    if (position === -1) classes += ' prev';
    if (position === 1) classes += ' next';
    if (animationType === 'next' && position === 1) classes += ' animate-in';
    if (animationType === 'prev' && position === -1) classes += ' animate-in';
    return classes;
  };

  // Get thumbnail items (circular)
  const getThumbnails = () => {
    const thumbs = [];
    for (let i = 0; i < totalSlides; i++) {
      const idx = (currentIndex + i) % totalSlides;
      thumbs.push({ ...nurseryImages[idx], originalIndex: idx });
    }
    return thumbs;
  };

  const thumbnails = getThumbnails();

  return (
    <div className="nursery-container">
      {/* Header with login button */}
      <header className="nursery-header">
        <nav className="logo-section">
          <img src="vite.svg" alt="Nile Kids Logo" className="logo-img" />
          <a href="https://qusnilekids.cloud" className="logo-text">Nile Kids</a>
        </nav>

        <nav className="social-links">
          <a href="https://www.facebook.com/nilekids166/" className="social-icon" aria-label="Facebook" title="Facebook"><Facebook /></a>
          <a href="https://wa.link/uk416b" className="social-icon" aria-label="WhatsApp" title="WhatsApp"><WhatsApp /></a>
          <a href="tel:+01115205349" className="social-icon" aria-label="Phone" title="Phone"><Phone /></a>
        </nav>

        <button className="login-button" onClick={handleSignIn}>
          Sign In
        </button>
      </header>

      {/* Main Carousel */}
      <div className={`nursery-carousel ${animationType ? 'animating' : ''}`}>
        <div className="carousel-list">
          {visibleItems.map((item, idx) => {
            const position = idx - 1; // -1, 0, 1
            return (
              <div key={`${item.originalIndex}-${idx}`} className={getItemClass(position)}>
                <div className="item-image">
                  <img src={item.src} alt={item.topic} />
                </div>
                <div className="item-content">
                  <div className="author">{item.author}</div>
                  <div className="title">{item.title}</div>
                  <div className="topic">{item.topic}</div>
                  <div className="description">{item.des}</div>
                  {/* Single button: Sign In */}
                  <div className="buttons">
                    <button className="signin-btn" onClick={handleSignIn}>
                      Sign In
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Thumbnail strip */}
        <div className="thumbnail-strip">
          {thumbnails.map((thumb, idx) => (
            <div key={idx} className="thumbnail-item">
              <img src={thumb.src} alt={thumb.thumbTitle} />
              <div className="thumbnail-content">
                <div className="thumb-title">{thumb.thumbTitle}</div>
                <div className="thumb-desc">{thumb.thumbDesc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        <div className="carousel-arrows">
          <button className="arrow prev-arrow" onClick={goToPrev} disabled={isAnimating}>
            ❮
          </button>
          <button className="arrow next-arrow" onClick={goToNext} disabled={isAnimating}>
            ❯
          </button>
        </div>

        {/* Progress bar */}
        <div className="time-progress">
          <div className="progress-bar"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
