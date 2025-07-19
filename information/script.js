// 유튜브 캐러셀 기능
let currentCarouselPosition = 0;
const videosPerView = 4;
let carouselInterval;

// 캐러셀 자동 재생 시작
function startCarouselAutoPlay() {
    carouselInterval = setInterval(() => {
        const videosContainer = document.getElementById('youtube-videos');
        const videoItems = videosContainer.querySelectorAll('.youtube-video-item');
        const totalVideos = videoItems.length;
        const maxPosition = Math.max(0, totalVideos - videosPerView);
        
        if (currentCarouselPosition < maxPosition) {
            moveCarousel(1);
        } else {
            // 마지막에 도달하면 처음으로 돌아감
            currentCarouselPosition = 0;
            const moveDistance = currentCarouselPosition * 320;
            videosContainer.style.transform = `translateX(-${moveDistance}px)`;
            updateCarouselButtons();
        }
    }, 10000); // 10초마다 자동 전환
}

// 캐러셀 자동 재생 재시작
function resetCarouselAutoPlay() {
    clearInterval(carouselInterval);
    startCarouselAutoPlay();
}

// 채널 정보
const CHANNEL_INFO = {
    channelId: 'UC_xQYC6tjtMWYGHIJWqN5MQ',
    url: 'https://www.youtube.com/@사유하는법학적성시험',
    // 재생목록 설정 (원하는 재생목록 ID로 변경)
    playlistId: null, // 예: 'PLrAXtmRdnEQy...' - 실제 재생목록 ID 필요
    usePlaylist: false // true로 설정하면 재생목록 사용, false면 채널 전체 영상
};

// 실제 채널에서 최신 영상을 가져오는 함수
async function loadYoutubeVideos() {
    const videosContainer = document.getElementById('youtube-videos');
    videosContainer.innerHTML = '<div class="loading-spinner">영상을 불러오는 중...</div>';
    
    try {
        let rssUrl;
        
        if (CHANNEL_INFO.usePlaylist && CHANNEL_INFO.playlistId) {
            // 재생목록 RSS 피드 사용
            rssUrl = `https://www.youtube.com/feeds/videos.xml?playlist_id=${CHANNEL_INFO.playlistId}`;
        } else {
            // 채널 전체 RSS 피드 사용
            rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_INFO.channelId}`;
        }
        
        const proxyUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
        
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        if (data.status === 'ok' && data.items && data.items.length > 0) {
            const videos = data.items.slice(0, 8).map(item => {
                const videoId = extractVideoId(item.link);
                return {
                    videoId: videoId,
                    title: item.title,
                    publishedAt: item.pubDate,
                    // 여러 썸네일 옵션 제공
                    thumbnail: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`, // 기본적으로 안정적인 hq 사용
                    thumbnailBackup: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
                };
            });
            
            displayVideos(videos);
        } else {
            throw new Error('영상을 찾을 수 없습니다.');
        }
        
    } catch (error) {
        videosContainer.innerHTML = `
            <div style="text-align: center; padding: 30px; background: #f8f9fa; border-radius: 8px;">
                <p style="color: #666; margin-bottom: 15px;">영상을 불러올 수 없습니다.</p>
                <a href="${CHANNEL_INFO.url}" target="_blank" 
                   style="color: #ff0000; font-weight: bold; text-decoration: underline;">
                   📺 채널 직접 방문하기
                </a>
            </div>
        `;
    }
}

// 영상 표시
function displayVideos(videos) {
    const videosContainer = document.getElementById('youtube-videos');
    
    videosContainer.innerHTML = videos.map(video => `
        <div class="youtube-video-item" onclick="openYoutubeVideo('${video.videoId}')">
            <img src="${video.thumbnail}" 
                 alt="${video.title}" 
                 class="youtube-thumbnail" 
                 onerror="this.onerror=null; this.src='https://img.youtube.com/vi/${video.videoId}/mqdefault.jpg'; setTimeout(() => { if(this.complete && this.naturalHeight === 0) this.src='https://img.youtube.com/vi/${video.videoId}/default.jpg'; }, 1000);"
                 onload="this.style.opacity='1';"
                 style="opacity: 0; transition: opacity 0.3s ease;">
            <div class="youtube-video-info">
                <h4 class="youtube-video-title">${video.title}</h4>
                <p class="youtube-video-date">${formatDate(video.publishedAt)}</p>
            </div>
        </div>
    `).join('');
    
    // 채널 링크 추가
    const channelLink = document.createElement('div');
    channelLink.style.cssText = 'text-align: center; margin-top: 20px; padding: 15px; background: #f4e9c1; border-radius: 8px;';
    channelLink.innerHTML = `
        <a href="${CHANNEL_INFO.url}" target="_blank" style="color: #333; font-weight: bold;">
            더 많은 영상 보기 [사유하는 법학적성시험 유튜브 채널] →
        </a>
    `;
    videosContainer.parentNode.appendChild(channelLink);
}

// 유튜브 URL에서 비디오 ID 추출
function extractVideoId(url) {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/;
    const match = url.match(regex);
    return match ? match[1] : '';
}

// 날짜 포맷팅
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// 유튜브 영상 열기
function openYoutubeVideo(videoId) {
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank');
}

// 캐러셀 이동
function moveCarousel(direction) {
    const videosContainer = document.getElementById('youtube-videos');
    const videoItems = videosContainer.querySelectorAll('.youtube-video-item');
    const totalVideos = videoItems.length;
    const maxPosition = Math.max(0, totalVideos - videosPerView);
    
    currentCarouselPosition += direction;
    
    if (currentCarouselPosition < 0) {
        currentCarouselPosition = 0;
    } else if (currentCarouselPosition > maxPosition) {
        currentCarouselPosition = maxPosition;
    }
    
    const moveDistance = currentCarouselPosition * (320); // 300px width + 20px margin
    videosContainer.style.transform = `translateX(-${moveDistance}px)`;
    
    updateCarouselButtons();
    resetCarouselAutoPlay(); // 수동 조작 시 자동 재생 재시작
}

// 캐러셀 버튼 상태 업데이트
function updateCarouselButtons() {
    const videosContainer = document.getElementById('youtube-videos');
    const videoItems = videosContainer.querySelectorAll('.youtube-video-item');
    const totalVideos = videoItems.length;
    const maxPosition = Math.max(0, totalVideos - videosPerView);
    
    const prevBtn = document.querySelector('.youtube-prev');
    const nextBtn = document.querySelector('.youtube-next');
    
    if (prevBtn && nextBtn) {
        prevBtn.style.opacity = currentCarouselPosition === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentCarouselPosition === maxPosition ? '0.5' : '1';
    }
}

// DOM이 로드되면 실행
document.addEventListener('DOMContentLoaded', function() {
    // 유튜브 영상 로드
    loadYoutubeVideos().then(() => {
        // 유튜브 영상 로드 완료 후 캐러셀 자동 재생 시작
        startCarouselAutoPlay();
    });
    
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

    // 부드러운 스크롤 - 현재 페이지 내 앵커만 처리
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
            
            // 같은 페이지 내에 해당 섹션이 있는 경우에만 부드러운 스크롤
            if (targetSection) {
                e.preventDefault();
                
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