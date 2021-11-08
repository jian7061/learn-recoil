목차
소개
비동기 액션
스냅샷과 상태 모니터링
서버 사이드 렌더링 (부가 기능이라 생략)

데이터 정의는 아톰
파생 데이터는 셀렉터
데이터의 조작은 훅!


소개

1-1) 들어가기 전에
상태 관리 라이브러리
context API 기반으로 구현 => 함수형 컴포넌트에서만 사용가능
Hooks 으로 구성
한 애플리케이션에서 여래 개 사용 가능, 중첩도 가능 => 이 때 Recoil API는 가장 가까운 조상 RecoilRoot 에 접근

1-2) 기본 개념

<RecoilRoot />
context API 를 사용할 컴포넌트는 반드시 Provider 안에
마찬가지로, Recoil 사용할 컴포넌트는 반드시 RecoilRoot 로 감싸야
대체로 애플리케이션 루트에 둘 것이다.

import {RecoilRoot} from 'recoil';

function AppRoot(){
  return (
   <RecoilRoot>
     <ComponentThatUsesRecoil />
   </RecoilRoot>
  );
}



Atom
Recoil의 단위 데이터
atom() 함수에 key 와 default 전달해서 작성
배열, 객체도 가능

import {atom} from 'recoil';

const counter = atom({
  key: 'counter',
  default: 0
});


const user = atom({
  key: 'user',
  default: {
    firstName: 'Gildong',
    lastName: 'Hong',
    age: 30
  }
});

const todos = atom({
  key: 'todos',
  default: [
    '글 쓰기', 
    '발행하기'
  ]
});



컴포넌트에서는 아톰 객체를 훅에 전달하여 값을 가져오고 설정한다.

import {atom, useRecoilState} from 'recoil';

const counter = atom({
  key: 'counter',
  default: 0
});

function Counter(){
  const [count, setCount] = useRecoilState(counter);
  const incrementByOne = () => setCount(count + 1);

  return (
    <div>
      Count: {count}
      <br />
      <button onClick={incrementByOne}>Increment</button>
    </div>
  );
}






Selector
목적: 데이터 가공하기 / 기능 실행
selector() 함수에 key, get(필수), set(optional) 전달하여 작성
// 아톰에서는 이름과 성을 분리해서 저장했지만 성과 이름을 합한 fullname을 보고싶을때
=> 성과 이름을 연결해서 반환하는 셀렉터 만들어 사용하기
import {atom, selector, useRecoilState} from 'recoil';

const userState = atom({
  key: 'user',
  default: {
    firstName: 'Gildong',
    lastName: 'Hong'
  }
});

const userNameSelector = selector({
  key: 'userName',
  get: ({get}) => {
    const user = get(userState);
    return user.firstName +  ' ' + user.lastName;
  },
  set: ({set}, name) => {
    const names = name.split(' ');
    set(
      userState,
      (prevState) => ({
        ...prevState,
        firstName: names[0],
        lastName: names[1] || ''
      })
    );
  }
});

function User() {
  const [userName, setUserName] = useRecoilState(userNameSelector);
  const inputHandler = (event) => setUserName(event.target.value);

  return (
    <div>
      Full name: {userName}
      <br />
      <input type="text" onInput={inputHandler} />
    </div>
  );
}

1-3) API 세 가지
디폴트는 useRecoilState !!
useRecoilValue: 상태를 설정하지 않고 값만 가져오고 싶을 때
useSetRecoilValue: 값을 불러오지 않고 상태만 설정하고 싶을 때
useResetRecoilValue: 아톰이 정의하는 상태를 초기값으로 재설정하는 리셋 함수 구할 수 있음

import {atom, useRecoilValue} from 'recoil';

const counter = atom({
  key: 'counter',
  default: 0
});


function Counter() {
  const count = useRecoilValue(counter);

  return (
    <div>
      Count: {count}
    </div>
  );
}

function Counter() {
  const setCount = useSetRecoilValue(counter);
  const incrementByOne = () => setCount(count + 1);

  return (
    <div>
      <button onClick={incrementByOne}>Increment</button>
    </div>
  );
}

function Counter() {
  const resetCount = useResetRecoilValue(counter);
  const reset = () => resetCount();

  return (
    <div>
      <button onClick={reset}>Reset</button>
    </div>
  ); 
}



2. 비동기 액션
시간 지연을 두고 상태를 설정해야 한다거나
서버에서 데이터를 가져와서 사용해야 하는 경우

2-1) 동시 실행 모드 (Concurrent Mode)
React 가 알아서 렌더링 동작의 우선 순위를 정하고 적절한 때에 렌더링 해준다는 개념
=> 이를 위해 지원하는 기능 중 대표적인 게 <Suspense> 컴포넌트 : 렌더링이 준비될 때까지 렌더링 멈춰두는 모드
렌더링을 연기할 컴포넌트를 <Suspense> 컴포넌트로 감싸기
그 동안 보여주고 싶은 컨텐츠(로딩중...같은것)는 fallback 속성으로 전달

