# Error that I encountered
```text
1. 리액트 컴포넌트 rerendering 되는 경우.
    -1.자신이 전달 받은 props업데이트 일어날때
    -2.자신의 state가 변경 될때.
    -3.부모 컴포넌트가 re-rendering될때
    -fix point:
        ./components/landingPages/BeforeLogin.js컴포넌트에서 msg부분 불필요하게 useState이용하여 msg업데이트 될때마다 리렌더링 되는 부분 document.getElementById로 innerHtml 수정하는 것으로 바꾸어 해결
2. setTimeout 실행 스택
    -1. document.getElementById가 setTimeout함수와 함께 고차 함수에서 호출되면
    그대로 page가 바뀌더라도 일정시간 이후에 실행이 되므로 page가 바뀐 경우 
    DOM요소를 찾을 수 없어 발생하는 에러 해결을 분기처리 하여 해결
3.Failed to set an indexed property on 'CSSStyleDeclaration
    -1. react 컴포넌트에서 style속성에 string으로 지정시 일어나는 오류였다.
    불필요하게 부여한 style속성 제거함으로 해결했다.
4. label tag에서 for은 nextjs에서 htmlFor로 바꾸어 쓴다.
5. pop up modal form 구현 하려고 고민하다 전역 변수 관리로 zustand사용했다
    - set함수 자식 컴포넌트에 넘겨도 정상적으로 전달된다. 대박이다.
6. Warning: Prop `style` did not match.
    - 어두운 테마 크롬 익스텐션 때문에 겹쳤다.
7. SignUp modal에서 나열 순서바꿔주니까 z-index바뀌는거 같다.
8. verification_code 간단하게 암호화 하였다. + masking도 적용하여 서버의 url가렸다.
9. 컴포넌트 안에서 조건부 함수 실행 => useEffect안에서 해당 조건에 분기하여 함수 실행할 수 있다.
10. axios post fetch 할 적에 axios header error(csrf)났었는데 next.config.js rewrite 마스킹 끄니까 되더라, 더 조사해야한다.
11. js-docstring 적극 활용하기
12. axios.post(url,data,{withCredential:true}) 설정을 해주어야 브라우저 쿠키에 저장이 된다.
13. cookie 값중 http-only==true이면 클라이언트단에서 접근 할 수 없다.
14. refresh token: http_only:true
-   access token: http_only:false로 지정하였다.
15. ajax시에 withCredential: true로 설정 해두어야 django에서 authentication
- 적용이 가능하다.
16. _app.js로 부터 child component가 바뀔때 마다 authentication check를 하도록 하였는데 access token의 유효기간이 30분인데다가 child component가 바뀔때 마다
어스 체크하는 것은 너무 비효율적이라 authentication fail 할 때마다 callback 으로 처리하는 방향으로 바꾸었다.
17. 16번을 해결하기 위해 updateCount로 access token 업데이트 통제
** 18. /components/layout/navbar/HeadNav엣서 signout시 인증이 되지 않는 경우
- 발생하는 에러 잡기 위해서 async로 zustand set함수 수정하였다.
-> 위 방법으로 해결하지 못하여 async 함수 내에서 await으로 비동기 함수 동기적으로 동작하게 하여 해결 + zustand의 set,get중 get함수 이용하여 호출된 후 가져올 수 있도록 함, 그 이전에는 변수에 값 할당해서 업데이트된 값을 가져오지 못했다.
19. zustand array update:
 - store내의 array요소 업데이트가 되어도 컴포넌트 안에서 input tag의  -value가 state로 관리되고 있어서 반영이 안됨 -> useEffect로 부모요소
 의 props를 바라보게 하여 해결
20. WorkoutRep 컴포넌트에서 input태그 value가 undefined의 경우 에러 발생
 - disabled(input 없애고 div로 전환하는 대신), checked(check box)의 boolean 값을 삼항연산자로 할당하여 해결
21. react state가 nested object로 이루어져있을때
    const [state,setState] = useState({
        root:{
            branch1:{val:2},
            branch2:{val:1}
        }
    });
    setState((prev)=>{
        let newState = {...prev};
        newState.root.branch1.val = 'fixed'
        return newState
    })
    와 같이 수정 가능하다. /sbd_animal/pages/dashboard/index.js -> initialSquatLogLoad함수에서

```

## memo
```text
1.prop으로 전달할 함수는 재생성 억제 위해 useCallback으로 전달
2. useRef로 리렌더링 시에도 유지 하는 성질 이용
3. overflow-auto로 높이 유지하면서 스크롤 가능하게 할 것
4. state 업데이트 시 setState((prev)=>[...prev,el])과 같이 처리해야 오류가 안 일어나더라
5. useState에서 element 삭제하기 위하여 filter 함수 적용시
 .map으로 랜더링 할때 컴포넌트의 key 어트리 뷰트가 변화 할수 있도록 element와 유관하게 
 설정해야만 제대로 동작 (pages/bulletinBoard/[id].js)
6.리액트에서 DOM에 document.querySelector등으로 직접 접근하지 않고
- useRef이용하여 접근후 그 child nodes에 접근해야한다면 ref.current.getElementsByTagName으로 접근하여 for of문으로 순회하자!!
```

## TODO:
```text
1. BeforeLogin 컴포넌트에서 로딩 시 모든 유저정보 초기화 하기 [O]
2. fetch error handling 구현 하기
3. useEffect clean-up 함수 이용하여 불필요한 처리 막기
4. history 캐싱해서 불필요한 ajax막기
5. user profile 사진 업로드및 profile 페이지 구현
6. model 올릴때 WorkoutOrigin.js에서 로드 하도록 해보자
```