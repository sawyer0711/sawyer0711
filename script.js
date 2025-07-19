// 슬라이드 기능
let slideIndex = 1;
let slideInterval;

// 슬라이드 변경 함수
function changeSlide(n) {
    showSlide(slideIndex += n);
    resetAutoSlide();
}

// 특정 슬라이드로 이동
function currentSlide(n) {
    showSlide(slideIndex = n);
    resetAutoSlide();
}

// 슬라이드 표시 함수
function showSlide(n) {
    const slides = document.getElementsByClassName('slide');
    const dots = document.getElementsByClassName('dot');
    
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    
    // 모든 슬라이드 숨기기
    for (let i = 0; i < slides.length; i++) {
        slides[i].classList.remove('active');
    }
    
    // 모든 점 비활성화
    for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove('active');
    }
    
    // 현재 슬라이드와 점 활성화
    slides[slideIndex - 1].classList.add('active');
    dots[slideIndex - 1].classList.add('active');
}

// 자동 슬라이드 시작
function startAutoSlide() {
    slideInterval = setInterval(() => {
        slideIndex++;
        showSlide(slideIndex);
    }, 5000); // 5초마다 자동 전환
}

// 자동 슬라이드 재시작
function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
}

// DOM이 로드되면 실행
document.addEventListener('DOMContentLoaded', function() {
    // 슬라이드 시작
    showSlide(slideIndex);
    startAutoSlide();

    // 부드러운 스크롤 - 앵커 링크용
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // 빈 href나 #만 있는 경우 무시
            if (targetId === '#' || targetId === '') {
                e.preventDefault();
                return;
            }
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 스크롤 시 헤더 스타일 변경
    let lastScrollTop = 0;
    const header = document.querySelector('.site-header');
    
    if (header) {
        window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // 스크롤 방향 감지 - 헤더 숨기기/보이기
            if (scrollTop > lastScrollTop && scrollTop > 300) {
                header.classList.add('hidden');
            } else {
                header.classList.remove('hidden');
            }
            
            lastScrollTop = scrollTop;
        });
    }

    // 솔루션 박스 애니메이션
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 솔루션 박스에 애니메이션 적용
    const animatedElements = document.querySelectorAll('.solution-box');
    animatedElements.forEach(element => {
        element.classList.add('animate-on-scroll');
        observer.observe(element);
    });

    // 자동 브레드크럼 생성
    generateBreadcrumb();
});

// 자동 브레드크럼 생성 함수
function generateBreadcrumb() {
    const currentPath = window.location.pathname;
    const breadcrumbNav = document.querySelector('.breadcrumb-nav');
    
    if (!breadcrumbNav) return;

    // 메인 페이지인 경우 브레드크럼 숨기기
    if (currentPath === '/' || currentPath === '/index.html') {
        breadcrumbNav.style.display = 'none';
        return;
    }

    // 다른 페이지인 경우 브레드크럼 보이기
    breadcrumbNav.style.display = 'block';

    // 간단한 브레드크럼 생성 (메인 페이지용)
    const breadcrumbContainer = document.querySelector('.breadcrumb-list');
    if (breadcrumbContainer) {
        breadcrumbContainer.innerHTML = `
            <li class="breadcrumb-item">
                <a href="/" class="breadcrumb-link">홈</a>
                <span style="color: #999; margin: 0 8px;"> > </span>
            </li>
            <li class="breadcrumb-item">
                <span class="breadcrumb-current">메인</span>
            </li>
        `;
    }
}