const ProfilePage = React.lazy(
  () => import (./ProfilePage')
);

<Suspense fallback={<Loading />}>
  <ProfilePage />
</Suspense>


2-2) 아톰의 비동기 기본값 설정

//0으로 설정했던 counter 아톰의 기본값을 10초 후 숫자 0으로 반환하는 Promise로 바꾸기 -> 사용할때는 <Suspense>로 <Counter /> 감싸기

import {atom, useRecoilState} from 'recoil';

const counter = atom({
  key: 'counter',
  default: new Promise(resolve =>{
    setTimeout(() => resolve(0), 10000);
  })
});

function Counter(){
  const [count, setCount] = useRecoilState(counter);
  const incrementByOne = () => setCount(count + 1);

  return (
  <div>
    Count: {count}
    <br />
    <button onClick= {incrementByOne}>Increment</button>
  </div>
 );
}



2-3) Loadable
아톰 또는 셀렉터의 현재 준비 상태와 값을 알려줌
비동기 값을 반환하는 아톰이나 셀렉터를 useRecoilValueLoadable 또는 useRecoilStateLoadable 훅에 전달하면 Loadable 인스턴스를 반환

import {atom, useRecoilValueLoadable} from 'recoil';


const countLoadable = useRecoilValueLoadable(counter);


Loadable의 프로퍼티 중 유용한 것: 현재 준비 상태 알려주는 state와 contents
state는 hasValue, hasError, loading 중 하나의 값이 됨
contents는 hasValue 상태일 때는 실제값, hasError 상태일 때는 에러 객체, loading 상태일 때는 Promise 객체가 된다.
비동기 아톰이나 셀렉터라 하더라도 Loadable 사용해서 값을 가져오고, loading 상태의 contents를 사용하지 않으면 <Suspense> 사용하지 않아도 됨

// Loadable 사용해 <Suspense> 없이 로딩 중 상태를 보여주는 카운터 컴포넌트
import {atom, useRecoilValueLoadable} from 'recoil';

const counter = atom({
  key: 'counter',
  default: new Promise(resolve => {
    setTimeout( () = > resolve(0), 10000);
  })
});

function Counter() {
  const countLoadale = useRecoilValueLoadable(counter);
  let count = ' ';

  switch (countLoadale.state) {
    case 'hasValue':
      count = countLoadable.contents; // contents는 Number
      break;
    case 'hasError':
      count = countLoadable.contents.message; // contents는 Error
      break;
    case 'loading':
    default:
      count = '... loading ...'; // 로딩 중일 때
  }

  return (
    <div>
      Count: {count}
    </div>
  );
}



2-4) 서버에서 데이터 가져오기
셀렉터에는 ‘데이터 가공' 이외에도 ‘기능의 실행'이라는 목적도 있다고 했음

//GitHub의 API를 통해 Recoil 프로젝트의 Star 수를 가져오는 셀렉터와 이를 표현하는 RecoilStar 컴포넌트
//비동기 값을 다루고 있으므로 당연히 <Suspense> 컴포넌트로 감싸주었다.

import {selector, useRecoilValue} from 'recoil';

const recoilStar = selector({
  key: 'recoil/star',
  get: async () => {
    const response = await fetch(
      'https://api.github.com/repos/facebookexperimental/Recoil'
    );
    const recoilProjectInfo = await response.json();
    return recoilProjectInfo.stargazers_count;
  }
});

function RecoilStar() {
  const starCount = useRecoilValue(recoilStar);
  return (
    <div>Stars of Recoil: {starCount}</div>
  );
}







2-5) 파라미터에 따라 데이터 가져오기
ex) 게시판에서 글 목록을 가져오는 postList 셀렉터가 있다고 생각해보자. 사용자가 다른 페이지 번호를 클릭하면 해당 페이지의 글 목록을 다시 읽어와야 할 것이다. 

이 때 사용할 수 있는 방법은 2가지!!

페이지 번호 아톰 작성 => 셀렉터에서 해당 번호 가져와서 url 변경하게 하기
import {atom, selector} from 'recoil';

const pageNumber = atom({
  key: 'pageNumber',
  default: 1,
});

