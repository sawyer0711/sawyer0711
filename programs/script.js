// DOM이 로드되면 실행
document.addEventListener('DOMContentLoaded', function() {
    // 전체보기 메뉴 토글 (HTML에 .all-menu-toggle가 있다면)
    const allMenuToggle = document.querySelector('.all-menu-toggle');
    const allMenuContainer = document.querySelector('.all-menu-container');
    const pageWrapper = document.querySelector('.page-wrapper');
    
    if (allMenuToggle && allMenuContainer) {
        allMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            
            allMenuContainer.classList.toggle('active');
            this.classList.toggle('active');
            
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

    // 자동 브레드크럼 생성
    generateBreadcrumb();
});

// 자동 브레드크럼 생성 함수
function generateBreadcrumb() {
    // 페이지별 경로 매핑
    const pathMap = {
        '/': '메인',
        '/programs': '프로그램',
        '/programs/': '프로그램'
    };

    const currentPath = window.location.pathname;
    const breadcrumbNav = document.querySelector('.breadcrumb-nav');
    
    if (!breadcrumbNav) return;

    // 메인 페이지인 경우 브레드크럼 숨기기
    if (currentPath === '/' || currentPath === '/index.html') {
        breadcrumbNav.style.display = 'none';
        return;
    }

    // 브레드크럼 보이기
    breadcrumbNav.style.display = 'block';

    // 경로 정리
    const cleanPath = currentPath.replace('/index.html', '');
    const pathSegments = cleanPath.split('/').filter(segment => segment !== '');
    
    // 브레드크럼 배열 생성
    const breadcrumbs = [{ name: '홈', path: '/' }];
    
    let currentFullPath = '';
    pathSegments.forEach(segment => {
        currentFullPath += '/' + segment;
        const name = pathMap[currentFullPath] || pathMap[currentFullPath + '/'] || segment;
        breadcrumbs.push({ name: name, path: currentFullPath });
    });

    // 브레드크럼 HTML 생성
    const breadcrumbContainer = document.querySelector('.breadcrumb-list');
    if (breadcrumbContainer) {
        breadcrumbContainer.innerHTML = '';
        
        breadcrumbs.forEach((breadcrumb, index) => {
            const li = document.createElement('li');
            li.className = 'breadcrumb-item';
            
            if (index === breadcrumbs.length - 1) {
                // 현재 페이지
                const span = document.createElement('span');
                span.className = 'breadcrumb-current';
                span.textContent = breadcrumb.name;
                li.appendChild(span);
            } else {
                // 링크 항목
                const a = document.createElement('a');
                a.href = breadcrumb.path;
                a.className = 'breadcrumb-link';
                a.textContent = breadcrumb.name;
                li.appendChild(a);
                
                // 구분자 추가
                const separator = document.createElement('span');
                separator.textContent = ' > ';
                separator.style.color = '#999';
                separator.style.margin = '0 8px';
                li.appendChild(separator);
            }
            
            breadcrumbContainer.appendChild(li);
        });
    }
}

// 페이지 변경 시 브레드크럼 업데이트 (SPA용)
window.addEventListener('popstate', function() {
    generateBreadcrumb();
});