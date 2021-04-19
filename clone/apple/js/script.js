(() => {
    let yOffset = 0; // window.pageYOffset
    let prevScrollHeight = 0; // 현재 스크롤 위치보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
    let currentScene = 0; //현재 보이는 섹션의 인덱스

    const sceneInfo = [
        {
            // 0
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0, //스크린 높이에 맞춰 비율로 지정
            objs: {
                container: document.querySelector('#scroll-section-0'),
                messages: document.querySelectorAll('#scroll-section-0 .sticky-elem')
            },
            values: {
                msg1_opacity: [0, 1]
            }
        },
        {
            // 1
            type: 'normal',
            heightNum: 5,
            scrollHeight: 0, //스크린 높이에 맞춰 비율로 지정
            objs: {
                container: document.querySelector('#scroll-section-1')
            }
        },
        {
            // 2
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0, //스크린 높이에 맞춰 비율로 지정
            objs: {
                container: document.querySelector('#scroll-section-2')
            }
        },
        {
            // 3
            type: 'sticky',
            heightNum: 5,
            scrollHeight: 0, //스크린 높이에 맞춰 비율로 지정
            objs: {
                container: document.querySelector('#scroll-section-3')
            }
        }
    ];

    function setLayout() {
        yOffset = window.pageYOffset;

        //각 스크롤 섹션의 높이 세팅
        for (let i=0; i < sceneInfo.length; i++) {
            sceneInfo[i].scrollHeight =  sceneInfo[i].heightNum * window.innerHeight;
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }

        // 활성화된 섹션 위치 정보를 얻기 위해 모든 섹션 높이를 더함
        let totalScollHeight = 0;
        for (let i=0; i < sceneInfo.length; i++) {
            totalScollHeight += sceneInfo[i].scrollHeight;

            // 단, 현재 스크롤 높이보다 커지면 계산을 멈춤
            if (totalScollHeight >= yOffset) {
                // 그리고 i 값을 currentScene으로 설정함
                currentScene = i;
                break;
            }
        }

        // 활성화된 섹션에게 클래스네임 추가
        document.body.setAttribute('id', `show-scene-${currentScene}`);
    }

    function calcValues(values, currentYOffset) {
        let rv;
        // 현재 섹션에서 스크롤한 비율
        let scrollRatio = currentYOffset / sceneInfo[currentScene].scrollHeight;
        rv = scrollRatio * (values[1] - values[0]) + values[0];
        return rv;
    }

    function playAnimation() {
        const objs = sceneInfo[currentScene].objs;
        const values = sceneInfo[currentScene].values;
        const currentYOffset = yOffset - prevScrollHeight;

        switch (currentScene) {
            case 0:
                let msg1_opacity_in = calcValues(values.msg1_opacity, currentYOffset);
                objs.messages[0].style.opacity = msg1_opacity_in;
                console.log( msg1_opacity_in );
                break;
            case 1:
                break;
            case 2:
                break;
            case 3:
                break;
        }
    }

    function scrollLoop() {
        // * 참고: https://codepen.io/nykim_/pen/MWjZVNR?editors=0110

        prevScrollHeight = 0; //현재 내가 보고 있는 섹션보다 위에 있는 섹션들의 높이값을 합친 것
        for (let i = 0; i < currentScene; i++) {
            prevScrollHeight += sceneInfo[i].scrollHeight;
        }

        if (yOffset >= (prevScrollHeight + sceneInfo[currentScene].scrollHeight)) {
            currentScene ++;
        }

        if (yOffset <= prevScrollHeight) {
            if (currentScene === 0) {
                return; //맥 환경에서 최상단에서 스크롤 시 바운스로 인해 음수 계산 되는 것 방지
            }
            currentScene --;
        }

        console.log('currentScene:', currentScene);

        // 활성화된 섹션에게 클래스네임 추가
        document.body.setAttribute('id', `show-scene-${currentScene}`);

        // 애니메이션 실행
        playAnimation();
    }

    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        scrollLoop();
    });
    window.addEventListener('resize', setLayout);
    window.addEventListener('load', setLayout);

})();