const postList = selector({
  key: 'postList',
  get: async ({get}) => {
    const page  = get(pageNumber);
    const posts = await getPostList(page);
    return posts;
  }
}


selectorFamily 사용하기: 동일한 기능 수행하되, 파라미터에 따라 결과 달리할 때!!
//get 과 set 부분에 따라 파라미터를 전달받는 함수 생성기를 작성한다

import {selectorFamily} from 'recoil';

const postList = selectorFamily({
  key: 'postList',
  get: (page) => async () => {
    const posts = await getPostList(page);
    return posts;
  }
}


// 셀렉터 객체를 그대로 전달하는 대신 셀렉터 패밀리에 파라미터를 전달하여 실행하여 셀렉터를 생성하기

function PostList({page}) {
  const posts = useRecoilValue(postList(page));

  return (
    <div>
      {posts.map(post => <Post key={post.id} post={post} />)}
    </div>
  );
}


//앞 섹션에서 작성했던 recoilStar를 여러 프로젝트에 사용할 수 있는 projectStar로 바꿔보자. 또한 변수나 컴포넌트의 이름 외에 무엇이 달라졌는지 주의하면서 살펴보자.

import {selectorFamily, useRecoilValue} from 'recoil';

const projectStar = selectorFamily({
  key: 'project/star',
  get: (projectPath) => async () => {
    if (!projectPath) return '...';

    const response = await fetch(
      `https://api.github.com/repos/${projectPath}`
    );
    const projectInfo = await response.json();
    return projectInfo.stargazers_count;
  }
});

function ProjectStar() {
  const [project, setProject] = useState('');
  const starCount = useRecoilValue(projectStar(project));
  const changeProject = ({target}) => setProject(target.value);

  return (
    <div>
      Project:
      <select onChange={changeProject}>
        <option value="">Select Project</option>
        <option value="facebook/react">React</option>
        <option value="facebookexperimental/Recoil">Recoil</option>
      </select>
      <br />
      Stars: {starCount}
    </div>
  );
}


selector 와 selectorFamily 모두 캐시 사용
즉, 입력값이 동일한 경우 => get 메서드를 다시 실행하지 않고 캐시에 있는 값 반환
캐시키는 selector / selectorFamily 를 작성할 때 전달한 key 프로퍼티와 get 메서드 내부에 있는 의존성 (위 postList 셀렉터 예제의 경우 pageNumber 아톰)의 종류와 값, 그리고 실행시 전달된 파라미터로 결정됨.
 다만 selector는 파라미터를 전달하지 않으므로 key와 의존성 값으로만 캐시키의 동일성을 확인할 것이다.

selector와 selectorFamily 두 방식의 차이는 파라미터의 유무
따라서 굳이 상태에 저장할 필요가 없는 값이라면 selectorFamily를 사용해도 좋을 것이다.

파라미터를 전달하여 아톰을 작성하는 atomFamily도 있다


2-6) 비동기 셀렉터 안에서 Loadable 사용하기

비동기 셀렉터 안에서도 다른 셀렉터를 실행하고 반환된 값 사용 가능
//projectStar 셀렉터에서 랜덤한 값 반환하는 rand 셀렉터 실행하고 반환된 값을 별 갯수 뒤에 추가
import { selector, selectorFamily, useRecoilValue } from "recoil";

const rand = selector({
  key: "rand",
  get: () => Math.random()
});

const projectStar = selectorFamily({
  key: "project/star",
  get: projectPath => async ({ get }) => {
    if (!projectPath) return "...";

    const randomNum = get(rand);
    const response = await fetch(`https://api.github.com/repos/${projectPath}`);
    const projectInfo = await response.json();
    return projectInfo.stargazers_count + ' ' + randomNum;
  }
});




// 이제 rand 셀렉터를 5초 후에 랜덤한 숫자를 반환하는 비동기 셀렉터로 바꾸기
=> get(rand)는 Promise 객체 반환하므로 await 사용해 값 가져오기
import { selector, selectorFamily, useRecoilValue } from "recoil";

const rand = selector({
  key: "rand",
  get: () => new Promise(resolve =>
    setTimeout(() => resolve(Math.random()), 5000)
  )
});

const projectStar = selectorFamily({
  key: "project/star",
  get: projectPath => async ({ get }) => {
    if (!projectPath) return "...";

    const randomNum = await get(rand);
    const response = await fetch(`https://api.github.com/repos/${projectPath}`);
    const projectInfo = await response.json();
    return projectInfo.stargazers_count + ' ' + randomNum;
  }
});


// 잘 동작하지만 문제 있음. rand 셀렉터의 동작이 지연되면 projectStar 셀렉터 동작도 느려짐

=> 이 경우 noWait 함수 사용.
=> noWait에 셀렉터를 인수로 전달하며 실행하면 Loadable 객체를 반환하는 셀렉터 만들어짐

import {
  selector,
  selectorFamily,
  useRecoilValue,
  noWait
} from "recoil";

const rand = selector({
  key: "rand",
  get: () =>
    new Promise(resolve => setTimeout(() => resolve(Math.random()), 5000))
});

const projectStar = selectorFamily({
  key: "project/star",
  get: projectPath => async ({ get }) => {
    if (!projectPath) return "...";

    const randomNumLoadable = get(noWait(rand));
    const response = await fetch(`https://api.github.com/repos/${projectPath}`);
    const projectInfo = await response.json();

    if (randomNumLoadable.state === "hasValue") {
      return projectInfo.stargazers_count + " " + randomNumLoadable.contents;
    }

    return projectInfo.stargazers_count + " ...";
  }
});


스냅샵과 상태 모니터링

전역 데이터에 접근하기

3-1) 스냅샷
상태는 끊임없이 변함
스냅샷은 계속 변하는 상태의 “한 순간"!!
기본적으로 Snapshot은 값을 변경할 수 없는 불변 객체인데 map 또는 asyncMap 을 사용해 수정 가능

