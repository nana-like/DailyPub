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
                container: document.querySelector('#scroll-section-0')
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
        //각 스크롤 섹션의 높이 세팅
        for (let i=0; i < sceneInfo.length; i++) {
            sceneInfo[i].scrollHeight =  sceneInfo[i].heightNum * window.innerHeight;
            sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
        }
        console.log(sceneInfo);
    }

    function scrollLoop() {
        // * 참고: https://codepen.io/nykim_/pen/MWjZVNR?editors=0110

        prevScrollHeight = 0; //현재 내가 보고 있는 섹션보다 위에 있는 섹션들의 높이값을 합친 것

        for (let i=0; i < currentScene; i++) {
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
    }

    window.addEventListener('resize', setLayout);
    window.addEventListener('scroll', () => {
        yOffset = window.pageYOffset;
        scrollLoop();
    });

    setLayout();
})();
