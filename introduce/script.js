// DOM이 로드되면 실행
document.addEventListener('DOMContentLoaded', function() {
    // 전체보기 메뉴 토글
    const allMenuToggle = document.querySelector('.all-menu-toggle');
    const allMenuContainer = document.querySelector('.all-menu-container');
    const pageWrapper = document.querySelector('.page-wrapper');
    
    if (allMenuToggle && allMenuContainer) {
        allMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation(); // 이벤트 버블링 방지
            
            // 전체 메뉴 토글
            allMenuContainer.classList.toggle('active');
            this.classList.toggle('active');
            
            // 페이지 컨텐츠 밀어내기
            if (pageWrapper) {
                pageWrapper.classList.toggle('menu-open');
            }
        });
        
        // 전체 메뉴 영역 외 클릭 시 닫기
        document.addEventListener('click', function(e) {
            if (!allMenuContainer.contains(e.target) && !allMenuToggle.contains(e.target)) {
                allMenuContainer.classList.remove('active');
                allMenuToggle.classList.remove('active');
                if (pageWrapper) {
                    pageWrapper.classList.remove('menu-open');
                }
            }
        });
    }
    
    // 모바일 메뉴 토글
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNavigation = document.querySelector('.main-navigation');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mainNavigation.classList.toggle('active');
            this.classList.toggle('active');
        });
    }

    // 부드러운 스크롤
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // 모바일 메뉴 닫기
                if (mainNavigation && mainNavigation.classList.contains('active')) {
                    mainNavigation.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                }
            }
        });
    });

    // 스크롤 시 헤더 스타일 변경
    let lastScrollTop = 0;
    const header = document.querySelector('.site-header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // 스크롤 방향 감지
        if (scrollTop > lastScrollTop && scrollTop > 300) {
            // 아래로 스크롤
            header.classList.add('hidden');
        } else {
            // 위로 스크롤
            header.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop;
    });

    // Intersection Observer를 사용한 스크롤 애니메이션
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

    // 애니메이션을 적용할 요소들
    const animatedElements = document.querySelectorAll('.campus-item');
    animatedElements.forEach(element => {
        element.classList.add('animate-on-scroll');
        observer.observe(element);
    });

    // 지도 초기화 (API 없이)
    initMapsWithoutAPI();
});

// API 없이 지도 영역 초기화
function initMapsWithoutAPI() {
    const campusData = {
        'map-seoul': {
            name: '서울 낙성대 캠퍼스',
            address: '서울특별시 관악구 남부순환로 1956, 2층',
            googleMapsUrl: 'https://maps.google.com/maps?q=서울특별시+관악구+남부순환로+1956&output=embed',
            naverMapsUrl: 'https://map.naver.com/v5/search/서울특별시%20관악구%20남부순환로%201956'
        },
        'map-busan': {
            name: '부산 서면 캠퍼스',
            address: '부산광역시 부산진구 부전로111번길 9, 2층',
            googleMapsUrl: 'https://maps.google.com/maps?q=부산광역시+부산진구+부전로111번길+9&output=embed',
            naverMapsUrl: 'https://map.naver.com/v5/search/부산광역시%20부산진구%20부전로111번길%209'
        },
        'map-gwangju': {
            name: '광주 중흥 캠퍼스',
            address: '광주광역시 북구 무등로180번길 9-18, 2층',
            googleMapsUrl: 'https://maps.google.com/maps?q=광주광역시+북구+무등로180번길+9-18&output=embed',
            naverMapsUrl: 'https://map.naver.com/v5/search/광주광역시%20북구%20무등로180번길%209-18'
        }
    };

    Object.keys(campusData).forEach(mapId => {
        const mapElement = document.getElementById(mapId);
        if (mapElement) {
            const campus = campusData[mapId];
            
            mapElement.innerHTML = `
                <div style="width: 100%; height: 100%; position: relative; background: #f8f9fa; border-radius: 8px; overflow: hidden;">
                    <!-- 구글 지도 임베드 -->
                    <iframe 
                        src="${campus.googleMapsUrl}"
                        width="100%" 
                        height="100%" 
                        style="border:0; border-radius: 8px;" 
                        allowfullscreen="" 
                        loading="lazy" 
                        referrerpolicy="no-referrer-when-downgrade">
                    </iframe>
                    
                    <!-- 지도 위 버튼들 -->
                    <div style="position: absolute; top: 10px; right: 10px; display: flex; gap: 5px;">
                        <button onclick="window.open('${campus.naverMapsUrl}', '_blank')" 
                                style="background: #03C75A; color: white; border: none; padding: 5px 10px; border-radius: 4px; font-size: 12px; cursor: pointer; font-weight: bold;">
                            네이버지도
                        </button>
                        <button onclick="window.open('https://maps.google.com/maps?q=${encodeURIComponent(campus.address)}', '_blank')" 
                                style="background: #4285F4; color: white; border: none; padding: 5px 10px; border-radius: 4px; font-size: 12px; cursor: pointer; font-weight: bold;">
                            구글지도
                        </button>
                    </div>
                    
                    <!-- 주소 정보 -->
                    <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); color: white; padding: 10px; font-size: 12px;">
                        <strong>${campus.name}</strong><br>
                        ${campus.address}
                    </div>
                </div>
            `;
        }
    });
}

// 갤러리 이미지 로드 실패 시 처리
document.addEventListener('DOMContentLoaded', function() {
    const galleryImages = document.querySelectorAll('.gallery-image');
    
    galleryImages.forEach(img => {
        img.addEventListener('error', function() {
            // 이미지 로드 실패 시 기본 이미지로 대체
            this.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIi8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiIgZmlsbD0iIzZjNzU3ZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuydtOuvuOyngCDspIXrs7Qg7KSR7J2EIOykkSDsl4bsip3ri4jri6Q8L3RleHQ+Cjwvc3ZnPg==';
            this.alt = '이미지를 불러올 수 없습니다';
        });
    });
});

// 유틸리티 함수들
const utils = {
    // 디바운스 함수
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // 쓰로틀 함수
    throttle: function(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// 윈도우 리사이즈 처리
window.addEventListener('resize', utils.debounce(function() {
    // 모바일 메뉴 초기화
    if (window.innerWidth > 768) {
        const mainNavigation = document.querySelector('.main-navigation');
        const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        
        if (mainNavigation && mainNavigation.classList.contains('active')) {
            mainNavigation.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }

        // 전체 메뉴 닫기
        const allMenuContainer = document.querySelector('.all-menu-container');
        const allMenuToggle = document.querySelector('.all-menu-toggle');
        const pageWrapper = document.querySelector('.page-wrapper');

        if (allMenuContainer) {
            allMenuContainer.classList.remove('active');
        }
        if (allMenuToggle) {
            allMenuToggle.classList.remove('active');
        }
        if (pageWrapper) {
            pageWrapper.classList.remove('menu-open');
        }
    }
}, 250));

// 페이지 로드 시 애니메이션
document.addEventListener('DOMContentLoaded', function() {
    const pageHeader = document.querySelector('.page-header');
    if (pageHeader) {
        setTimeout(() => {
            pageHeader.classList.add('loaded');
        }, 100);
    }
});