3-2) 스냅샷 얻기
3가지 방식으로 스냅샷을 가져올 수 있음
useRecoilSnapshot()
useRecoilTransactionObserver()
useRecoilCallback()

useRecoilSnapshot() : 제일 간단
import {useRecoilSnapshot} from 'recoil';

function SnapshotCount() {
  const snapshotList = useRef([]);
  const snapshot = useRecoilSnapshot();

  useEffect(() => {
    snapshotList.current = [...snapshotList.current, snapshot];
  }, [snapshot]);

  return (
    <p>Snapshot count: {snapshotList.current.length}</p>
  );
}


스냅샷은 상태가 변할 때마다 생성
=> SnapshotCount 컴포넌트는 상태가 변할 때마다 렌더링됨 => 성능 주의!!!!!

useRecoilTransactionObserver() (UNSTABLE)
이 훅에 전달된 콜백 함수는 아톰 상태가 변경될 때마다 호출되지만 여러 업데이트가 동시에 일어나는 경우에는 묶어서 한 번만 호출될 수 있음
첫 번째 인수로 호출할 콜백 함수
콜백 함수에 전달되는 첫 번째 인수는 snapshot과 previousSnapshot 이라는 프로퍼티를 가진 객체. 각 각 현재 스냅샷과 이전 스냅샷 의미함
컴포넌트를 다시 렌더링하지 않음
=> 스냅샷은 구할 수 있으면서 컴포넌트를 다시 렌더링하지 않으므로 성능에서 이득!!!
전역 상태를 모니터링하거나 디버깅할 때 유용

import {useRecoilTransactionObserver_UNSTABLE} from 'recoil';

function SnapshotCount() {
  const snapshotList = useRef([]);

  useRecoilTransactionObserver_UNSTABLE(({snapshot}) => {
    snapshotList.current = [...snapshotList.current, snapshot];
    console.log("Snapshot updated", snapshotList);
  });

  return (
    <p>Snapshot count: {snapshotList.current.length}</p>
  );
}


useRecoilCallback()
useCallback과 같이 의존성에 따라 갱신되는 메모이즈된 함수를 생성(useCallback 익히기)
다만, 생성된 함수에 스냅샷과 상태를 다루는 객체 및 함수가 함께 전달된다는 점이 다름
useRecoilCallback 에서 생성된 함수의 첫 번째 인수로 전달되는 

3-3) 스냅샷에서 상태값 가져오기 (스냅샷 구했으면 이제 사용해 볼 차례)
스냅샷 객체에 있는 getPromise와 getLoadable 메소드 이용해서 상태값 가져오기

3-4) 스냅샷의 상태값 변경하기
기본적으로 불변객체인 스냅샷은 map과 asyncMap 통해 값이 수정된 새로운 스냅샷 만들 수 있음

3-5) 특정 스냅샷으로 상태 되돌리기
특정 시점의 스냅샷을 보관해두었다가 모든 상태값을 특정 스냅샷에 저장된 것을 기준으로 설정
useGoToRecoilSnapshot 훅 사용
이 훅 사용하면 함수 반환, 이 함수에 스냅샷 객체 전달하면 해당 시점으로 상태 복원

function SnapshotCount() {
  const [snapshotList, setSnapshotList] = useState([]);
  const updateSnapshot = useRecoilCallback(({ snapshot }) => async () => {
    setSnapshotList(prevList => [...prevList, snapshot]);
  });
  const gotoSnapshot = useGotoRecoilSnapshot();

  return (
    <div>
      <p>Snapshot count: {snapshotList.length}</p>
      <button onClick={updateSnapshot}>현재 스냅샷 보관</button>
      <ul>
        {snapshotList.map((snapshot, index) => (
          <li key={index}>
            <button onClick={() => gotoSnapshot(snapshot)}>
              Snapshot #{index + 1}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}


3-6) 변경된 상태 모니터링하기
useTransactionObservation 훅 사용 (UNSTABLE)
=> 변경된 아톰 추적할 수 있음

 
